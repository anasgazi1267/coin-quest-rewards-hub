
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Copy, UserCircle, Users } from 'lucide-react';
import { getCurrentUser, updateUser } from '@/lib/auth';
import { toast } from '@/lib/toast';
import { createInvitation, getUserInvitation, getInviteLink, useInviteCode } from '@/lib/invitations';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [userInvitation, setUserInvitation] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setName(user.name);
    setEmail(user.email);
    
    // Get user's invitation
    if (user) {
      const invitation = getUserInvitation(user.id);
      if (!invitation) {
        // Create invitation for the user if they don't have one
        const newInvitation = createInvitation(user.id);
        setUserInvitation(newInvitation);
      } else {
        setUserInvitation(invitation);
      }
    }
  }, [user, navigate]);
  
  const handleSaveProfile = () => {
    if (!user) return;
    
    setIsSaving(true);
    
    const updatedUser = {
      ...user,
      name,
      email,
    };
    
    updateUser(updatedUser);
    setUser(updatedUser);
    
    toast.success('Profile updated successfully');
    setIsSaving(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };
  
  const handleCopyInviteLink = () => {
    if (!userInvitation) return;
    
    const inviteLink = getInviteLink(userInvitation.code);
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard');
  };
  
  const handleCopyInviteCode = () => {
    if (!userInvitation) return;
    
    navigator.clipboard.writeText(userInvitation.code);
    toast.success('Invite code copied to clipboard');
  };
  
  const handleUseInviteCode = () => {
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }
    
    const success = useInviteCode(inviteCode.trim());
    if (success) {
      setUser(getCurrentUser());
      setInviteCode('');
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <UserCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-medium text-xl mb-1">{user.name}</h3>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                
                <div className="flex items-center mt-4 justify-center bg-secondary/50 rounded-full px-4 py-2">
                  <Coins className="h-4 w-4 text-coin mr-2" />
                  <span className="font-bold">{user.coins}</span>
                  <span className="text-muted-foreground text-sm ml-1">coins</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Log Out
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Invite Friends</CardTitle>
              <CardDescription>Earn 50 coins for each friend who joins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userInvitation && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="inviteCode">Your Invite Code</Label>
                    <div className="flex">
                      <Input 
                        id="inviteCode" 
                        value={userInvitation.code}
                        readOnly
                        className="flex-1 bg-muted"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="ml-2"
                        onClick={handleCopyInviteCode}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inviteLink">Invite Link</Label>
                    <div className="flex">
                      <Input 
                        id="inviteLink" 
                        value={getInviteLink(userInvitation.code)}
                        readOnly
                        className="flex-1 bg-muted text-xs"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="ml-2"
                        onClick={handleCopyInviteLink}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex items-center pt-2 justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">Friends invited</span>
                </div>
                <span className="font-medium">{user.inviteCount || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              {!user.invitedBy && <TabsTrigger value="invite">Use Invite Code</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={user.username}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {!user.invitedBy && (
              <TabsContent value="invite">
                <Card>
                  <CardHeader>
                    <CardTitle>Use Invite Code</CardTitle>
                    <CardDescription>Enter a friend's invite code to join their network</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="friendInviteCode">Invite Code</Label>
                      <div className="flex">
                        <Input
                          id="friendInviteCode"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          placeholder="Enter invite code"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          className="ml-2"
                          onClick={handleUseInviteCode}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-medium mb-2">Benefits:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Your friend will receive 50 coins when you use their code</li>
                        <li>You can only use one invite code per account</li>
                        <li>Invite codes cannot be used by the person who created them</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
