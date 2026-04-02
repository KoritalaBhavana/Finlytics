import {
  useFinanceStore,
  useFilteredTransactions,
  type Category,
  type Transaction,
} from '@/store/useFinanceStore';
import { Search, ArrowUpDown, Plus, Pencil, Trash2, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

const categories: Category[] = [
  'Salary',
  'Freelance',
  'Investments',
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Rent',
  'Travel',
  'Education',
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const TransactionForm = ({
  initial,
  onSave,
  onClose,
}: {
  initial?: Transaction;
  onSave: (data: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState({
    description: initial?.description || '',
    amount: initial?.amount?.toString() || '',
    date: initial?.date || new Date().toISOString().slice(0, 10),
    type: (initial?.type || 'expense') as 'income' | 'expense',
    category: (initial?.category || 'Food & Dining') as Category,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
      type: form.type,
      category: form.category,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Description</Label>
        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Amount</Label>
          <Input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as 'income' | 'expense' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initial ? 'Update' : 'Add'} Transaction
      </Button>
    </form>
  );
};

export const TransactionList = () => {
  const { role, filters, setFilter, addTransaction, deleteTransaction, editTransaction } = useFinanceStore();
  const transactions = useFilteredTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | undefined>();
  const isAdmin = role === 'admin';
  const hasActiveFilters = Boolean(filters.search) || filters.type !== 'all' || filters.category !== 'all';

  const toggleSort = () => {
    setFilter('sortBy', filters.sortBy === 'date' ? 'amount' : 'date');
  };

  return (
    <div className="glass-card rounded-xl p-5 lg:p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-foreground">Transactions</h3>
        {isAdmin && (
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditingTx(undefined);
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 transition-all duration-200 hover:scale-105">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTx ? 'Edit' : 'Add'} Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm
                initial={editingTx}
                onSave={(data) => {
                  if (editingTx) {
                    editTransaction(editingTx.id, data);
                  } else {
                    addTransaction(data);
                  }
                }}
                onClose={() => {
                  setDialogOpen(false);
                  setEditingTx(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.type}
          onValueChange={(v) => setFilter('type', v as 'income' | 'expense' | 'all')}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.category}
          onValueChange={(v) => setFilter('category', v as Category | 'all')}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={toggleSort} title={`Sort by ${filters.sortBy}`}>
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      </div>

      {transactions.length === 0 ? (
        <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20 px-6 py-10 text-center text-muted-foreground">
          <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
            <Wallet className="h-6 w-6" />
          </div>
          <p className="text-lg font-semibold text-foreground">
            {hasActiveFilters ? 'No transactions found' : 'No transactions yet'}
          </p>
          <p className="mt-1 max-w-sm text-sm">
            {hasActiveFilters
              ? 'Try clearing filters or adjusting the search to see matching activity.'
              : 'Add your first transaction to unlock charts, summaries, and insights.'}
          </p>
          {!hasActiveFilters && isAdmin ? (
            <Button
              className="mt-5 transition-all duration-200 hover:scale-105"
              onClick={() => {
                setEditingTx(undefined);
                setDialogOpen(true);
              }}
            >
              Add your first transaction
            </Button>
          ) : !hasActiveFilters ? (
            <p className="mt-4 text-xs">Switch to Admin to add transactions.</p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 group hover:-translate-y-0.5 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    transaction.type === 'income' ? 'bg-income' : 'bg-expense'
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    · {transaction.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-income' : 'text-expense'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 transition-transform duration-200 hover:scale-110"
                      onClick={() => {
                        setEditingTx(transaction);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive transition-transform duration-200 hover:scale-110"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
