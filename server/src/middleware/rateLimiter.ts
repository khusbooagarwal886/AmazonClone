import rateLimit from 'express-rate-limit';

// Rate limiter specifically for auth endpoints (register / login) to protect against brute-force attacks
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  limit: 5, // Max 5 requests per IP address within 1 minute
  message: {
    message: 'Too many requests from this IP, please try again after a minute.',
  },
  standardHeaders: 'draft-7', // Return standard `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
