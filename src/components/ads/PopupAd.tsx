
import React from 'react';
import { AdContent } from '@/types';

interface PopupAdProps {
  content: AdContent;
}

const PopupAd: React.FC<PopupAdProps> = ({ content }) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: content.html }} 
      className="border rounded-md p-4"
    />
  );
};

export default PopupAd;
