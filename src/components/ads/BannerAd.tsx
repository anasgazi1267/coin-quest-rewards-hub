
import React from 'react';
import { getActiveBannerAds } from '@/lib/ads';

const BannerAd: React.FC = () => {
  const bannerAds = getActiveBannerAds();
  
  return (
    <div className="space-y-4">
      {bannerAds.length === 0 ? (
        <div className="w-full flex justify-center">
          <div className="w-[234px] h-[60px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm shadow-sm hover:shadow transition-shadow">
            Banner Ad Space
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          {bannerAds.length > 0 && (
            <div 
              key={bannerAds[0].id}
              dangerouslySetInnerHTML={{ __html: bannerAds[0].html }} 
              className="w-[234px] h-[60px] overflow-hidden"
            />
          )}
          {bannerAds.length === 0 && (
            <div className="w-[234px] h-[60px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
              Banner Ad Space
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BannerAd;
