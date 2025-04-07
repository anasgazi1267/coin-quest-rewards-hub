
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInvitationSettings, saveInvitationSettings } from '@/lib/invitations';
import { toast } from '@/lib/toast';
import { Users, Gift } from 'lucide-react';

const InviteSettings: React.FC = () => {
  const currentSettings = getInvitationSettings();
  const [targetReferrals, setTargetReferrals] = useState(currentSettings.targetReferrals.toString());
  const [reward, setReward] = useState(currentSettings.reward.toString());
  
  const handleSave = () => {
    const targetValue = parseInt(targetReferrals);
    const rewardValue = parseInt(reward);
    
    if (isNaN(targetValue) || targetValue <= 0) {
      toast.error('Target referrals must be a positive number');
      return;
    }
    
    if (isNaN(rewardValue) || rewardValue <= 0) {
      toast.error('Reward must be a positive number');
      return;
    }
    
    saveInvitationSettings({
      targetReferrals: targetValue,
      reward: rewardValue
    });
    
    toast.success('Invitation settings updated successfully');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Invitation System Settings
        </CardTitle>
        <CardDescription>
          Configure the referral target and bonus reward for the invitation system
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetReferrals">Target Referrals</Label>
          <div className="flex items-center">
            <Input
              id="targetReferrals"
              type="number"
              min="1"
              value={targetReferrals}
              onChange={(e) => setTargetReferrals(e.target.value)}
              className="w-32"
            />
            <span className="ml-2 text-sm text-muted-foreground">
              users
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Number of successful referrals a user needs to make to get the bonus reward
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reward">Bonus Reward</Label>
          <div className="flex items-center">
            <Input
              id="reward"
              type="number"
              min="1"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="w-32"
            />
            <span className="ml-2 text-sm text-muted-foreground">
              coins
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Coins awarded when a user reaches the target number of referrals
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleSave}>
          <Gift className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InviteSettings;
