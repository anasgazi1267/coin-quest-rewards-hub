
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Share, Copy, Users, Link as LinkIcon } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { toast } from '@/lib/toast';
import { createInvitation, getInviteLink, getUserInvitation } from '@/lib/invitations';
import { Input } from '@/components/ui/input';

const InviteTask: React.FC = () => {
  const currentUser = getCurrentUser();
  const [isCopied, setIsCopied] = useState(false);
  
  if (!currentUser) {
    return null;
  }
  
  // Get or create invite code for user
  const invitation = getUserInvitation(currentUser.id) || createInvitation(currentUser.id);
  const inviteLink = getInviteLink(invitation.code);
  const inviteCount = currentUser.inviteCount || 0;
  const referralTarget = 10;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setIsCopied(true);
      toast.success('Invite link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Rewards App',
          text: 'Sign up using my invite code to get started with free coins!',
          url: inviteLink,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };
  
  return (
    <Card className="border-dashed border-2 border-primary/50 bg-primary/5 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Invite Friends & Earn Big</CardTitle>
        <CardDescription>
          Invite friends to join and earn coins for every successful referral!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Users className="h-5 w-5 text-primary" />
            <span>Your Referrals:</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold">{inviteCount} / {referralTarget}</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, (inviteCount/referralTarget) * 100)}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {inviteCount >= referralTarget ? (
            <span className="text-green-600 font-medium">Congratulations! You've reached the target!</span>
          ) : (
            <span>Invite {referralTarget - inviteCount} more friends to get a special reward!</span>
          )}
        </div>
        
        <div className="relative mt-4">
          <Input
            value={inviteLink}
            readOnly
            className="pr-24"
          />
          <Button
            size="sm"
            className="absolute right-1 top-1 h-7"
            onClick={handleCopyLink}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-1">
          Or share your invite code: <span className="font-bold">{invitation.code}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleShare}
          variant="default"
        >
          <Share className="h-4 w-4 mr-2" />
          Share Invite Link
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InviteTask;
