
export interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  avatar?: string;
  role: 'user' | 'admin';
  lastDailyReward?: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  image: string;
  cost: number;
  category: 'amazon' | 'google' | 'pubg' | 'free-fire' | 'visa';
  available: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  coins: number;
  completed?: boolean;
}

export interface AdOption {
  id: string;
  duration: number; // in seconds
  coins: number;
  lastViewed?: string; // ISO date string
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  rewardId: string;
  rewardName: string;
  cost: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; // ISO date string
}

export interface AdContent {
  id: string;
  type: 'popup' | 'banner';
  html: string;
  active: boolean;
}

export interface AppSettings {
  siteName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  dailyRewardAmount: number;
}
