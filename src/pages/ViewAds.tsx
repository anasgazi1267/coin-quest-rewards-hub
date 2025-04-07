
import React, { useState, useEffect } from 'react';
import { getAdOptions, getActivePopupAd, recordAdView, isAdInCooldown, getAdCooldownRemaining } from '@/lib/ads';
import { getCurrentUser, updateUserCoins } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Clock, ExternalLink, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BannerAd from '@/components/ads/BannerAd';
import { toast } from '@/lib/toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PopupAd from '@/components/ads/PopupAd';

const ViewAds: React.FC = () => {
  const navigate = useNavigate();
  const adOptions = getAdOptions();
  const currentUser = getCurrentUser();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  
  const adContent = getActivePopupAd();
  
  useEffect(() => {
    if (!isAdDialogOpen) {
      setCountdown(0);
    }
  }, [isAdDialogOpen]);
  
  if (!currentUser) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">View Ads</h1>
        <Card>
          <CardContent className="py-8">
            <p className="mb-4">Please log in to view ads and earn coins</p>
            <Button onClick={() => navigate('/login')}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleWatchAd = () => {
    if (!selectedOption) {
      toast.error('Please select an ad duration first');
      return;
    }

    const option = adOptions.find(opt => opt.id === selectedOption);
    if (!option) return;
    
    if (isAdInCooldown(selectedOption, currentUser.id)) {
      const cooldownSecs = getAdCooldownRemaining(selectedOption, currentUser.id);
      toast.error(`Please wait ${cooldownSecs} seconds before viewing this ad again`);
      return;
    }
    
    if (!adContent) {
      toast.error('No ad content available at the moment');
      return;
    }

    setIsAdDialogOpen(true);
    setCountdown(option.duration);
    setIsWatching(true);

    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setIsWatching(false);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };
  
  const handleCloseAd = () => {
    if (!isWatching && selectedOption) {
      recordAdView(selectedOption);
      
      const updatedUser = getCurrentUser();
      if (updatedUser) {
        toast.success(`Success! Your balance: ${updatedUser.coins} coins`);
      }
    } else if (isWatching) {
      toast.error('You must watch the entire ad to receive coins');
    }
    
    setIsAdDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-center">
        <BannerAd />
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center">View Ads & Earn Coins</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select an Ad Duration</CardTitle>
              <CardDescription>Longer ads reward more coins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adOptions.map(option => (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOption === option.id ? 'border-2 border-primary' : ''
                    }`}
                    onClick={() => !isWatching && setSelectedOption(option.id)}
                  >
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{option.duration}s</span>
                      </div>
                      <div className="flex items-center">
                        <Coins className="h-5 w-5 mr-1 text-amber-500" />
                        <span className="font-bold">{option.coins}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  size="lg" 
                  disabled={!selectedOption || isWatching || isAdDialogOpen}
                  className={(!selectedOption || isWatching) ? "" : "animate-pulse"}
                  onClick={handleWatchAd}
                >
                  <span className="flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    Watch Ad Now
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Select an Ad</h3>
                  <p className="text-muted-foreground text-sm">Choose from various ad durations - longer ads give more coins</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Watch the Full Ad</h3>
                  <p className="text-muted-foreground text-sm">Watch the entire ad without switching tabs or minimizing</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ExternalLink className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Collect Your Coins</h3>
                  <p className="text-muted-foreground text-sm">Coins are automatically added to your account after viewing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <div className="hidden lg:block">
            <BannerAd />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Balance</span>
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 mr-1 text-amber-500" />
                    <span className="font-bold">{currentUser.coins}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ads Watched Today</span>
                  <span className="font-medium">0</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Earned</span>
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 mr-1 text-amber-500" />
                    <span className="font-bold">0</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/rewards')}
                >
                  Redeem Coins
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <BannerAd />
      </div>
      
      <Dialog open={isAdDialogOpen} onOpenChange={(open) => !isWatching && setIsAdDialogOpen(open)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Advertisement</span>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{countdown}s remaining</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {adContent && (
            <div className="my-4 flex justify-center">
              <PopupAd content={adContent} />
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={handleCloseAd} disabled={isWatching}>
              {isWatching ? 'Please Wait...' : 'Close & Claim Coins'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewAds;
