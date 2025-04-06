
import { WithdrawalRequest } from '@/types';
import { STORAGE_KEYS } from './data';
import { getCurrentUser, updateUserCoins } from './auth';
import { toast } from '@/lib/toast';

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

// Get user's withdrawal requests
export const getUserWithdrawalRequests = (userId: string): WithdrawalRequest[] => {
  const requests = getWithdrawalRequests();
  return requests.filter(request => request.userId === userId);
};

// Create a new withdrawal request
export const createWithdrawalRequest = (
  rewardId: string,
  playerId?: string
): WithdrawalRequest | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    toast.error('You must be logged in to make a withdrawal');
    return null;
  }
  
  const rewards = JSON.parse(localStorage.getItem(STORAGE_KEYS.REWARDS) || '[]');
  const reward = rewards.find((r: any) => r.id === rewardId);
  
  if (!reward) {
    toast.error('Reward not found');
    return null;
  }
  
  if (currentUser.coins < reward.cost) {
    toast.error('Not enough coins for this reward');
    return null;
  }
  
  if (reward.requiresId && !playerId) {
    toast.error(`You must provide your ${reward.category === 'pubg' ? 'PUBG' : 'Free Fire'} ID`);
    return null;
  }
  
  // Deduct coins from user
  updateUserCoins(currentUser.id, currentUser.coins - reward.cost);
  
  // Create the request
  const newRequest: WithdrawalRequest = {
    id: Date.now().toString(),
    userId: currentUser.id,
    username: currentUser.username,
    rewardId,
    rewardName: reward.name,
    cost: reward.cost,
    status: 'pending',
    createdAt: new Date().toISOString(),
    playerId
  };
  
  // Save to storage
  const requests = getWithdrawalRequests();
  saveWithdrawalRequests([...requests, newRequest]);
  
  toast.success("Redemption request submitted successfully!");
  return newRequest;
};

// Update a withdrawal request status
export const updateWithdrawalRequestStatus = (
  requestId: string,
  status: 'pending' | 'approved' | 'rejected',
  rejectionReason?: string
): WithdrawalRequest | null => {
  const requests = getWithdrawalRequests();
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return null;
  }
  
  // If rejecting a request that was previously pending, refund the coins
  if (status === 'rejected' && requests[requestIndex].status === 'pending') {
    const user = getCurrentUser();
    if (user && user.id === requests[requestIndex].userId) {
      updateUserCoins(user.id, user.coins + requests[requestIndex].cost);
    }
  }
  
  // Update the request
  requests[requestIndex] = {
    ...requests[requestIndex],
    status,
    ...(rejectionReason && { rejectionReason }),
    ...(status !== 'pending' && { processedAt: new Date().toISOString() })
  };
  
  saveWithdrawalRequests(requests);
  return requests[requestIndex];
};
