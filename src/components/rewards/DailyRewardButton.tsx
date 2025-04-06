
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, canClaimDailyReward, claimDailyReward, getTimeUntilNextDailyReward } from '@/lib/auth';
import { toast } from '@/lib/toast';
import { getAppSettings } from '@/lib/settings';
import { Gift } from 'lucide-react';

interface DailyRewardButtonProps {
  isMobile?: boolean;
}

const DailyRewardButton: React.FC<DailyRewardButtonProps> = ({ isMobile = false }) => {
  const [canClaim, setCanClaim] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const currentUser = getCurrentUser();
  const appSettings = getAppSettings();
  
  const formatTimeLeft = (ms: number) => {
    if (ms <= 0) return 'Available Now';
    
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  
  const checkClaimStatus = () => {
    if (!currentUser) return;
    
    const canClaim = canClaimDailyReward(currentUser.id);
    setCanClaim(canClaim);
    
    if (!canClaim) {
      const timeRemaining = getTimeUntilNextDailyReward(currentUser.id);
      setTimeLeft(formatTimeLeft(timeRemaining));
    } else {
      setTimeLeft('Available Now');
    }
  };
  
  useEffect(() => {
    checkClaimStatus();
    
    const interval = setInterval(() => {
      checkClaimStatus();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleClaimReward = () => {
    if (!currentUser) {
      toast.error('You need to log in to claim daily rewards');
      return;
    }
    
    if (canClaim) {
      const claimed = claimDailyReward(currentUser.id, appSettings.dailyRewardAmount);
      
      if (claimed) {
        toast.success(`Daily reward claimed! You received ${appSettings.dailyRewardAmount} coins`);
        checkClaimStatus();
      } else {
        toast.error('Failed to claim daily reward');
      }
    } else {
      toast.info(`You can claim your next daily reward in ${timeLeft}`);
    }
  };
  
  if (!currentUser) return null;
  
  if (isMobile) {
    return (
      <button
        onClick={handleClaimReward}
        className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
      >
        <Gift className="inline-block h-5 w-5 mr-2" />
        {canClaim ? 'Claim Daily Reward' : `Daily Reward: ${timeLeft}`}
      </button>
    );
  }
  
  return (
    <Button
      variant={canClaim ? "default" : "outline"}
      size="sm"
      onClick={handleClaimReward}
      className={canClaim ? "animate-pulse" : ""}
    >
      <Gift className="h-4 w-4 mr-2" />
      {canClaim ? 'Claim Daily Reward' : timeLeft}
    </Button>
  );
};

export default DailyRewardButton;
