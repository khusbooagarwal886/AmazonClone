import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        if (quantity <= 0) return;

        set((state) => {
          const productId = product._id || product.id;
          const existingIndex = state.items.findIndex(
            (item) => (item.product._id || item.product.id) === productId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingIndex];
            const newQuantity = existingItem.quantity + quantity;
            const finalQuantity =
              product.stock > 0 ? Math.min(newQuantity, product.stock) : newQuantity;

            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: finalQuantity,
            };

            return { items: updatedItems };
          }

          const initialQuantity =
            product.stock > 0 ? Math.min(quantity, product.stock) : quantity;

          return {
            items: [...state.items, { product, quantity: initialQuantity }],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.product._id !== productId && item.product.id !== productId
          ),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter(
              (item) => item.product._id !== productId && item.product.id !== productId
            ),
          }));
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if ((item.product._id || item.product.id) === productId) {
              const validQuantity =
                item.product.stock > 0
                  ? Math.min(quantity, item.product.stock)
                  : quantity;
              return { ...item, quantity: validQuantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'amazon-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
