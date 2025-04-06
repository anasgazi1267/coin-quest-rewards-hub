
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, ChevronRight, Gift, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';
import { getRewards } from '@/lib/rewards';
import { getTasks } from '@/lib/tasks';
import { getAdOptions } from '@/lib/ads';
import RewardCard from '@/components/rewards/RewardCard';
import TaskCard from '@/components/tasks/TaskCard';
import AdButton from '@/components/ads/AdButton';
import { Separator } from '@/components/ui/separator';
import { Reward, Task, AdOption } from '@/types';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const rewards = getRewards().slice(0, 3);
  const tasks = getTasks().slice(0, 3);
  const adOptions = getAdOptions();
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="rounded-lg bg-purple-pink-gradient p-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
              Earn Coins and Redeem Amazing Rewards!
            </h1>
            <p className="mt-4 text-lg">
              Watch ads, complete tasks, and collect daily rewards to earn coins that you can redeem for gift cards, game currency, and more.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              {currentUser ? (
                <Button size="lg" onClick={() => navigate('/rewards')} className="bg-white text-primary hover:bg-gray-100">
                  See Rewards <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate('/register')} className="bg-white text-primary hover:bg-gray-100">
                  Get Started <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Earn Coins Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Earn Coins</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Watch Ads to Earn Coins</CardTitle>
            <CardDescription>
              Choose an ad duration below, watch it fully, and earn coins instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {adOptions.map((adOption: AdOption) => (
                <AdButton key={adOption.id} adOption={adOption} />
              ))}
            </div>
            
            {!currentUser && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login to earn coins
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Featured Rewards Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Rewards</h2>
          <Button variant="ghost" onClick={() => navigate('/rewards')}>
            See all <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rewards.map((reward: Reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      </section>

      {/* Tasks Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <Button variant="ghost" onClick={() => navigate('/tasks')}>
            See all <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Earn Coins</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Watch ads, complete tasks, and claim daily rewards to earn coins</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Choose Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Browse our selection of gift cards, game currency, and more</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-2">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Redeem</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Use your coins to redeem rewards and get your items delivered</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
