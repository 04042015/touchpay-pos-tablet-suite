import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';
import { useAppContext } from '@/contexts/AppContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const { state } = useAppContext();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 tablet:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-card border-r border-border transition-transform duration-300 ease-in-out",
          "tablet:relative tablet:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "w-64",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">TP</span>
                </div>
                <div>
                  <h2 className="font-bold text-sm">TouchPay POS</h2>
                  <p className="text-xs text-muted-foreground">
                    {state.settings.restaurantName}
                  </p>
                </div>
              </div>
              
              {/* Close button for mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="tablet:hidden h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="font-medium text-sm">
                  {state.currentUser?.username?.charAt(0).toUpperCase() || 'G'}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">
                  {state.currentUser?.username || 'Guest User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {state.currentUser?.role || 'No Role'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto p-4">
            <Navigation />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              TouchPay POS v1.0<br />
              © 2024 TouchPay
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}