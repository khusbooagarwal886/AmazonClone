import { Router } from 'express';
import {
  createCheckoutSession,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { protect, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  checkoutSessionSchema,
  updateOrderStatusSchema,
} from '../validators/orderValidators';

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get all orders across the platform (Admin only)
 *     tags:
 *       - Orders (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all platform orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 */
router.get('/', protect, requireRole('admin'), getAllOrders);

/**
 * @openapi
 * /api/orders/myorders:
 *   get:
 *     summary: Get logged-in user order history
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User order history list
 *       401:
 *         description: Unauthorized
 */
router.get('/myorders', protect, getMyOrders);

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID (Owner or Admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get('/:id', protect, getOrderById);

/**
 * @openapi
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags:
 *       - Orders (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 *       404:
 *         description: Order not found
 */
router.put(
  '/:id/status',
  protect,
  requireRole('admin'),
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

/**
 * @openapi
 * /api/orders/checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout Session for the cart
 *     tags:
 *       - Checkout & Stripe
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - postalCode
 *                   - country
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: 123 Main St
 *                   city:
 *                     type: string
 *                     example: Seattle
 *                   state:
 *                     type: string
 *                     example: WA
 *                   postalCode:
 *                     type: string
 *                     example: 98101
 *                   country:
 *                     type: string
 *                     example: USA
 *     responses:
 *       200:
 *         description: Stripe checkout session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Validation error or insufficient stock
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/checkout-session',
  protect,
  validate(checkoutSessionSchema),
  createCheckoutSession
);

export default router;