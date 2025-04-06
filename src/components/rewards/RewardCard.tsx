
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import { Reward } from '@/types';
import { createWithdrawalRequest } from '@/lib/rewards';
import { getCurrentUser } from '@/lib/auth';
import { toast } from '@/components/ui/sonner';

interface RewardCardProps {
  reward: Reward;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward }) => {
  const currentUser = getCurrentUser();
  const hasEnoughCoins = currentUser ? currentUser.coins >= reward.cost : false;
  
  const handleRedeem = () => {
    if (!currentUser) {
      toast.error('You need to log in to redeem rewards');
      return;
    }
    
    if (!hasEnoughCoins) {
      toast.error(`You need ${reward.cost - currentUser.coins} more coins to redeem this reward`);
      return;
    }
    
    createWithdrawalRequest(reward.id);
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${!reward.available ? 'opacity-70' : ''}`}>
      <div className="h-40 overflow-hidden bg-gray-100">
        <img 
          src={reward.image} 
          alt={reward.name} 
          className="h-full w-full object-cover object-center" 
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{reward.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">{reward.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="flex items-center space-x-1">
          <Coins className="h-5 w-5 text-coin" />
          <span className="font-bold text-lg">{reward.cost}</span>
          <span className="text-muted-foreground text-sm">coins</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className="w-full" 
          onClick={handleRedeem}
          disabled={!hasEnoughCoins || !reward.available || !currentUser}
        >
          {!reward.available ? 'Out of Stock' : 'Redeem Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardCard;
