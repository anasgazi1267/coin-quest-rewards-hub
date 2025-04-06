
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Gift, 
  Users, 
  CheckSquare, 
  FileText, 
  Settings,
  LogOut,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

const NavSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  const links = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/rewards', icon: Gift, label: 'Rewards' },
    { href: '/admin/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/admin/ads', icon: FileText, label: 'Ads' },
    { href: '/admin/media', icon: Image, label: 'Media Library' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];
  
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card shadow-md">
      <div className="flex h-14 items-center border-b px-4 bg-primary text-primary-foreground">
        <Link to="/admin" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="grid gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default NavSidebar;
