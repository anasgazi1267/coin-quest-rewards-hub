
import React from 'react';
import { getActiveBannerAds } from '@/lib/ads';

const BannerAd: React.FC = () => {
  const bannerAds = getActiveBannerAds();
  
  return (
    <div className="space-y-8">
      {bannerAds.length === 0 ? (
        <div className="w-full flex flex-col space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[234px] h-[60px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm mx-auto shadow-sm hover:shadow transition-shadow">
              Banner Ad Space {i}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-8 items-center">
          {bannerAds.map((ad, index) => (
            <div 
              key={ad.id}
              dangerouslySetInnerHTML={{ __html: ad.html }} 
              className="mx-auto w-[234px] h-[60px] overflow-hidden"
              style={{ width: '234px', height: '60px' }}
            />
          ))}
          {bannerAds.length < 3 && 
            Array.from({ length: 3 - bannerAds.length }).map((_, i) => (
              <div key={i} className="w-[234px] h-[60px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm mx-auto">
                Banner Ad Space {i + bannerAds.length + 1}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default BannerAd;
