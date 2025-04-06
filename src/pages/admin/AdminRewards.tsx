
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Coins, Plus, Pencil, Trash } from 'lucide-react';
import { getRewards, saveReward, deleteReward } from '@/lib/rewards';
import { Reward } from '@/types';
import { toast } from '@/lib/toast';
import NavSidebar from '@/components/admin/NavSidebar';

const AdminRewards: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>(getRewards());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [available, setAvailable] = useState(true);
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setCost('');
    setCategory('');
    setImage('/placeholder.svg');
    setAvailable(true);
    setEditingReward(null);
  };
  
  const handleOpenDialog = (reward?: Reward) => {
    if (reward) {
      setEditingReward(reward);
      setName(reward.name);
      setDescription(reward.description);
      setCost(reward.cost.toString());
      setCategory(reward.category);
      setImage(reward.image);
      setAvailable(reward.available);
    } else {
      resetForm();
    }
    
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSaveReward = () => {
    // Validate form
    if (!name || !description || !cost || !category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const costValue = parseInt(cost);
    if (isNaN(costValue) || costValue <= 0) {
      toast.error('Cost must be a positive number');
      return;
    }
    
    const rewardData: Reward = {
      id: editingReward?.id || '',
      name,
      description,
      cost: costValue,
      category: category as any,
      image: image || '/placeholder.svg',
      available,
    };
    
    const savedReward = saveReward(rewardData);
    setRewards(getRewards());
    
    toast.success(`Reward ${editingReward ? 'updated' : 'created'} successfully`);
    handleCloseDialog();
  };
  
  const handleDeleteReward = (id: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      deleteReward(id);
      setRewards(getRewards());
      toast.success('Reward deleted successfully');
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Reward Management</h1>
            
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reward
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>All Rewards</CardTitle>
              <CardDescription>Manage rewards that users can redeem with coins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Reward</th>
                      <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Category</th>
                      <th className="px-4 py-3.5 text-right text-sm font-semibold text-muted-foreground">Cost</th>
                      <th className="px-4 py-3.5 text-center text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="px-4 py-3.5 text-right text-sm font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rewards.map((reward: Reward) => (
                      <tr key={reward.id} className="hover:bg-muted/50">
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                              <img 
                                src={reward.image} 
                                alt={reward.name} 
                                className="h-full w-full object-cover" 
                              />
                            </div>
                            <div>
                              <div className="font-medium">{reward.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{reward.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm capitalize">{reward.category}</td>
                        <td className="px-4 py-4 text-sm text-right">
                          <div className="flex items-center justify-end">
                            <Coins className="h-4 w-4 text-coin mr-1" />
                            <span>{reward.cost}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            reward.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reward.available ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenDialog(reward)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteReward(reward.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {rewards.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No rewards found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Add/Edit Reward Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingReward ? 'Edit Reward' : 'Add New Reward'}</DialogTitle>
                <DialogDescription>
                  {editingReward
                    ? 'Update the details of this reward'
                    : 'Create a new reward for users to redeem with coins'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Reward Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (Coins)</Label>
                  <Input 
                    id="cost" 
                    type="number" 
                    min="1" 
                    value={cost} 
                    onChange={(e) => setCost(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">Amazon Gift Card</SelectItem>
                      <SelectItem value="google">Google Gift Card</SelectItem>
                      <SelectItem value="pubg">PUBG</SelectItem>
                      <SelectItem value="free-fire">Free Fire</SelectItem>
                      <SelectItem value="visa">Visa Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    value={image} 
                    onChange={(e) => setImage(e.target.value)} 
                    placeholder="/placeholder.svg" 
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    id="available"
                    checked={available}
                    onCheckedChange={setAvailable}
                  />
                  <Label htmlFor="available">Available for redemption</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveReward}>
                  {editingReward ? 'Update Reward' : 'Add Reward'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminRewards;
