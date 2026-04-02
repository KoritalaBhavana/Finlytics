import { useFinanceStore } from '@/store/useFinanceStore';
import { useMemo } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export const InsightsPanel = () => {
  const { transactions } = useFinanceStore();

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    const byCat: Record<string, number> = {};
    const byMonthCategory: Record<string, Record<string, number>> = {};
    const byMonth: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const monthKey = t.date.slice(0, 7);
      if (!byMonth[monthKey]) byMonth[monthKey] = { income: 0, expense: 0 };
      if (!byMonthCategory[monthKey]) byMonthCategory[monthKey] = {};
      if (t.type === 'income') {
        byMonth[monthKey].income += t.amount;
      } else {
        byMonth[monthKey].expense += t.amount;
        byCat[t.category] = (byCat[t.category] || 0) + t.amount;
        byMonthCategory[monthKey][t.category] = (byMonthCategory[monthKey][t.category] || 0) + t.amount;
      }
    });

    const months = Object.keys(byMonth).sort();
    const currentMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];

    const topCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    const currentMonthCategories = currentMonth ? byMonthCategory[currentMonth] : undefined;
    const currentTopCategory = currentMonthCategories
      ? Object.entries(currentMonthCategories).sort((a, b) => b[1] - a[1])[0]
      : undefined;

    let expenseChange = 0;
    if (prevMonth && currentMonth) {
      const curr = byMonth[currentMonth].expense;
      const prev = byMonth[prevMonth].expense;
      expenseChange = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
    }

    let categoryComparison: string | null = null;
    if (currentMonth && prevMonth && currentTopCategory) {
      const [category, currentAmount] = currentTopCategory;
      const prevAmount = byMonthCategory[prevMonth]?.[category] || 0;
      if (prevAmount > 0) {
        const diff = ((currentAmount - prevAmount) / prevAmount) * 100;
        categoryComparison = `You spent ${Math.abs(diff).toFixed(0)}% ${diff >= 0 ? 'more' : 'less'} on ${category} compared to last month`;
      } else {
        categoryComparison = `${category} is your top spending category this month`;
      }
    }

    // Savings rate
    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Largest single transaction
    const largest = expenses.sort((a, b) => b.amount - a.amount)[0];

    return { topCategory, expenseChange, savingsRate, largest, categoryComparison };
  }, [transactions]);

  const cards = [
    {
      icon: AlertTriangle,
      title: 'Spending Pulse',
      value: insights.categoryComparison
        ? insights.categoryComparison
        : insights.topCategory
          ? `${insights.topCategory[0]} leads your spending this period`
          : 'No data',
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
    },
    {
      icon: insights.expenseChange > 0 ? TrendingUp : TrendingDown,
      title: 'Monthly Expenses',
      value: `${insights.expenseChange > 0 ? '+' : ''}${insights.expenseChange.toFixed(1)}% vs last month`,
      color: insights.expenseChange > 0 ? 'text-expense' : 'text-income',
      bg: insights.expenseChange > 0 ? 'bg-expense/10' : 'bg-income/10',
    },
    {
      icon: Lightbulb,
      title: 'Savings Rate',
      value: `${insights.savingsRate.toFixed(1)}% of income saved`,
      color: 'text-chart-1',
      bg: 'bg-chart-1/10',
    },
    {
      icon: TrendingDown,
      title: 'Largest Expense',
      value: insights.largest
        ? `${insights.largest.description}: $${insights.largest.amount.toLocaleString()}`
        : 'No data',
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
    },
  ];

  return (
    <div className="glass-card rounded-xl p-5 lg:p-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Insights</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex items-start gap-3 p-3 min-h-24 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-sm"
          >
            <div className={`p-2 rounded-lg ${card.bg} flex-shrink-0`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5 leading-snug break-words">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
