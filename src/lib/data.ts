
import { User, Reward, Task, AdOption, WithdrawalRequest, AdContent, AppSettings } from '@/types';

// Mock initial users
export const users: User[] = [
  {
    id: '1',
    username: 'anasgazi1',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    name: 'Admin User',
    coins: 10000,
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'demouser',
    email: 'user@example.com',
    password: 'demo123', // In a real app, this would be hashed
    name: 'Demo User',
    coins: 500,
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

// Mock rewards
export const rewards: Reward[] = [
  {
    id: '1',
    name: 'Amazon $10 Gift Card',
    description: 'Redeem for a $10 Amazon gift card code',
    image: '/placeholder.svg',
    cost: 5000,
    category: 'amazon',
    available: true,
  },
  {
    id: '2',
    name: 'Google Play $5 Gift Card',
    description: 'Redeem for a $5 Google Play gift card code',
    image: '/placeholder.svg',
    cost: 2500,
    category: 'google',
    available: true,
  },
  {
    id: '3',
    name: 'PUBG 600 UC',
    description: 'Redeem for 600 Unknown Cash in PUBG Mobile',
    image: '/placeholder.svg',
    cost: 3000,
    category: 'pubg',
    available: true,
  },
  {
    id: '4',
    name: 'Free Fire 500 Diamonds',
    description: 'Redeem for 500 Diamonds in Free Fire',
    image: '/placeholder.svg',
    cost: 3500,
    category: 'free-fire',
    available: true,
  },
  {
    id: '5',
    name: 'Visa $20 Virtual Card',
    description: 'Redeem for a $20 virtual Visa card',
    image: '/placeholder.svg',
    cost: 8000,
    category: 'visa',
    available: true,
  },
];

// Mock tasks
export const tasks: Task[] = [
  {
    id: '1',
    title: 'Complete your profile',
    description: 'Fill out all your profile information to earn coins',
    coins: 100,
  },
  {
    id: '2',
    title: 'Watch 5 ads',
    description: 'Watch 5 ads to earn bonus coins',
    coins: 250,
  },
  {
    id: '3',
    title: 'Refer a friend',
    description: 'Invite a friend to join and earn coins when they sign up',
    coins: 500,
  },
];

// Ad viewing options
export const adOptions: AdOption[] = [
  {
    id: '1',
    duration: 15,
    coins: 5,
  },
  {
    id: '2',
    duration: 25,
    coins: 15,
  },
  {
    id: '3',
    duration: 35,
    coins: 25,
  },
  {
    id: '4',
    duration: 50,
    coins: 40,
  },
];

// Mock withdrawal requests
export const withdrawalRequests: WithdrawalRequest[] = [
  {
    id: '1',
    userId: '2',
    username: 'demouser',
    rewardId: '1',
    rewardName: 'Amazon $10 Gift Card',
    cost: 5000,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

// Mock ad content
export const adContents: AdContent[] = [
  {
    id: '1',
    type: 'popup',
    html: '<div style="padding: 20px; background-color: #f0f0f0; border-radius: 8px;"><h3 style="color: #333;">Special Offer!</h3><p>Check out this amazing product now!</p><button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Learn More</button></div>',
    active: true,
  },
  {
    id: '2',
    type: 'banner',
    html: '<div style="width: 468px; height: 60px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #333; font-weight: bold; border: 1px solid #ddd;">Banner Ad 468x60</div>',
    active: true,
  },
];

// App settings
export const appSettings: AppSettings = {
  siteName: 'Coin Quest',
  primaryColor: '#8B5CF6',
  accentColor: '#D946EF',
  logoUrl: '/placeholder.svg',
  dailyRewardAmount: 100,
};

// Local storage keys
export const STORAGE_KEYS = {
  USERS: 'rewards-app-users',
  CURRENT_USER: 'rewards-app-current-user',
  TASKS: 'rewards-app-tasks',
  REWARDS: 'rewards-app-rewards',
  WITHDRAWAL_REQUESTS: 'rewards-app-withdrawal-requests',
  ADS: 'rewards-app-ads',
  AD_OPTIONS: 'rewards-app-ad-options',
  SETTINGS: 'rewards-app-settings',
  AD_CONTENTS: 'rewards-app-ad-contents',
  APP_SETTINGS: 'rewards-app-settings',
  INVITATIONS: 'rewards-app-invitations',
  INVITATION_SETTINGS: 'rewards-app-invitation-settings',
  IMAGES: 'rewards-app-images',
  LAST_SYNC: 'rewards-app-last-sync'
};

// Storage synchronization mechanism to solve cross-browser issues
const syncStorage = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Broadcast channel for cross-tab communication
    const storageUpdateChannel = new BroadcastChannel('coin-quest-storage-sync');
    
    // Listen for storage changes from other tabs
    storageUpdateChannel.onmessage = (event) => {
      if (event.data && event.data.key && event.data.value) {
        // Update local storage without triggering another event
        localStorage.setItem(event.data.key, event.data.value);
      }
    };
    
    // Override localStorage.setItem to broadcast changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      // Call the original function
      originalSetItem.apply(this, [key, value]);
      
      // Broadcast the change to other tabs
      if (key.startsWith('coin-quest-')) {
        storageUpdateChannel.postMessage({ key, value });
      }
      
      // Update last sync timestamp
      originalSetItem.apply(this, [STORAGE_KEYS.LAST_SYNC, new Date().toISOString()]);
    };
  } catch (error) {
    console.error('Storage sync setup failed:', error);
  }
};

// Initialize storage with mock data
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  // Setup storage synchronization
  syncStorage();

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.REWARDS)) {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.AD_OPTIONS)) {
    localStorage.setItem(STORAGE_KEYS.AD_OPTIONS, JSON.stringify(adOptions));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.WITHDRAWAL_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWAL_REQUESTS, JSON.stringify(withdrawalRequests));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.AD_CONTENTS)) {
    localStorage.setItem(STORAGE_KEYS.AD_CONTENTS, JSON.stringify(adContents));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(appSettings));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.IMAGES)) {
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify([]));
  }
  
  // Initialize invitation settings if not exist
  if (!localStorage.getItem(STORAGE_KEYS.INVITATION_SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.INVITATION_SETTINGS, JSON.stringify({
      targetReferrals: 10,
      reward: 500
    }));
  }
};
