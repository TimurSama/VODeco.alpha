import { create } from 'zustand';

interface WalletState {
  balance: string;
  staked: string;
  available: string;
  transactions: any[];
  stakings: any[];
  setBalance: (balance: string) => void;
  setStaked: (staked: string) => void;
  setAvailable: (available: string) => void;
  addTransaction: (transaction: any) => void;
  addStaking: (staking: any) => void;
  loadWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: '0',
  staked: '0',
  available: '0',
  transactions: [],
  stakings: [],

  setBalance: (balance) => set({ balance }),
  setStaked: (staked) => set({ staked }),
  setAvailable: (available) => set({ available }),
  
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  
  addStaking: (staking) =>
    set((state) => ({
      stakings: [...state.stakings, staking],
    })),

  loadWallet: async () => {
    try {
      const response = await fetch('/api/wallet');
      if (response.ok) {
        const data = await response.json();
        set({
          balance: data.balance || '0',
          staked: data.staked || '0',
          available: data.available || '0',
          transactions: data.transactions || [],
          stakings: data.stakings || [],
        });
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  },
}));
