
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getCurrentUser } from '@/lib/auth';
import BannerAd from '../ads/BannerAd';
import { initializeStorage } from '@/lib/data';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Initialize data in localStorage
    initializeStorage();
    
    // Check for protected routes that require authentication
    const user = getCurrentUser();
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (isAdminRoute && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
    
    setLoading(false);
  }, [location, navigate]);
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminPage && <Navbar isMobile={isMobile} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdminPage && (
        <>
          <div className="w-full max-w-7xl mx-auto my-4 px-4 flex flex-col space-y-4">
            <BannerAd />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;
