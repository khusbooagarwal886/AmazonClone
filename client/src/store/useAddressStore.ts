import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address } from '../types';

export interface AddressState {
  currentUserId: string;
  userAddresses: Record<string, Address[]>;
  selectedAddressId: Record<string, string | null>;
  setUser: (userId: string | null) => void;
  addAddress: (address: Omit<Address, 'id'>) => string;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  getAddresses: () => Address[];
  getSelectedAddress: () => Address | null;
}

const DEFAULT_SAMPLE_ADDRESSES: Address[] = [
  {
    id: 'addr_default_1',
    fullName: 'Khusboo Agarwal',
    phone: '+91 98765 43210',
    street: 'Flat 402, Galaxy Heights, MG Road',
    apartment: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr_default_2',
    fullName: 'Khusboo Agarwal (Office)',
    phone: '+91 98765 43210',
    street: 'Tech Park Tower B, 5th Floor, Outer Ring Road',
    apartment: 'Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560103',
    country: 'India',
    isDefault: false,
  },
];

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      currentUserId: 'guest',
      userAddresses: {
        guest: [...DEFAULT_SAMPLE_ADDRESSES],
      },
      selectedAddressId: {
        guest: 'addr_default_1',
      },

      setUser: (userId: string | null) => {
        const userKey = userId && userId.trim() !== '' ? userId : 'guest';
        const { userAddresses, selectedAddressId } = get();

        // If new user has no addresses yet, initialize with default sample addresses
        if (!userAddresses[userKey] || userAddresses[userKey].length === 0) {
          set({
            currentUserId: userKey,
            userAddresses: {
              ...userAddresses,
              [userKey]: [...DEFAULT_SAMPLE_ADDRESSES],
            },
            selectedAddressId: {
              ...selectedAddressId,
              [userKey]: 'addr_default_1',
            },
          });
        } else {
          set({ currentUserId: userKey });
        }
      },

      addAddress: (newAddr) => {
        const id = 'addr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const { currentUserId, userAddresses, selectedAddressId } = get();
        const currentList = userAddresses[currentUserId] || [];

        const isFirst = currentList.length === 0;
        const makeDefault = newAddr.isDefault || isFirst;

        const updatedList = currentList.map((addr) =>
          makeDefault ? { ...addr, isDefault: false } : addr
        );

        const newEntry: Address = {
          ...newAddr,
          id,
          isDefault: makeDefault,
        };

        const nextList = [...updatedList, newEntry];

        set({
          userAddresses: {
            ...userAddresses,
            [currentUserId]: nextList,
          },
          selectedAddressId: {
            ...selectedAddressId,
            [currentUserId]: makeDefault ? id : (selectedAddressId[currentUserId] || id),
          },
        });

        return id;
      },

      updateAddress: (id, updates) => {
        const { currentUserId, userAddresses } = get();
        const currentList = userAddresses[currentUserId] || [];

        const updatedList = currentList.map((addr) => {
          if (addr.id === id) {
            return { ...addr, ...updates };
          }
          if (updates.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        });

        set({
          userAddresses: {
            ...userAddresses,
            [currentUserId]: updatedList,
          },
        });
      },

      deleteAddress: (id) => {
        const { currentUserId, userAddresses, selectedAddressId } = get();
        const currentList = userAddresses[currentUserId] || [];
        const nextList = currentList.filter((addr) => addr.id !== id);

        // If deleted address was default and there are remaining items, make the first one default
        if (nextList.length > 0 && !nextList.some((a) => a.isDefault)) {
          nextList[0].isDefault = true;
        }

        const currentSelected = selectedAddressId[currentUserId];
        const nextSelected = currentSelected === id ? (nextList[0]?.id || null) : currentSelected;

        set({
          userAddresses: {
            ...userAddresses,
            [currentUserId]: nextList,
          },
          selectedAddressId: {
            ...selectedAddressId,
            [currentUserId]: nextSelected,
          },
        });
      },

      setDefaultAddress: (id) => {
        const { currentUserId, userAddresses, selectedAddressId } = get();
        const currentList = userAddresses[currentUserId] || [];

        const nextList = currentList.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }));

        set({
          userAddresses: {
            ...userAddresses,
            [currentUserId]: nextList,
          },
          selectedAddressId: {
            ...selectedAddressId,
            [currentUserId]: id,
          },
        });
      },

      selectAddress: (id) => {
        const { currentUserId, selectedAddressId } = get();
        set({
          selectedAddressId: {
            ...selectedAddressId,
            [currentUserId]: id,
          },
        });
      },

      getAddresses: () => {
        const { currentUserId, userAddresses } = get();
        return userAddresses[currentUserId] || DEFAULT_SAMPLE_ADDRESSES;
      },

      getSelectedAddress: () => {
        const { currentUserId, userAddresses, selectedAddressId } = get();
        const list = userAddresses[currentUserId] || DEFAULT_SAMPLE_ADDRESSES;
        const selectedId = selectedAddressId[currentUserId];

        if (selectedId) {
          const found = list.find((a) => a.id === selectedId);
          if (found) return found;
        }

        const defaultAddr = list.find((a) => a.isDefault);
        return defaultAddr || list[0] || null;
      },
    }),
    {
      name: 'amazon-address-storage-v1',
      partialize: (state) => ({
        userAddresses: state.userAddresses,
        selectedAddressId: state.selectedAddressId,
        currentUserId: state.currentUserId,
      }),
    }
  )
);
