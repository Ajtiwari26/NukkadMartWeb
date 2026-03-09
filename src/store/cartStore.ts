import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
  storeId: string;
}

interface CartStore {
  items: CartItem[];
  fulfillmentType: 'DELIVERY' | 'TAKEAWAY';
  addItem: (product: Product, storeId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItemQuantity: (productId: string) => number;
  setFulfillmentType: (type: 'DELIVERY' | 'TAKEAWAY') => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
  isDelivery: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      fulfillmentType: 'DELIVERY' as 'DELIVERY' | 'TAKEAWAY',

      addItem: (product, storeId, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.product_id === product.product_id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.product_id === product.product_id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity, storeId }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.product_id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.product_id === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      increaseQuantity: (productId) => {
        const item = get().items.find((i) => i.product.product_id === productId);
        if (item) {
          get().updateQuantity(productId, item.quantity + 1);
        }
      },

      decreaseQuantity: (productId) => {
        const item = get().items.find((i) => i.product.product_id === productId);
        if (item) {
          if (item.quantity <= 1) {
            get().removeItem(productId);
          } else {
            get().updateQuantity(productId, item.quantity - 1);
          }
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      setFulfillmentType: (type) => {
        set({ fulfillmentType: type });
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.product.product_id === productId);
        return item ? item.quantity : 0;
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getDeliveryFee: () => {
        const { fulfillmentType } = get();
        const subtotal = get().getSubtotal();
        if (fulfillmentType === 'TAKEAWAY') return 0;
        return subtotal >= 199 ? 0 : 20;
      },

      getTax: () => {
        const { fulfillmentType } = get();
        if (fulfillmentType === 'TAKEAWAY') return 0;
        return 5;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTax();
        return subtotal + deliveryFee + tax;
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      isDelivery: () => {
        return get().fulfillmentType === 'DELIVERY';
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
