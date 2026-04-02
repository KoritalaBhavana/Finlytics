import { useSummary } from '@/store/useFinanceStore';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export const SummaryCards = () => {
  const { balance, income, expenses } = useSummary();

  const cards = [
    {
      label: 'Total Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      gradient: 'gradient-primary',
      textClass: 'text-primary-foreground',
    },
    {
      label: 'Total Income',
      value: formatCurrency(income),
      icon: TrendingUp,
      gradient: 'gradient-income',
      textClass: 'text-primary-foreground',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(expenses),
      icon: TrendingDown,
      gradient: 'gradient-expense',
      textClass: 'text-primary-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`${card.gradient} rounded-xl p-5 lg:p-6 ${card.textClass} animate-slide-up relative overflow-hidden group cursor-default transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-0.5`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium opacity-90">{card.label}</span>
              <card.icon className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold tracking-tight">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
