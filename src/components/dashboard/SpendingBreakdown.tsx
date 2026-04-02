import { useFinanceStore } from '@/store/useFinanceStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';

const COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(165, 82%, 51%)',
  'hsl(262, 83%, 58%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(199, 89%, 48%)',
  'hsl(340, 82%, 52%)',
  'hsl(142, 76%, 36%)',
];

export const SpendingBreakdown = () => {
  const { transactions } = useFinanceStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const tooltipBackground = isDark ? 'hsl(224, 28%, 12%)' : 'hsl(0, 0%, 100%)';
  const tooltipBorder = isDark ? 'hsl(224, 28%, 18%)' : 'hsl(220, 13%, 91%)';
  const tooltipText = isDark ? 'hsl(210, 40%, 98%)' : 'hsl(220, 25%, 10%)';

  const data = useMemo(() => {
    const byCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      });
    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card rounded-xl p-5 lg:p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Spending Breakdown</h3>
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="h-48 w-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                contentStyle={{
                  backgroundColor: tooltipBackground,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: tooltipText,
                }}
                itemStyle={{ color: tooltipText }}
                labelStyle={{ color: tooltipText }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
                <span className="font-medium text-foreground">${item.value.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
