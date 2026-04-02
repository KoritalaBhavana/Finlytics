import { useFinanceStore } from '@/store/useFinanceStore';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';

export const BalanceTrend = () => {
  const { transactions } = useFinanceStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chartGridColor = isDark ? 'hsl(224, 28%, 18%)' : 'hsl(220, 13%, 91%)';
  const chartAxisColor = isDark ? 'hsl(215, 20%, 65%)' : 'hsl(220, 10%, 46%)';
  const tooltipBackground = isDark ? 'hsl(224, 28%, 12%)' : 'hsl(0, 0%, 100%)';
  const tooltipBorder = isDark ? 'hsl(224, 28%, 18%)' : 'hsl(220, 13%, 91%)';
  const tooltipText = isDark ? 'hsl(210, 40%, 98%)' : 'hsl(220, 25%, 10%)';

  const data = useMemo(() => {
    const monthly: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!monthly[month]) monthly[month] = { income: 0, expenses: 0 };
      if (t.type === 'income') monthly[month].income += t.amount;
      else monthly[month].expenses += t.amount;
    });

    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, vals]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        }),
        income: Math.round(vals.income),
        expenses: Math.round(vals.expenses),
        balance: Math.round(vals.income - vals.expenses),
      }));
  }, [transactions]);

  return (
    <div className="glass-card rounded-xl p-5 lg:p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Balance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(156, 72%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(156, 72%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke={chartAxisColor} />
            <YAxis tick={{ fontSize: 12 }} stroke={chartAxisColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBackground,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                fontSize: '13px',
                color: tooltipText,
              }}
              itemStyle={{ color: tooltipText }}
              labelStyle={{ color: tooltipText }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(156, 72%, 45%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
