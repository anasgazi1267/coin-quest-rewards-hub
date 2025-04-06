
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getAppSettings, saveAppSettings } from '@/lib/settings';
import { AppSettings } from '@/types';
import { toast } from '@/lib/toast';
import NavSidebar from '@/components/admin/NavSidebar';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (field: keyof AppSettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Validate
    if (!settings.siteName) {
      toast.error('Site name is required');
      setIsSaving(false);
      return;
    }
    
    if (settings.dailyRewardAmount <= 0 || isNaN(settings.dailyRewardAmount)) {
      toast.error('Daily reward amount must be a positive number');
      setIsSaving(false);
      return;
    }
    
    saveAppSettings(settings);
    toast.success('Settings saved successfully');
    setIsSaving(false);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic settings for your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={settings.siteName} 
                    onChange={(e) => handleChange('siteName', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input 
                    id="logoUrl" 
                    value={settings.logoUrl} 
                    onChange={(e) => handleChange('logoUrl', e.target.value)} 
                    placeholder="/placeholder.svg"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="dailyRewardAmount">Daily Reward Amount (Coins)</Label>
                  <Input 
                    id="dailyRewardAmount" 
                    type="number"
                    min="1"
                    value={settings.dailyRewardAmount} 
                    onChange={(e) => handleChange('dailyRewardAmount', parseInt(e.target.value))} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="grid grid-cols-[2.5rem_1fr] gap-2">
                    <div 
                      className="h-10 w-10 rounded-md border" 
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <Input 
                      id="primaryColor" 
                      value={settings.primaryColor} 
                      onChange={(e) => handleChange('primaryColor', e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="grid grid-cols-[2.5rem_1fr] gap-2">
                    <div 
                      className="h-10 w-10 rounded-md border" 
                      style={{ backgroundColor: settings.accentColor }}
                    />
                    <Input 
                      id="accentColor" 
                      value={settings.accentColor} 
                      onChange={(e) => handleChange('accentColor', e.target.value)} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
