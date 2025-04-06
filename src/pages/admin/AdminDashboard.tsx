
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '@/lib/auth';
import { getRewards } from '@/lib/rewards';
import { getTasks } from '@/lib/tasks';
import { getWithdrawalRequests } from '@/lib/rewards';
import { WithdrawalRequest } from '@/types';
import { Coins, Users, Gift, CheckSquare, BarChart4, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import NavSidebar from '@/components/admin/NavSidebar';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const users = getUsers();
  const rewards = getRewards();
  const tasks = getTasks();
  const withdrawalRequests = getWithdrawalRequests();
  const pendingRequests = withdrawalRequests.filter(req => req.status === 'pending');
  
  const handleViewWithdrawals = () => {
    navigate('/admin/users');
  };
  
  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <h3 className="text-2xl font-bold">{users.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rewards</p>
                    <h3 className="text-2xl font-bold">{rewards.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                    <h3 className="text-2xl font-bold">{tasks.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-amber-100 p-3">
                    <TrendingUp className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Withdrawals</p>
                    <h3 className="text-2xl font-bold">{pendingRequests.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Withdrawal Requests</CardTitle>
                <CardDescription>Overview of the latest redemption requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.slice(0, 5).map((request: WithdrawalRequest) => (
                      <div key={request.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <div className="font-medium">{request.rewardName}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.username} • {format(new Date(request.createdAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 text-coin mr-1" />
                            <span>{request.cost}</span>
                          </div>
                          <div className="capitalize text-sm font-medium text-yellow-500">
                            {request.status}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full" onClick={handleViewWithdrawals}>
                      View All Withdrawals
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No pending withdrawal requests</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Newest Users</CardTitle>
                <CardDescription>Recently registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length > 1 ? (
                  <div className="space-y-4">
                    {users
                      .filter(user => user.role !== 'admin')
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map(user => (
                        <div key={user.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 text-coin mr-1" />
                            <span>{user.coins}</span>
                          </div>
                        </div>
                      ))}
                    
                    <Button variant="outline" className="w-full" onClick={() => navigate('/admin/users')}>
                      View All Users
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No regular users registered yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
