import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string({ message: 'Product name is required' })
    .trim()
    .min(3, { message: 'Product name must be at least 3 characters long' })
    .max(120, { message: 'Product name cannot exceed 120 characters' }),
  description: z
    .string({ message: 'Description is required' })
    .trim()
    .min(10, { message: 'Description must be at least 10 characters long' })
    .max(2000, { message: 'Description cannot exceed 2000 characters' }),
  price: z
    .number({ message: 'Price is required and must be a number' })
    .positive({ message: 'Price must be greater than zero' }),
  category: z
    .string({ message: 'Category is required' })
    .trim()
    .toLowerCase()
    .min(2, { message: 'Category must be at least 2 characters long' }),
  stock: z
    .number({ message: 'Stock must be a number' })
    .int({ message: 'Stock must be a whole integer' })
    .nonnegative({ message: 'Stock cannot be negative' })
    .default(0),
  images: z
    .array(z.string().url({ message: 'Each image must be a valid URL string' }), {
      message: 'Images must be an array of URL strings',
    })
    .min(1, { message: 'At least one product image is required' }),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
