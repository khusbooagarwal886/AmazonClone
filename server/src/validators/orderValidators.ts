import { z } from 'zod';

export const checkoutItemSchema = z.object({
  productId: z.string({ message: 'Product ID is required' }).min(1, 'Product ID cannot be empty'),
  quantity: z
    .number({ message: 'Quantity must be a number' })
    .int({ message: 'Quantity must be an integer' })
    .min(1, { message: 'Quantity must be at least 1' }),
});

export const checkoutSessionSchema = z.object({
  items: z
    .array(checkoutItemSchema, { message: 'Cart items array is required' })
    .min(1, { message: 'Cart must contain at least one item' }),
});

export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(['processing', 'shipped', 'delivered', 'cancelled'], {
    message: 'Status must be one of: processing, shipped, delivered, cancelled',
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
