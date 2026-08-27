import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';
import { useAuthStore } from './useAuthStore';

export interface CartState {
  items: CartItem[];
  userCarts: Record<string, CartItem[]>;
  currentUserId: string;
  setUser: (userId: string | null) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const getActiveUserKey = (): string => {
  const user = useAuthStore.getState().user;
  const key = user?.id || user?._id || user?.email;
  return key && key.trim() !== '' ? key : 'guest';
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userCarts: {},
      currentUserId: 'guest',

      setUser: (userId: string | null) => {
        const userKey = userId && userId.trim() !== '' ? userId : 'guest';
        const { userCarts } = get();
        const activeItems = userCarts[userKey] || [];
        set({
          currentUserId: userKey,
          items: activeItems,
        });
      },

      addItem: (product: Product, quantity = 1) => {
        if (quantity <= 0) return;

        set((state) => {
          const userKey = getActiveUserKey();
          const currentItems = state.userCarts[userKey] || [];
          const productId = product._id || product.id;
          const existingIndex = currentItems.findIndex(
            (item) => (item.product._id || item.product.id) === productId
          );

          let updatedItems: CartItem[];

          if (existingIndex > -1) {
            updatedItems = [...currentItems];
            const existingItem = updatedItems[existingIndex];
            const newQuantity = existingItem.quantity + quantity;
            const finalQuantity =
              product.stock > 0 ? Math.min(newQuantity, product.stock) : newQuantity;

            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: finalQuantity,
            };
          } else {
            const initialQuantity =
              product.stock > 0 ? Math.min(quantity, product.stock) : quantity;
            updatedItems = [...currentItems, { product, quantity: initialQuantity }];
          }

          return {
            items: updatedItems,
            currentUserId: userKey,
            userCarts: {
              ...state.userCarts,
              [userKey]: updatedItems,
            },
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const userKey = getActiveUserKey();
          const currentItems = state.userCarts[userKey] || [];
          const updatedItems = currentItems.filter(
            (item) => item.product._id !== productId && item.product.id !== productId
          );

          return {
            items: updatedItems,
            currentUserId: userKey,
            userCarts: {
              ...state.userCarts,
              [userKey]: updatedItems,
            },
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          const userKey = getActiveUserKey();
          const currentItems = state.userCarts[userKey] || [];

          let updatedItems: CartItem[];

          if (quantity <= 0) {
            updatedItems = currentItems.filter(
              (item) => item.product._id !== productId && item.product.id !== productId
            );
          } else {
            updatedItems = currentItems.map((item) => {
              if ((item.product._id || item.product.id) === productId) {
                const validQuantity =
                  item.product.stock > 0
                    ? Math.min(quantity, item.product.stock)
                    : quantity;
                return { ...item, quantity: validQuantity };
              }
              return item;
            });
          }

          return {
            items: updatedItems,
            currentUserId: userKey,
            userCarts: {
              ...state.userCarts,
              [userKey]: updatedItems,
            },
          };
        });
      },

      clearCart: () => {
        set((state) => {
          const userKey = getActiveUserKey();
          return {
            items: [],
            currentUserId: userKey,
            userCarts: {
              ...state.userCarts,
              [userKey]: [],
            },
          };
        });
      },

      getTotalItems: () => {
        const userKey = getActiveUserKey();
        const activeItems = get().userCarts[userKey] || get().items || [];
        return activeItems.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const userKey = getActiveUserKey();
        const activeItems = get().userCarts[userKey] || get().items || [];
        return activeItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'amazon-cart-storage-v3',
      partialize: (state) => ({
        userCarts: state.userCarts,
        currentUserId: state.currentUserId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const userKey = getActiveUserKey();
          state.currentUserId = userKey;
          state.items = state.userCarts[userKey] || [];
        }
      },
    }
  )
);

// Subscribe to auth changes to immediately swap cart items on login/logout
useAuthStore.subscribe((authState) => {
  const userKey = authState.user?.id || authState.user?._id || authState.user?.email || null;
  useCartStore.getState().setUser(userKey);
});
