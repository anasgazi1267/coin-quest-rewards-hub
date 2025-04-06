import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  getUsers, 
  updateUserCoins
} from '@/lib/auth';
import { 
  getWithdrawalRequests, 
  updateWithdrawalStatus 
} from '@/lib/rewards';
import { User, WithdrawalRequest } from '@/types';
import { format } from 'date-fns';
import { 
  Users, 
  Coins, 
  Gift, 
  Search, 
  Check, 
  X, 
  Clock
} from 'lucide-react';
import { toast } from '@/lib/toast';
import NavSidebar from '@/components/admin/NavSidebar';

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  
  const allUsers = getUsers();
  const withdrawalRequests = getWithdrawalRequests();
  
  const filteredUsers = allUsers.filter(user => {
    return (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const filteredRequests = withdrawalRequests.filter(request => {
    return (
      request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.rewardName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const handleApproveRequest = (id: string) => {
    updateWithdrawalStatus(id, 'approved');
    toast.success('Withdrawal request approved');
  };
  
  const handleRejectRequest = (id: string) => {
    const request = withdrawalRequests.find(req => req.id === id);
    if (request) {
      // Refund coins to user
      const user = allUsers.find(user => user.id === request.userId);
      if (user) {
        updateUserCoins(user.id, user.coins + request.cost);
      }
      
      updateWithdrawalStatus(id, 'rejected');
      toast.success('Withdrawal request rejected and coins refunded');
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">User Management</h1>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username, email, or reward name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage user accounts and coin balances</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">User</th>
                          <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Email</th>
                          <th className="px-4 py-3.5 text-right text-sm font-semibold text-muted-foreground">Coins</th>
                          <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Role</th>
                          <th className="px-4 py-3.5 text-right text-sm font-semibold text-muted-foreground">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredUsers.map((user: User) => (
                          <tr key={user.id} className="hover:bg-muted/50">
                            <td className="px-4 py-4 text-sm font-medium">{user.username}</td>
                            <td className="px-4 py-4 text-sm">{user.email}</td>
                            <td className="px-4 py-4 text-sm text-right">
                              <div className="flex items-center justify-end">
                                <Coins className="h-4 w-4 text-coin mr-1" />
                                <span>{user.coins}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <Badge variant={user.role === 'admin' ? "default" : "secondary"} className="capitalize">
                                {user.role}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-sm text-right">
                              {format(new Date(user.createdAt), 'MMM d, yyyy')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No users found matching your search</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="withdrawals">
              <Card>
                <CardHeader>
                  <CardTitle>Withdrawal Requests</CardTitle>
                  <CardDescription>Manage user redemption requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">User</th>
                          <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Reward</th>
                          <th className="px-4 py-3.5 text-center text-sm font-semibold text-muted-foreground">Coins</th>
                          <th className="px-4 py-3.5 text-center text-sm font-semibold text-muted-foreground">Status</th>
                          <th className="px-4 py-3.5 text-center text-sm font-semibold text-muted-foreground">Date</th>
                          <th className="px-4 py-3.5 text-center text-sm font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredRequests.map((request: WithdrawalRequest) => (
                          <tr key={request.id} className="hover:bg-muted/50">
                            <td className="px-4 py-4 text-sm font-medium">{request.username}</td>
                            <td className="px-4 py-4 text-sm">{request.rewardName}</td>
                            <td className="px-4 py-4 text-sm text-center">
                              <div className="flex items-center justify-center">
                                <Coins className="h-4 w-4 text-coin mr-1" />
                                <span>{request.cost}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-center">
                              <Badge 
                                variant={
                                  request.status === 'approved' ? "default" :
                                  request.status === 'rejected' ? "destructive" : "outline"
                                }
                                className="capitalize"
                              >
                                {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                {request.status === 'approved' && <Check className="h-3 w-3 mr-1" />}
                                {request.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                                {request.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-sm text-center">
                              {format(new Date(request.createdAt), 'MMM d, yyyy')}
                            </td>
                            <td className="px-4 py-4 text-sm text-center">
                              {request.status === 'pending' ? (
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 gap-1"
                                    onClick={() => handleApproveRequest(request.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Approve</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 gap-1 text-destructive hover:text-destructive"
                                    onClick={() => handleRejectRequest(request.id)}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Reject</span>
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">No actions</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredRequests.length === 0 && (
                      <div className="text-center py-8">
                        <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No withdrawal requests found</p>
                      </div>
                    )}
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

export default AdminUsers;
