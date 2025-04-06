
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Coins, Clock } from 'lucide-react';
import { AdOption } from '@/types';
import { recordAdView, isAdInCooldown, getAdCooldownRemaining, getActivePopupAd } from '@/lib/ads';
import { getCurrentUser } from '@/lib/auth';
import { toast } from '@/lib/toast';
import PopupAd from './PopupAd';

interface AdButtonProps {
  adOption: AdOption;
}

const AdButton: React.FC<AdButtonProps> = ({ adOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(adOption.duration);
  const [isWatching, setIsWatching] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const currentUser = getCurrentUser();
  
  const cooldownSeconds = currentUser ? getAdCooldownRemaining(adOption.id, currentUser.id) : 0;
  const isInCooldown = currentUser ? isAdInCooldown(adOption.id, currentUser.id) : false;
  
  const adContent = getActivePopupAd();
  
  const handleOpenAd = () => {
    if (!currentUser) {
      toast.error('You need to log in to view ads');
      return;
    }
    
    if (isInCooldown) {
      toast.error(`Please wait ${cooldownSeconds} seconds before viewing this ad again`);
      return;
    }
    
    if (!adContent) {
      toast.error('No ad content available');
      return;
    }
    
    setIsOpen(true);
    setTimeLeft(adOption.duration);
    setIsWatching(true);
    
    // Start the countdown timer
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Clear the interval when countdown finishes
          if (intervalId) clearInterval(intervalId);
          setIsWatching(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setIntervalId(id);
  };
  
  const handleCloseAd = () => {
    if (intervalId) clearInterval(intervalId);
    setIsOpen(false);
    
    // Only reward if they watched the full ad
    if (!isWatching) {
      recordAdView(adOption.id);
    } else {
      toast.error('You must watch the entire ad to receive coins');
    }
  };
  
  return (
    <>
      <Button 
        onClick={handleOpenAd} 
        variant="outline" 
        className="flex items-center gap-2"
        disabled={isInCooldown || !currentUser}
      >
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{adOption.duration}s</span>
        </div>
        <div className="flex items-center text-primary">
          <Coins className="h-4 w-4 mr-1 text-coin" />
          <span>{adOption.coins}</span>
        </div>
        {isInCooldown && <span className="text-xs">({cooldownSeconds}s)</span>}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Advertisement</span>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{timeLeft}s remaining</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {adContent && <PopupAd content={adContent} />}
          
          <DialogFooter>
            <Button onClick={handleCloseAd} disabled={isWatching}>
              {isWatching ? 'Please Wait...' : 'Close & Claim Coins'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdButton;
