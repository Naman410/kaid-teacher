
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BarChart3, 
  ImageIcon,
  LogOut,
  Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: GraduationCap, label: 'Classes', href: '/classes' },
  { icon: Users, label: 'Students', href: '/students' },
  { icon: ImageIcon, label: 'Creations', href: '/creations' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-gray-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center mb-5">
            <h1 className="text-xl font-bold text-gray-900">KaiD Dashboard</h1>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="px-2 py-2 text-sm text-gray-500">
              Signed in as: {user?.email}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
