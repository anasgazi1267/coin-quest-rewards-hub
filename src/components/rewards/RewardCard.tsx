
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, AlertCircle } from 'lucide-react';
import { Reward } from '@/types';
import { createWithdrawalRequest } from '@/lib/rewards';
import { getCurrentUser } from '@/lib/auth';
import { toast } from '@/lib/toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RewardCardProps {
  reward: Reward;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward }) => {
  const currentUser = getCurrentUser();
  const hasEnoughCoins = currentUser ? currentUser.coins >= reward.cost : false;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const handleRedeemClick = () => {
    if (!currentUser) {
      toast.error('You need to log in to redeem rewards');
      return;
    }
    
    if (!hasEnoughCoins) {
      toast.error(`You need ${reward.cost - currentUser.coins} more coins to redeem this reward`);
      return;
    }
    
    if (reward.requiresId) {
      setIsDialogOpen(true);
    } else {
      handleRedeem();
    }
  };
  
  const handleRedeem = (id?: string) => {
    setIsRedeeming(true);
    
    try {
      const request = createWithdrawalRequest(reward.id, id);
      if (request) {
        setIsDialogOpen(false);
        setPlayerId('');
      }
    } finally {
      setIsRedeeming(false);
    }
  };
  
  const handleSubmitPlayerId = () => {
    if (!playerId || playerId.trim() === '') {
      toast.error('Please enter your player ID');
      return;
    }
    
    handleRedeem(playerId);
  };
  
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'pubg': return 'PUBG';
      case 'free-fire': return 'Free Fire';
      case 'amazon': return 'Amazon';
      case 'google': return 'Google';
      case 'visa': return 'Visa';
      default: return category;
    }
  };
  
  return (
    <>
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
          
          {reward.requiresId && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Requires {getCategoryName(reward.category)} ID</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4">
          <Button 
            className="w-full" 
            onClick={handleRedeemClick}
            disabled={!hasEnoughCoins || !reward.available || !currentUser}
          >
            {!reward.available ? 'Out of Stock' : 'Redeem Now'}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Your {getCategoryName(reward.category)} ID</DialogTitle>
            <DialogDescription>
              Please enter your {getCategoryName(reward.category)} player ID to receive your reward
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="playerId">Player ID</Label>
              <Input 
                id="playerId"
                placeholder={`Your ${getCategoryName(reward.category)} ID`}
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                Make sure to enter the correct ID. Rewards cannot be resent if the ID is incorrect.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitPlayerId} disabled={isRedeeming}>
              {isRedeeming ? 'Processing...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RewardCard;
