// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, this would never be stored in plain text
  name: string;
  coins: number;
  role: 'user' | 'admin';
  createdAt: string;
  inviteCode?: string; // User's unique invite code
  invitedBy?: string; // ID of the user who invited this user
  inviteCount?: number; // Number of users this user has invited
  lastDailyReward?: string; // Last time user claimed daily reward
}

// Task related types
export interface Task {
  id: string;
  title: string;
  description: string;
  coins: number;
  type?: 'regular' | 'social' | 'youtube' | 'telegram'; // Task type for verification logic
  url?: string; // URL for external tasks like YouTube or Telegram
  isVerificationRequired?: boolean;
}

// Reward related types
export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'amazon' | 'google' | 'pubg' | 'free-fire' | 'visa';
  image: string;
  available: boolean;
  requiresId?: boolean;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  rewardId: string;
  rewardName: string;
  cost: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  rejectionReason?: string;
  playerId?: string;
}

// Ad related types
export interface AdOption {
  id: string;
  duration: number; // seconds
  coins: number;
}

export interface AdContent {
  id: string;
  type: 'popup' | 'banner';
  html: string;
  active: boolean;
}

// App settings
export interface AppSettings {
  siteName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  dailyRewardAmount: number;
}

// Invitation system
export interface Invitation {
  code: string;
  userId: string;
  usedBy: string[];
  createdAt: string;
}
