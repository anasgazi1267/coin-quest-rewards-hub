
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Coins, Gift, Clock, ChevronRight, CheckSquare } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getUserWithdrawalRequests } from '@/lib/rewards';
import { WithdrawalRequest } from '@/types';
import { format } from 'date-fns';
import DailyRewardButton from '@/components/rewards/DailyRewardButton';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  const withdrawalRequests = getUserWithdrawalRequests(currentUser.id);
  
  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
                <AvatarFallback>{getInitials(currentUser.username)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{currentUser.username}</CardTitle>
                <CardDescription>{currentUser.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-coin" />
                <div>
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="font-bold text-2xl">{currentUser.coins} coins</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Daily Reward</div>
                  <DailyRewardButton />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Rewards</div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal justify-start" 
                    onClick={() => navigate('/rewards')}
                  >
                    Browse Rewards 
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Tasks</div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal justify-start" 
                    onClick={() => navigate('/tasks')}
                  >
                    Complete Tasks
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="redemptions">
            <TabsList className="grid grid-cols-1 sm:grid-cols-2">
              <TabsTrigger value="redemptions">Redemption History</TabsTrigger>
              <TabsTrigger value="activities">Activity History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="redemptions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Redemptions</CardTitle>
                  <CardDescription>Track the status of your reward redemptions</CardDescription>
                </CardHeader>
                <CardContent>
                  {withdrawalRequests.length > 0 ? (
                    <div className="space-y-4">
                      {withdrawalRequests.map((request: WithdrawalRequest) => (
                        <div key={request.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <div className="font-medium">{request.rewardName}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(request.createdAt), 'MMM d, yyyy')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{request.cost} coins</div>
                            <div className={`capitalize text-sm font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No redemptions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't redeemed any rewards yet
                      </p>
                      <Button onClick={() => navigate('/rewards')}>Browse Rewards</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>Track your coin earning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">Activity history coming soon</h3>
                    <p className="text-muted-foreground">
                      We're working on tracking all your earning activities
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
