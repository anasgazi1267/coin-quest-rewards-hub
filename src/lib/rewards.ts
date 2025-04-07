
import { Reward, WithdrawalRequest, User } from '@/types';
import { STORAGE_KEYS } from './data';
import { getCurrentUser, updateUserCoins } from './auth';
import { toast } from '@/lib/toast';

// Get all rewards
export const getRewards = (): Reward[] => {
  if (typeof window === 'undefined') return [];
  const rewards = localStorage.getItem(STORAGE_KEYS.REWARDS);
  return rewards ? JSON.parse(rewards) : [];
};

// Save rewards
export const saveRewards = (rewards: Reward[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
};

// Add or update reward
export const saveReward = (reward: Reward): Reward => {
  const rewards = getRewards();
  
  if (reward.id) {
    // Update existing reward
    const updatedRewards = rewards.map(r => r.id === reward.id ? reward : r);
    saveRewards(updatedRewards);
  } else {
    // Add new reward
    const newReward = {
      ...reward,
      id: Date.now().toString(),
    };
    saveRewards([...rewards, newReward]);
    return newReward;
  }
  
  return reward;
};

// Delete reward
export const deleteReward = (id: string): void => {
  const rewards = getRewards();
  const filteredRewards = rewards.filter(reward => reward.id !== id);
  saveRewards(filteredRewards);
};

// Get all withdrawal requests
export const getWithdrawalRequests = (): WithdrawalRequest[] => {
  if (typeof window === 'undefined') return [];
  const requests = localStorage.getItem(STORAGE_KEYS.WITHDRAWAL_REQUESTS);
  return requests ? JSON.parse(requests) : [];
};

// Save withdrawal requests
export const saveWithdrawalRequests = (requests: WithdrawalRequest[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.WITHDRAWAL_REQUESTS, JSON.stringify(requests));
};

// Create withdrawal request
export const createWithdrawalRequest = (rewardId: string, playerId?: string): WithdrawalRequest | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    toast.error("You must be logged in to redeem rewards");
    return null;
  }
  
  const rewards = getRewards();
  const reward = rewards.find(r => r.id === rewardId);
  
  if (!reward) {
    toast.error("Reward not found");
    return null;
  }
  
  if (currentUser.coins < reward.cost) {
    toast.error(`Not enough coins. You need ${reward.cost} coins but have ${currentUser.coins}`);
    return null;
  }
  
  // Deduct coins from user
  updateUserCoins(currentUser.id, currentUser.coins - reward.cost);
  
  // Create withdrawal request
  const request: WithdrawalRequest = {
    id: Date.now().toString(),
    userId: currentUser.id,
    username: currentUser.username,
    rewardId: reward.id,
    rewardName: reward.name,
    cost: reward.cost,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // Add player ID if provided
  if (playerId) {
    request.playerId = playerId;
  }
  
  // Save request
  const requests = getWithdrawalRequests();
  saveWithdrawalRequests([...requests, request]);
  
  toast.success("Redemption request submitted successfully!");
  return request;
};

// Update withdrawal request status
export const updateWithdrawalStatus = (requestId: string, status: 'approved' | 'rejected'): WithdrawalRequest | null => {
  const requests = getWithdrawalRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) return null;
  
  const updatedRequest = { ...requests[requestIndex], status };
  requests[requestIndex] = updatedRequest;
  
  saveWithdrawalRequests(requests);
  return updatedRequest;
};

// Get user withdrawal requests
export const getUserWithdrawalRequests = (userId: string): WithdrawalRequest[] => {
  const requests = getWithdrawalRequests();
  return requests.filter(request => request.userId === userId);
};
