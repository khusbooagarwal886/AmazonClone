import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { logger } from './config/logger';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import { handleStripeWebhook } from './controllers/orderController';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Connect to Database & Redis
connectDB();
connectRedis();

// Parse allowed CORS origins (supports comma-separated origins)
const allowedOrigins = ENV.CLIENT_URL.split(',').map((url) => url.trim());

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

// Stripe Webhook route (MUST be registered before express.json() to preserve raw Buffer for signature verification)
app.post(
  '/api/orders/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// JSON body parser for all other routes
app.use(express.json());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Healthcheck Route for Render / Railway / Cloud monitoring
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

// Root Route
app.get('/', (_req: Request, res: Response) => {
  res.send('Amazon Clone API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


// Error Handling Middleware (must be registered last)

app.use(notFound);
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  logger.info(`Server is running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`);
});


