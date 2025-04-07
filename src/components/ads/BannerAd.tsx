
import React, { useEffect, useState } from 'react';
import { getActiveBannerAds } from '@/lib/ads';

const BannerAd: React.FC = () => {
  const [bannerAds, setBannerAds] = useState(getActiveBannerAds());
  
  // Refresh banner ads when component mounts
  useEffect(() => {
    setBannerAds(getActiveBannerAds());
    
    // Listen for storage events that might update ad content
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key === 'rewards-app-ad-contents') {
        setBannerAds(getActiveBannerAds());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return (
    <div className="space-y-4">
      {bannerAds.length === 0 ? (
        <div className="w-full flex justify-center">
          <div className="w-[468px] h-[60px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm shadow-sm hover:shadow transition-shadow">
            Banner Ad Space
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          {bannerAds.length > 0 && (
            <div 
              key={bannerAds[0].id}
              dangerouslySetInnerHTML={{ __html: bannerAds[0].html }} 
              className="w-[468px] h-[60px] overflow-hidden rounded border border-gray-200"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BannerAd;
