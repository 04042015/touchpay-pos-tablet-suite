import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { 
  User, 
  Settings, 
  LogOut, 
  Menu,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  title?: string;
}

export function Header({ onMenuClick, showMenuButton = false, title = "TouchPay POS" }: HeaderProps) {
  const { state, getDashboardStats } = useAppContext();
  const { currentUser } = state;
  const stats = getDashboardStats();

  const handleLogout = () => {
    // Logout logic will be implemented later
    console.log('Logout clicked');
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="tablet:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">TP</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">
              {state.settings.restaurantName}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Stats */}
        <div className="hidden tablet:flex items-center gap-4 mr-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Pesanan Aktif</p>
            <p className="font-bold text-sm">{stats.activeOrders}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Pendapatan Hari Ini</p>
            <p className="font-bold text-sm text-success">
              Rp {stats.todayRevenue.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {stats.activeOrders > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
              {stats.activeOrders}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden tablet:block text-left">
                <p className="font-medium text-sm">
                  {currentUser?.username || 'Guest'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {currentUser?.role || 'N/A'}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}