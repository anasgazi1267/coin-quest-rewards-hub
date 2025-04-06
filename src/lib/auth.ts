
import { User } from '@/types';
import { STORAGE_KEYS } from './data';
import { toast } from '@/components/ui/sonner';

// Get all users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

// Save current user to localStorage
export const saveCurrentUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  
  // Also update this user in the users array
  const users = getUsers();
  const updatedUsers = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
};

// Login user
export const login = (username: string, password: string): User | null => {
  const users = getUsers();
  
  // For admin user, check hardcoded credentials
  if (username === 'anasgazi1' && password === 'Anas1999@') {
    const adminUser = users.find(user => user.role === 'admin');
    if (adminUser) {
      saveCurrentUser(adminUser);
      return adminUser;
    }
  }
  
  // For regular users, just check username (in a real app, you'd verify passwords)
  const user = users.find(user => user.username === username);
  if (user) {
    saveCurrentUser(user);
    return user;
  }
  
  return null;
};

// Register user
export const register = (username: string, email: string, password: string): User | null => {
  const users = getUsers();
  
  // Check if username or email already exists
  if (users.some(user => user.username === username)) {
    toast.error("Username already exists");
    return null;
  }
  
  if (users.some(user => user.email === email)) {
    toast.error("Email already exists");
    return null;
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    coins: 0,
    avatar: '/placeholder.svg',
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  
  // Save new user
  const updatedUsers = [...users, newUser];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  
  // Login the new user
  saveCurrentUser(newUser);
  return newUser;
};

// Logout user
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Update user coins
export const updateUserCoins = (userId: string, coins: number): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;
  
  const updatedUser = { ...users[userIndex], coins };
  users[userIndex] = updatedUser;
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // If this is the current user, update current user as well
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    saveCurrentUser(updatedUser);
  }
  
  return updatedUser;
};

// Claim daily reward
export const claimDailyReward = (userId: string, amount: number): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return false;
  
  const user = users[userIndex];
  const now = new Date();
  const lastClaim = user.lastDailyReward ? new Date(user.lastDailyReward) : null;
  
  // Check if 24 hours have passed since last claim
  if (lastClaim && now.getTime() - lastClaim.getTime() < 24 * 60 * 60 * 1000) {
    return false;
  }
  
  // Update user with new coins and last claim time
  const updatedUser = { 
    ...user, 
    coins: user.coins + amount,
    lastDailyReward: now.toISOString() 
  };
  
  users[userIndex] = updatedUser;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // If this is the current user, update current user as well
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    saveCurrentUser(updatedUser);
  }
  
  return true;
};

// Check if user can claim daily reward
export const canClaimDailyReward = (userId: string): boolean => {
  const users = getUsers();
  const user = users.find(user => user.id === userId);
  
  if (!user) return false;
  
  const now = new Date();
  const lastClaim = user.lastDailyReward ? new Date(user.lastDailyReward) : null;
  
  // If never claimed or more than 24 hours have passed
  return !lastClaim || now.getTime() - lastClaim.getTime() >= 24 * 60 * 60 * 1000;
};

// Get time until next daily reward
export const getTimeUntilNextDailyReward = (userId: string): number => {
  const users = getUsers();
  const user = users.find(user => user.id === userId);
  
  if (!user || !user.lastDailyReward) return 0;
  
  const now = new Date();
  const lastClaim = new Date(user.lastDailyReward);
  const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
  
  return Math.max(0, nextClaim.getTime() - now.getTime());
};
