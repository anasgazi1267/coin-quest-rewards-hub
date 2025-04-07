import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Coins, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getUserWithdrawalRequests } from '@/lib/withdrawals';
import { WithdrawalRequest } from '@/types';

const Withdrawals: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const loadRequests = () => {
      const requests = getUserWithdrawalRequests(user.id);
      setWithdrawalRequests(requests);
    };
    
    loadRequests();
    
    const handleDataChange = (event: CustomEvent) => {
      if (event.detail && 
          (event.detail.key === 'rewards-app-withdrawal-requests' || 
           event.detail.key === 'rewards-app-current-user')) {
        loadRequests();
        setUser(getCurrentUser());
      }
    };
    
    window.addEventListener('rewards-app-data-changed', handleDataChange as EventListener);
    
    const handleStorageChange = () => {
      loadRequests();
      setUser(getCurrentUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('rewards-app-data-changed', handleDataChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, navigate]);
  
  if (!user) return null;
  
  const pendingRequests = withdrawalRequests.filter(req => req.status === 'pending');
  const completedRequests = withdrawalRequests.filter(req => req.status !== 'pending');
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Withdrawals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">
                Pending
                {pendingRequests.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium mb-1">{request.rewardName}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                Requested on {new Date(request.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center mb-2">
                              <Coins className="h-4 w-4 mr-1 text-amber-500" />
                              <span className="font-medium">{request.cost}</span>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <AlertCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">No Pending Withdrawals</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any pending withdrawal requests yet.
                    </p>
                    <Button onClick={() => navigate('/rewards')}>
                      Browse Rewards <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedRequests.length > 0 ? (
                <div className="space-y-4">
                  {completedRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium mb-1">{request.rewardName}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                Requested on {new Date(request.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center mb-2">
                              <Coins className="h-4 w-4 mr-1 text-amber-500" />
                              <span className="font-medium">{request.cost}</span>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <AlertCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">No Completed Withdrawals</h3>
                    <p className="text-muted-foreground mb-4">
                      Your completed withdrawal requests will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Balance</CardTitle>
              <CardDescription>Available coins to withdraw</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 rounded-lg p-4 flex justify-between items-center">
                <span className="text-sm font-medium">Available Coins</span>
                <div className="flex items-center">
                  <Coins className="h-5 w-5 mr-1 text-amber-500" />
                  <span className="text-xl font-bold">{user.coins}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Withdrawal Guidelines</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Withdrawals are typically processed within 24-48 hours</li>
                  <li>Keep your account information up to date</li>
                  <li>Some withdrawals may require identity verification</li>
                </ul>
              </div>
              
              <Button
                className="w-full mt-4"
                onClick={() => navigate('/rewards')}
              >
                Browse Rewards
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;
