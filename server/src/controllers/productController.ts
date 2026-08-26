import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { CreateProductInput, UpdateProductInput } from '../validators/productValidators';
import { redisClient } from '../config/redis';
import { logger } from '../config/logger';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const PRODUCTS_CACHE_KEY = 'products:all';
const PRODUCTS_CACHE_TTL = 60; // 60 seconds

// @route   GET /api/products
// @desc    Get all products with optional filters (category, minPrice, maxPrice, search) & pagination
// @access  Public
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    // Parse and sanitize pagination parameters
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 12));
    const skip = (page - 1) * limit;

    // Build filter query for MongoDB based on query parameters
    const filter: Record<string, any> = {};

    // 1. Filter by category
    if (typeof category === 'string' && category.trim() !== '') {
      filter.category = category.trim().toLowerCase();
    }

    // 2. Filter by price range (minPrice and/or maxPrice)
    if (minPrice !== undefined && minPrice !== '') {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        filter.price = { ...filter.price, $gte: min };
      }
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        filter.price = { ...filter.price, $lte: max };
      }
    }

    // 3. Robust search query across product name, description, and category
    if (typeof search === 'string' && search.trim() !== '') {
      const terms = search.trim().split(/\s+/).filter(Boolean);
      if (terms.length > 0) {
        const termConditions = terms.map((term) => {
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const termRegex = { $regex: escapedTerm, $options: 'i' };
          return {
            $or: [
              { name: termRegex },
              { description: termRegex },
              { category: termRegex },
            ],
          };
        });

        if (termConditions.length === 1) {
          filter.$or = termConditions[0].$or;
        } else {
          filter.$and = termConditions;
        }
      }
    }


    const hasFilters = Object.keys(filter).length > 0;
    const isDefaultFirstPage = !hasFilters && page === 1 && !req.query.limit;

    // Check Redis cache first (only for default unfiltered first-page query)
    if (isDefaultFirstPage && redisClient && redisClient.isOpen) {
      try {
        const cachedData = await redisClient.get(PRODUCTS_CACHE_KEY);
        if (cachedData) {
          logger.info(`[REDIS CACHE HIT] Key: ${PRODUCTS_CACHE_KEY}`);
          res.status(200).json(JSON.parse(cachedData));
          return;
        }
      } catch (cacheErr) {
        logger.error(`Redis Get Error: ${(cacheErr as Error).message}`);
      }
    }

    if (isDefaultFirstPage) {
      logger.info(`[REDIS CACHE MISS] Key: ${PRODUCTS_CACHE_KEY} - Fetching from MongoDB`);
    } else if (hasFilters) {
      logger.info(`[FILTERED QUERY] Querying MongoDB with filter: ${JSON.stringify(filter)} (page ${page}, limit ${limit})`);
    } else {
      logger.info(`[PAGINATED QUERY] Querying MongoDB (page ${page}, limit ${limit})`);
    }

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...MOCK_PRODUCTS];

      // 1. Filter by category
      if (typeof category === 'string' && category.trim() !== '') {
        const cat = category.trim().toLowerCase();
        filtered = filtered.filter((p) => {
          if (cat === 'apparel' || cat === 'clothing') {
            return p.category === 'apparel' || p.category === 'clothing';
          }
          return p.category.toLowerCase() === cat;
        });
      }

      // 2. Filter by price
      if (minPrice !== undefined && minPrice !== '') {
        const min = Number(minPrice);
        if (!isNaN(min)) {
          filtered = filtered.filter((p) => p.price >= min);
        }
      }

      if (maxPrice !== undefined && maxPrice !== '') {
        const max = Number(maxPrice);
        if (!isNaN(max)) {
          filtered = filtered.filter((p) => p.price <= max);
        }
      }

      // 3. Filter by search term
      if (typeof search === 'string' && search.trim() !== '') {
        const query = search.trim().toLowerCase();
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const paginatedProducts = filtered.slice(skip, skip + limit);

      res.status(200).json({
        success: true,
        count: paginatedProducts.length,
        total,
        page,
        pages: totalPages,
        limit,
        products: paginatedProducts,
      });
      return;
    }

    // Query MongoDB with the constructed filter and pagination in parallel
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const responsePayload = {
      success: true,
      count: products.length,
      total,
      page,
      pages: totalPages,
      limit,
      products,
    };

    // Store result in Redis with 60-second TTL for default unfiltered first-page queries
    if (isDefaultFirstPage && redisClient && redisClient.isOpen) {
      try {
        await redisClient.set(PRODUCTS_CACHE_KEY, JSON.stringify(responsePayload), {
          EX: PRODUCTS_CACHE_TTL,
        });
      } catch (cacheErr) {
        logger.error(`Redis Set Error: ${(cacheErr as Error).message}`);
      }
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid product ID format',
      });
      return;
    }

    if (mongoose.connection.readyState !== 1) {
      const mockProduct = MOCK_PRODUCTS.find((p) => p._id === id);
      if (!mockProduct) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(200).json({
        success: true,
        product: mockProduct,
      });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to invalidate products cache on mutation
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

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
export const createProduct = async (
  req: AuthRequest<Record<string, string>, unknown, CreateProductInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.create({
      ...req.body,
      user: req.user?._id,
    });

    // Invalidate stale products list cache
    await invalidateProductsCache();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/products/:id
// @desc    Update an existing product
// @access  Private/Admin
export const updateProduct = async (
  req: AuthRequest<{ id: string }, unknown, UpdateProductInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid product ID format' });
      return;
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Invalidate stale products list cache
    await invalidateProductsCache();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
export const deleteProduct = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid product ID format' });
      return;
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Invalidate stale products list cache
    await invalidateProductsCache();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
