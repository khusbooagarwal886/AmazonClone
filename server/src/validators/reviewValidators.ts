import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z
    .number({ message: 'Rating is required and must be a number' })
    .int({ message: 'Rating must be a whole number' })
    .min(1, { message: 'Rating must be at least 1 star' })
    .max(5, { message: 'Rating cannot exceed 5 stars' }),
  title: z
    .string()
    .trim()
    .max(100, { message: 'Review title cannot exceed 100 characters' })
    .optional()
    .default(''),
  comment: z
    .string({ message: 'Review comment is required' })
    .trim()
    .min(5, { message: 'Review comment must be at least 5 characters long' })
    .max(1000, { message: 'Review comment cannot exceed 1000 characters' }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
