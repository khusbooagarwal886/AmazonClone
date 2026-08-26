import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Review from '../models/Review';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';
import { CreateReviewInput } from '../validators/reviewValidators';
import { redisClient } from '../config/redis';
import { logger } from '../config/logger';

const PRODUCTS_CACHE_KEY = 'products:all';

// Helper to invalidate cached product lists when ratings change
const invalidateProductsCache = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.del(PRODUCTS_CACHE_KEY);
      logger.info(`[REDIS CACHE INVALIDATED] Key: ${PRODUCTS_CACHE_KEY}`);
    } catch (cacheErr) {
      logger.error(`Redis Invalidate Error: ${(cacheErr as Error).message}`);
    }
  }
};

// @route   POST /api/products/:id/reviews
// @desc    Create a new product review (only if user purchased product, or admin)
// @access  Private
export const createProductReview = async (
  req: AuthRequest<{ id: string }, unknown, CreateReviewInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: productId } = req.params;
    const { rating, title, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: 'Invalid product ID format' });
      return;
    }

    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // 1. Check if the target product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // 2. Check if user has already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (alreadyReviewed) {
      res.status(400).json({ message: 'You have already reviewed this product' });
      return;
    }

    // 3. Verified Purchase check (optional stretch): Check if user has purchased the item in a paid order
    const hasPurchased = await Order.exists({
      user: userId,
      isPaid: true,
      'orderItems.product': productId,
    });

    if (!hasPurchased && req.user?.role !== 'admin') {
      res.status(400).json({
        message: 'Only verified purchasers can submit a review for this product',
      });
      return;
    }

    // 4. Create the new review document
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      title: title || '',
      comment,
    });

    await review.populate('user', 'name');

    // Invalidate Redis product catalog cache to ensure new average rating and review counts reflect immediately
    await invalidateProductsCache();

    logger.info(`[REVIEW CREATED] User ${userId} (${req.user?.name}) reviewed product ${productId} with rating ${rating}`);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

import { MOCK_REVIEWS } from '../data/mockProducts';

// @route   GET /api/products/:id/reviews
// @desc    Get all reviews for a product
// @access  Public
export const getProductReviews = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: 'Invalid product ID format' });
      return;
    }

    if (mongoose.connection.readyState !== 1) {
      const filteredReviews = MOCK_REVIEWS.filter((r) => r.product === productId);
      res.status(200).json({
        success: true,
        count: filteredReviews.length,
        reviews: filteredReviews,
      });
      return;
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
