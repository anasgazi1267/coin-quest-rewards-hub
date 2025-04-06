
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Reward } from '@/types';
import { getRewards } from '@/lib/rewards';
import RewardCard from '@/components/rewards/RewardCard';
import { Search } from 'lucide-react';

const Rewards: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const allRewards = getRewards();
  
  const filteredRewards = allRewards.filter(reward => {
    // Filter by search term
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = activeTab === 'all' || reward.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Rewards</h1>
      
      {/* Search and filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Category Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 sm:grid-cols-6 mb-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="amazon">Amazon</TabsTrigger>
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="pubg">PUBG</TabsTrigger>
          <TabsTrigger value="free-fire">Free Fire</TabsTrigger>
          <TabsTrigger value="visa">Visa</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Rewards grid */}
      {filteredRewards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRewards.map((reward: Reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No rewards found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
};

export default Rewards;
