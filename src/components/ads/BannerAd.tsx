
import React from 'react';
import { getActiveBannerAd } from '@/lib/ads';

const BannerAd: React.FC = () => {
  const bannerAd = getActiveBannerAd();
  
  if (!bannerAd) {
    return (
      <div className="w-full h-[60px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
        Banner Ad Space
      </div>
    );
  }
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: bannerAd.html }} 
      className="mx-auto"
    />
  );
};

export default BannerAd;
