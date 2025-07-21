import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  TableProperties,
  ClipboardList,
  CreditCard,
  BarChart3,
  Settings,
  ChefHat,
  Receipt
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['admin', 'kasir', 'waiter']
  },
  {
    title: 'Pemesanan',
    href: '/orders',
    icon: ShoppingCart,
    roles: ['kasir', 'waiter']
  },
  {
    title: 'Antrian',
    href: '/queue',
    icon: ChefHat,
    roles: ['admin', 'kasir', 'waiter']
  },
  {
    title: 'Meja',
    href: '/tables',
    icon: TableProperties,
    roles: ['admin', 'kasir', 'waiter']
  },
  {
    title: 'Produk',
    href: '/products',
    icon: Package,
    roles: ['admin', 'kasir']
  },
  {
    title: 'Kategori',
    href: '/categories',
    icon: ClipboardList,
    roles: ['admin']
  },
  {
    title: 'Pembayaran',
    href: '/payments',
    icon: CreditCard,
    roles: ['kasir', 'admin']
  },
  {
    title: 'Transaksi',
    href: '/transactions',
    icon: Receipt,
    roles: ['admin', 'kasir']
  },
  {
    title: 'Laporan',
    href: '/reports',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    title: 'Pengguna',
    href: '/users',
    icon: Users,
    roles: ['admin']
  },
  {
    title: 'Pengaturan',
    href: '/settings',
    icon: Settings,
    roles: ['admin']
  }
];

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const { state } = useAppContext();
  const userRole = state.currentUser?.role || 'kasir';
  
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <nav className={cn("space-y-1", className)}>
      {filteredItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "hover:bg-secondary hover:text-secondary-foreground",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}