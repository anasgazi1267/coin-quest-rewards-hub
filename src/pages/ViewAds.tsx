
import React, { useState } from 'react';
import { getAdOptions } from '@/lib/ads';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BannerAd from '@/components/ads/BannerAd';

const ViewAds: React.FC = () => {
  const navigate = useNavigate();
  const adOptions = getAdOptions();
  const currentUser = getCurrentUser();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
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
  
  return (
    <div className="container mx-auto py-8 px-4">
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
                    onClick={() => setSelectedOption(option.id)}
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
                  disabled={!selectedOption}
                  className="animate-pulse"
                >
                  Watch Now
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
          {/* Middle Banner */}
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
    </div>
  );
};

export default ViewAds;
