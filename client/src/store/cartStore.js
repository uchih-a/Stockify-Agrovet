import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product._id === product._id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                unitPrice: product.price ?? 0,
              },
            ],
            isOpen: true,
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.product._id !== productId)
              : state.items.map((item) =>
                  item.product._id === productId ? { ...item, quantity } : item,
                ),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'agrovet-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const cartSelectors = {
  totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  totalAmount: (state) =>
    state.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
  isInCart:
    (productId) =>
    (state) =>
      state.items.some((item) => item.product._id === productId),
};

export default useCartStore;
