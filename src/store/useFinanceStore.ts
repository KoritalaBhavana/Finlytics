import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Role = 'viewer' | 'admin';
export type TransactionType = 'income' | 'expense';
export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Food & Dining'
  | 'Shopping'
  | 'Transportation'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Rent'
  | 'Travel'
  | 'Education';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

interface Filters {
  search: string;
  type: TransactionType | 'all';
  category: Category | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface FinanceState {
  role: Role;
  transactions: Transaction[];
  filters: Filters;
  setRole: (role: Role) => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
}

const defaultFilters: Filters = {
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

const mockTransactions: Transaction[] = [
  { id: '1', date: '2026-03-28', description: 'Monthly Salary', amount: 8500, type: 'income', category: 'Salary' },
  { id: '2', date: '2026-03-27', description: 'Grocery Store', amount: 142.50, type: 'expense', category: 'Food & Dining' },
  { id: '3', date: '2026-03-26', description: 'Freelance Project', amount: 2200, type: 'income', category: 'Freelance' },
  { id: '4', date: '2026-03-25', description: 'Electric Bill', amount: 89.00, type: 'expense', category: 'Utilities' },
  { id: '5', date: '2026-03-24', description: 'Online Shopping', amount: 267.30, type: 'expense', category: 'Shopping' },
  { id: '6', date: '2026-03-23', description: 'Movie Tickets', amount: 32.00, type: 'expense', category: 'Entertainment' },
  { id: '7', date: '2026-03-22', description: 'Uber Rides', amount: 45.60, type: 'expense', category: 'Transportation' },
  { id: '8', date: '2026-03-20', description: 'Stock Dividends', amount: 350, type: 'income', category: 'Investments' },
  { id: '9', date: '2026-03-19', description: 'Restaurant Dinner', amount: 78.90, type: 'expense', category: 'Food & Dining' },
  { id: '10', date: '2026-03-18', description: 'Monthly Rent', amount: 1800, type: 'expense', category: 'Rent' },
  { id: '11', date: '2026-03-15', description: 'Gym Membership', amount: 49.99, type: 'expense', category: 'Healthcare' },
  { id: '12', date: '2026-03-12', description: 'Freelance Design', amount: 1500, type: 'income', category: 'Freelance' },
  { id: '13', date: '2026-03-10', description: 'Flight Tickets', amount: 420, type: 'expense', category: 'Travel' },
  { id: '14', date: '2026-03-08', description: 'Online Course', amount: 199.99, type: 'expense', category: 'Education' },
  { id: '15', date: '2026-03-05', description: 'Coffee Shops', amount: 56.40, type: 'expense', category: 'Food & Dining' },
  { id: '16', date: '2026-02-28', description: 'Monthly Salary', amount: 8500, type: 'income', category: 'Salary' },
  { id: '17', date: '2026-02-25', description: 'Internet Bill', amount: 65, type: 'expense', category: 'Utilities' },
  { id: '18', date: '2026-02-22', description: 'Clothing Store', amount: 189.50, type: 'expense', category: 'Shopping' },
  { id: '19', date: '2026-02-18', description: 'Freelance Writing', amount: 800, type: 'income', category: 'Freelance' },
  { id: '20', date: '2026-02-15', description: 'Monthly Rent', amount: 1800, type: 'expense', category: 'Rent' },
  { id: '21', date: '2026-02-10', description: 'Gas Station', amount: 55.20, type: 'expense', category: 'Transportation' },
  { id: '22', date: '2026-02-05', description: 'Concert Tickets', amount: 120, type: 'expense', category: 'Entertainment' },
  { id: '23', date: '2026-01-28', description: 'Monthly Salary', amount: 8500, type: 'income', category: 'Salary' },
  { id: '24', date: '2026-01-20', description: 'Stock Dividends', amount: 280, type: 'income', category: 'Investments' },
  { id: '25', date: '2026-01-15', description: 'Monthly Rent', amount: 1800, type: 'expense', category: 'Rent' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      role: 'admin',
      transactions: mockTransactions,
      filters: defaultFilters,
      setRole: (role) => set({ role, filters: defaultFilters }),
      setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
      addTransaction: (t) =>
        set((state) => ({
          transactions: [{ ...t, id: crypto.randomUUID() }, ...state.transactions],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
    }),
    {
      name: 'finlytics-finance-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        role: state.role,
        transactions: state.transactions,
        filters: state.filters,
      }),
    }
  )
);

// Selectors
export const useFilteredTransactions = () => {
  const { transactions, filters } = useFinanceStore();
  let filtered = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  if (filters.type !== 'all') {
    filtered = filtered.filter((t) => t.type === filters.type);
  }

  if (filters.category !== 'all') {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  filtered.sort((a, b) => {
    const mult = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'date') {
      return mult * (new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return mult * (a.amount - b.amount);
  });

  return filtered;
};

export const useSummary = () => {
  const { transactions } = useFinanceStore();
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { balance: income - expenses, income, expenses };
};
