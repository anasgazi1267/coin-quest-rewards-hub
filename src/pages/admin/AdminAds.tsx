
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
  DialogTitle 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  FileText, 
  Plus, 
  Pencil, 
  Trash, 
  MonitorPlay,
  LayoutBanner,
  Clock,
  Coins
} from 'lucide-react';
import { 
  getAdContents, 
  saveAdContent, 
  deleteAdContent,
  getAdOptions,
  saveAdOptions
} from '@/lib/ads';
import { AdContent, AdOption } from '@/types';
import { toast } from '@/components/ui/sonner';
import NavSidebar from '@/components/admin/NavSidebar';

const AdminAds: React.FC = () => {
  const [adContents, setAdContents] = useState<AdContent[]>(getAdContents());
  const [adOptions, setAdOptions] = useState<AdOption[]>(getAdOptions());
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<AdContent | null>(null);
  
  const [adType, setAdType] = useState<'popup' | 'banner'>('popup');
  const [adHtml, setAdHtml] = useState('');
  const [adActive, setAdActive] = useState(true);
  
  const resetContentForm = () => {
    setAdType('popup');
    setAdHtml('');
    setAdActive(true);
    setEditingContent(null);
  };
  
  const handleOpenContentDialog = (content?: AdContent) => {
    if (content) {
      setEditingContent(content);
      setAdType(content.type);
      setAdHtml(content.html);
      setAdActive(content.active);
    } else {
      resetContentForm();
    }
    
    setIsContentDialogOpen(true);
  };
  
  const handleCloseContentDialog = () => {
    setIsContentDialogOpen(false);
    resetContentForm();
  };
  
  const handleSaveAdContent = () => {
    // Validate form
    if (!adHtml) {
      toast.error('Please enter the HTML content for the ad');
      return;
    }
    
    const contentData: AdContent = {
      id: editingContent?.id || '',
      type: adType,
      html: adHtml,
      active: adActive,
    };
    
    const savedContent = saveAdContent(contentData);
    setAdContents(getAdContents());
    
    toast.success(`Ad content ${editingContent ? 'updated' : 'created'} successfully`);
    handleCloseContentDialog();
  };
  
  const handleDeleteAdContent = (id: string) => {
    if (confirm('Are you sure you want to delete this ad content?')) {
      deleteAdContent(id);
      setAdContents(getAdContents());
      toast.success('Ad content deleted successfully');
    }
  };
  
  const handleUpdateAdOption = (id: string, field: string, value: number) => {
    const updatedOptions = adOptions.map(option => {
      if (option.id === id) {
        return { ...option, [field]: value };
      }
      return option;
    });
    
    saveAdOptions(updatedOptions);
    setAdOptions(updatedOptions);
    toast.success('Ad options updated successfully');
  };
  
  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Ad Management</h1>
          
          <Tabs defaultValue="content">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Ad Content</TabsTrigger>
              <TabsTrigger value="options">Ad Options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Ad Content</h2>
                
                <Button onClick={() => handleOpenContentDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ad Content
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>All Ad Contents</CardTitle>
                  <CardDescription>Manage popup and banner ad contents shown to users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Type</th>
                          <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Preview</th>
                          <th className="px-4 py-3.5 text-center text-sm font-semibold text-muted-foreground">Status</th>
                          <th className="px-4 py-3.5 text-right text-sm font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {adContents.map((content: AdContent) => (
                          <tr key={content.id} className="hover:bg-muted/50">
                            <td className="px-4 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                {content.type === 'popup' ? (
                                  <MonitorPlay className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <LayoutBanner className="h-5 w-5 text-green-500" />
                                )}
                                <span className="capitalize">{content.type} Ad</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <div className="max-w-xs max-h-20 overflow-hidden text-xs text-muted-foreground">
                                {content.html.substring(0, 100)}...
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-center">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                content.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {content.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleOpenContentDialog(content)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteAdContent(content.id)}
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
                    
                    {adContents.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No ad contents found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="options">
              <Card>
                <CardHeader>
                  <CardTitle>Ad Options</CardTitle>
                  <CardDescription>Manage ad viewing options and coin rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3.5 text-left text-sm font-semibold text-muted-foreground">Duration</th>
                          <th className="px-4 py-3.5 text-center text-sm font-semibold text-muted-foreground">Coin Reward</th>
                          <th className="px-4 py-3.5 text-right text-sm font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {adOptions.map((option: AdOption) => (
                          <tr key={option.id} className="hover:bg-muted/50">
                            <td className="px-4 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <Input
                                  type="number"
                                  min="1"
                                  className="w-20 h-8"
                                  value={option.duration}
                                  onChange={(e) => handleUpdateAdOption(option.id, 'duration', parseInt(e.target.value))}
                                />
                                <span>seconds</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Coins className="h-5 w-5 text-coin" />
                                <Input
                                  type="number"
                                  min="1"
                                  className="w-20 h-8"
                                  value={option.coins}
                                  onChange={(e) => handleUpdateAdOption(option.id, 'coins', parseInt(e.target.value))}
                                />
                                <span>coins</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-right">
                              {/* No actions for now */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Add/Edit Ad Content Dialog */}
          <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingContent ? 'Edit Ad Content' : 'Add New Ad Content'}</DialogTitle>
                <DialogDescription>
                  {editingContent
                    ? 'Update the HTML content of this ad'
                    : 'Create a new ad content for popup or banner ads'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="adType">Ad Type</Label>
                  <Select value={adType} onValueChange={(value: 'popup' | 'banner') => setAdType(value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popup">Popup Ad</SelectItem>
                      <SelectItem value="banner">Banner Ad (468x60)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adHtml">HTML Content</Label>
                  <Textarea 
                    id="adHtml" 
                    rows={8}
                    value={adHtml} 
                    onChange={(e) => setAdHtml(e.target.value)} 
                    placeholder={`<div style="padding: 20px; background-color: #f0f0f0; border-radius: 8px;">
  <h3 style="color: #333;">Ad Title</h3>
  <p>Ad content goes here</p>
  <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Click Here</button>
</div>`}
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the HTML content for the ad. For banner ads, make sure the content fits within 468x60 pixels.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    id="adActive"
                    checked={adActive}
                    onCheckedChange={setAdActive}
                  />
                  <Label htmlFor="adActive">Active</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseContentDialog}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveAdContent}>
                  {editingContent ? 'Update Ad Content' : 'Add Ad Content'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminAds;
