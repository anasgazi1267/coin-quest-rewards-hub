
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Coins, 
  User, 
  Gift, 
  CheckSquare, 
  LogOut 
} from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/auth';
import { useToast } from '@/components/ui/sonner';
import DailyRewardButton from '../rewards/DailyRewardButton';
import { getAppSettings } from '@/lib/settings';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = getCurrentUser();
  const appSettings = getAppSettings();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Coins className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">{appSettings.siteName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/rewards" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Rewards
            </Link>
            <Link to="/tasks" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Tasks
            </Link>
            
            {currentUser ? (
              <>
                <div className="flex items-center space-x-1 rounded-full bg-secondary px-3 py-1">
                  <Coins className="h-4 w-4 text-coin" />
                  <span className="text-sm font-medium">{currentUser.coins}</span>
                </div>
                
                <DailyRewardButton />
                
                <div className="relative ml-3">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {currentUser && (
              <div className="flex items-center space-x-1 rounded-full bg-secondary px-3 py-1 mr-4">
                <Coins className="h-4 w-4 text-coin" />
                <span className="text-sm font-medium">{currentUser.coins}</span>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/rewards"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Gift className="inline-block h-5 w-5 mr-2" />
              Rewards
            </Link>
            <Link
              to="/tasks"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <CheckSquare className="inline-block h-5 w-5 mr-2" />
              Tasks
            </Link>
            
            {currentUser ? (
              <>
                <DailyRewardButton isMobile />
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="inline-block h-5 w-5 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  <LogOut className="inline-block h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Button variant="outline" onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}>
                  Login
                </Button>
                <Button onClick={() => {
                  navigate('/register');
                  setIsOpen(false);
                }}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
