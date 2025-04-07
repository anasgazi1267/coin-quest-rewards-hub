
import React from 'react';
import { AdContent } from '@/types';

interface PopupAdProps {
  content: AdContent;
}

const PopupAd: React.FC<PopupAdProps> = ({ content }) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: content.html }} 
      className="flex justify-center items-center border rounded-md p-4 min-h-[250px]"
    />
  );
};

export default PopupAd;
