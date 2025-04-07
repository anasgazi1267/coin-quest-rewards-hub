
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coins, Menu, X } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getAppSettings } from '@/lib/settings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMobile, isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const appSettings = getAppSettings();
  
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <Coins className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden sm:inline-block">{appSettings.siteName}</span>
        </Link>
        
        {isMobile ? (
          <>
            <div className="ml-auto">
              <Button variant="ghost" size="icon" onClick={onClose} className="bg-white hover:bg-accent">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            
            {isOpen && (
              <div className="fixed inset-0 top-16 z-50 bg-background flex flex-col p-6 space-y-4">
                <Link to="/" className="text-lg font-medium bg-white rounded-md px-3 py-2 hover:bg-accent" onClick={onClose}>Home</Link>
                <Link to="/rewards" className="text-lg font-medium bg-white rounded-md px-3 py-2 hover:bg-accent" onClick={onClose}>Rewards</Link>
                <Link to="/tasks" className="text-lg font-medium bg-white rounded-md px-3 py-2 hover:bg-accent" onClick={onClose}>Tasks</Link>
                <Link to="/view-ads" className="text-lg font-medium bg-white rounded-md px-3 py-2 hover:bg-accent" onClick={onClose}>View Ads</Link>
                
                {user ? (
                  <>
                    <Link to="/withdrawals" className="text-lg font-medium bg-white rounded-md px-3 py-2 hover:bg-accent" onClick={onClose}>Withdrawals</Link>
                    <Link to="/profile" className="text-lg font-medium bg-white rounded-md px-3 py-2 hover:bg-accent" onClick={onClose}>Profile</Link>
                    <Button variant="destructive" onClick={() => {
                      localStorage.removeItem('coin-quest-current-user');
                      navigate('/login');
                      onClose();
                    }}>
                      Log Out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button onClick={() => { navigate('/login'); onClose(); }}>Login</Button>
                    <Button variant="outline" onClick={() => { navigate('/register'); onClose(); }}>
                      Register
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary bg-white px-3 py-1 rounded-md hover:bg-accent">
                Home
              </Link>
              <Link to="/rewards" className="text-sm font-medium transition-colors hover:text-primary bg-white px-3 py-1 rounded-md hover:bg-accent">
                Rewards
              </Link>
              <Link to="/tasks" className="text-sm font-medium transition-colors hover:text-primary bg-white px-3 py-1 rounded-md hover:bg-accent">
                Tasks
              </Link>
              <Link to="/view-ads" className="text-sm font-medium transition-colors hover:text-primary bg-white px-3 py-1 rounded-md hover:bg-accent">
                View Ads
              </Link>
              {user && (
                <Link to="/withdrawals" className="text-sm font-medium transition-colors hover:text-primary bg-white px-3 py-1 rounded-md hover:bg-accent">
                  Withdrawals
                </Link>
              )}
            </nav>
            
            <div className="ml-auto flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-accent/50 px-3 py-1 rounded-full">
                    <Coins className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">{user.coins}</span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative bg-white hover:bg-accent">
                        {user.name || user.username}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      {user.role === 'admin' && (
                        <>
                          <DropdownMenuItem onSelect={() => navigate('/admin')}>
                            Admin Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onSelect={() => navigate('/profile')}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => navigate('/withdrawals')}>
                        My Withdrawals
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => {
                        localStorage.removeItem('coin-quest-current-user');
                        navigate('/login');
                      }}>
                        Log Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => navigate('/login')} className="bg-white hover:bg-accent">Login</Button>
                  <Button onClick={() => navigate('/register')}>Register</Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
