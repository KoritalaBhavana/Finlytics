import { useFinanceStore, type Role } from '@/store/useFinanceStore';
import { Shield, Eye } from 'lucide-react';

export const RoleToggle = () => {
  const { role, setRole } = useFinanceStore();

  const roles: { value: Role; label: string; icon: typeof Shield }[] = [
    { value: 'admin', label: 'Admin', icon: Shield },
    { value: 'viewer', label: 'Viewer', icon: Eye },
  ];

  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
      {roles.map((r) => (
        <button
          key={r.value}
          onClick={() => setRole(r.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
            role === r.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <r.icon className="w-3.5 h-3.5" />
          {r.label}
        </button>
      ))}
    </div>
  );
};
