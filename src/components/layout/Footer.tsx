
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, ExternalLink } from 'lucide-react';
import { getAppSettings } from '@/lib/settings';

const Footer: React.FC = () => {
  const appSettings = getAppSettings();
  
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <Coins className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold text-gray-900">{appSettings.siteName}</span>
          </div>
          
          <div className="mt-4 md:mt-0">
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/" className="text-gray-500 hover:text-primary text-sm">
                Home
              </Link>
              <Link to="/rewards" className="text-gray-500 hover:text-primary text-sm">
                Rewards
              </Link>
              <Link to="/tasks" className="text-gray-500 hover:text-primary text-sm">
                Tasks
              </Link>
              <Link to="/profile" className="text-gray-500 hover:text-primary text-sm">
                Profile
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {appSettings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
