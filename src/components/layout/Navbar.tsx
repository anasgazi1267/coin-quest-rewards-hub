
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser, logout } from '@/lib/auth';
import { User, LogOut, Menu, X } from 'lucide-react';
import { toast } from '@/lib/toast';
import DailyRewardButton from '@/components/rewards/DailyRewardButton';

interface NavbarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMobile, isOpen, onClose }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="font-bold text-2xl">
          CoinMaster
        </Link>

        {isMobile ? (
          <button onClick={onClose}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <DailyRewardButton />
            {currentUser ? (
              <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{currentUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Navbar;
