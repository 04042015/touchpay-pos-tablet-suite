import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content area */}
      <div className="tablet:ml-64">
        {/* Header */}
        <Header 
          title={title}
          showMenuButton={true}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        {/* Page content */}
        <main className={cn(
          "p-4 tablet:p-6",
          "min-h-[calc(100vh-4rem)]" // Subtract header height
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}