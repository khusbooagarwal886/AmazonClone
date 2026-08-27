import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import { AuthRequest } from '../middleware/auth';
import { stripe } from '../config/stripe';
import { ENV } from '../config/env';
import Product from '../models/Product';
import Order from '../models/Order';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import {
  CheckoutSessionInput,
  UpdateOrderStatusInput,
} from '../validators/orderValidators';
import { logger } from '../config/logger';

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private (Authenticated users only)
 */
export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    logger.error(`Failed to fetch orders for user: ${req.user?._id}`, error);
    next(error);
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (Owner or Admin only)
 */
export const getOrderById = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      res.status(404).json({ message: `Order not found with ID: ${id}` });
      return;
    }

    // Ensure only the order owner or an admin can access order details
    const orderUser = order.user as unknown as { _id?: { toString: () => string }; toString: () => string };
    const orderUserId = orderUser._id ? orderUser._id.toString() : orderUser.toString();

    if (orderUserId !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to view this order' });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    logger.error(`Failed to fetch order: ${req.params.id}`, error);
    next(error);
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    logger.error('Failed to fetch all orders for admin', error);
    next(error);
  }
};

/**
 * @desc    Update order status (Admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (
  req: Request<{ id: string }, unknown, UpdateOrderStatusInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: `Order not found with ID: ${id}` });
      return;
    }

    order.status = status;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      order.isDelivered = false;
    }

    const updatedOrder = await order.save();
    logger.info(`Order ${id} status updated to '${status}' by admin`);

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    logger.error(`Failed to update order status for order ID: ${req.params.id}`, error);
    next(error);
  }
};

/**
 * @desc    Create Stripe Checkout Session for cart items
 * @route   POST /api/orders/checkout-session
 * @access  Private (Authenticated users only)
 */
export const createCheckoutSession = async (
  req: AuthRequest<Record<string, string>, unknown, CheckoutSessionInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { items } = req.body;

    // Fetch product details from MongoDB to prevent client-side price tampering
    const lineItems = [];
    const orderItemsSummary = [];

    for (const item of items) {
      let product: any = null;

      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(item.productId)) {
        try {
          product = await Product.findById(item.productId);
        } catch {
          // fallback to mock products if not found
        }
      }

      if (!product) {
        product = MOCK_PRODUCTS.find((p) => p._id === item.productId);
      }

      if (!product) {
        res.status(404).json({
          message: `Product not found with ID: ${item.productId}`,
        });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          message: `Insufficient stock for '${product.name}'. Available: ${product.stock}, requested: ${item.quantity}`,
        });
        return;
      }

      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
            images: product.images && product.images.length > 0 ? [product.images[0]] : [],
            description: product.description ? product.description.slice(0, 200) : undefined,
          },
          unit_amount: Math.round(product.price * 100), // Stripe takes amounts in cents
        },
        quantity: item.quantity,
      });

      orderItemsSummary.push({
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
      });
    }

    // Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: req.user.email,
      client_reference_id: req.user._id.toString(),
      metadata: {
        userId: req.user._id.toString(),
        orderItems: JSON.stringify(orderItemsSummary),
      },
      success_url: `${ENV.CLIENT_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ENV.CLIENT_URL}/cart`,
    });

    logger.info(`Stripe Checkout Session created: ${session.id} for user: ${req.user._id}`);

    res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    logger.error('Failed to create Stripe Checkout session', error);
    next(error);
  }
};

/**
 * @desc    Stripe Webhook listener for asynchronous payment events
 * @route   POST /api/orders/webhook
 * @access  Public (Secured via cryptographic signature verification)
 */
export const handleStripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    logger.warn('Stripe webhook received without stripe-signature header');
    res.status(400).send('Missing stripe-signature header');
    return;
  }

  if (!ENV.STRIPE_WEBHOOK_SECRET) {
    logger.error('STRIPE_WEBHOOK_SECRET is not configured on the server');
    res.status(500).send('Webhook secret is not configured');
    return;
  }

  let event: Stripe.Event;

  try {
    // Construct and verify the webhook event using the raw buffer body
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown signature error';
    logger.error(`⚠️ Stripe webhook signature verification failed: ${message}`);
    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  // Process the verified Stripe event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      logger.info(
        `✓ Stripe Checkout payment confirmed for Session: ${session.id} (Customer: ${session.customer_email})`
      );

      try {
        const userId = session.metadata?.userId;
        const orderItemsRaw = session.metadata?.orderItems;

        if (userId && orderItemsRaw) {
          // Idempotency: avoid creating duplicate orders on webhook retries
          const existingOrder = await Order.findOne({ 'paymentResult.id': session.id });

          if (!existingOrder) {
            const rawItems = JSON.parse(orderItemsRaw) as Array<{
              productId: string;
              name: string;
              price: number;
              quantity: number;
              image: string;
            }>;

            const order = await Order.create({
              user: userId,
              orderItems: rawItems.map((item) => ({
                product: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || '',
              })),
              totalPrice: session.amount_total ? session.amount_total / 100 : 0,
              isPaid: true,
              paidAt: new Date(),
              paymentResult: {
                id: session.id,
                status: session.payment_status,
                email_address: session.customer_email || undefined,
              },
              status: 'processing',
            });

            // Decrement product inventory stock
            for (const item of rawItems) {
              await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
              });
            }

            logger.info(`✓ Created Order ${order._id} for User ${userId}`);
          } else {
            logger.info(`Order already exists for Stripe Session: ${session.id}`);
          }
        }
      } catch (orderErr) {
        logger.error('Error creating Order document from Stripe webhook session', orderErr);
      }

      break;
    }
    default:
      logger.info(`Received unhandled Stripe webhook event: ${event.type}`);
  }

  // Acknowledge receipt to Stripe with 200 OK
  res.status(200).json({ received: true });
};


