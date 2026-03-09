import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Store } from '../types';

interface StoreState {
  selectedStore: Store | null;
  stores: Store[];
  
  setSelectedStore: (store: Store | null) => void;
  setStores: (stores: Store[]) => void;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedStore: null,
      stores: [],

      setSelectedStore: (store) => {
        set({ selectedStore: store });
      },

      setStores: (stores) => {
        set({ stores });
      },
    }),
    {
      name: 'store-storage',
    }
  )
);
