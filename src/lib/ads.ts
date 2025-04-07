import { AdOption, AdContent } from '@/types';
import { STORAGE_KEYS } from './data';
import { getCurrentUser, updateUserCoins } from './auth';
import { toast } from '@/lib/toast';

// Get all ad options
export const getAdOptions = (): AdOption[] => {
  if (typeof window === 'undefined') return [];
  const options = localStorage.getItem(STORAGE_KEYS.AD_OPTIONS);
  return options ? JSON.parse(options) : [];
};

// Save ad options
export const saveAdOptions = (options: AdOption[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.AD_OPTIONS, JSON.stringify(options));
};

// Get all ad contents
export const getAdContents = (): AdContent[] => {
  if (typeof window === 'undefined') return [];
  const contents = localStorage.getItem(STORAGE_KEYS.AD_CONTENTS);
  return contents ? JSON.parse(contents) : [];
};

// Save ad contents
export const saveAdContents = (contents: AdContent[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.AD_CONTENTS, JSON.stringify(contents));
};

// Add or update ad content
export const saveAdContent = (content: AdContent): AdContent => {
  const contents = getAdContents();
  
  if (content.id) {
    // Update existing content
    const updatedContents = contents.map(c => c.id === content.id ? content : c);
    saveAdContents(updatedContents);
  } else {
    // Add new content
    const newContent = {
      ...content,
      id: Date.now().toString(),
    };
    saveAdContents([...contents, newContent]);
    return newContent;
  }
  
  return content;
};

// Delete ad content
export const deleteAdContent = (id: string): void => {
  const contents = getAdContents();
  const filteredContents = contents.filter(content => content.id !== id);
  saveAdContents(filteredContents);
};

// Get user ad view timestamps for cooldown checking
export const getUserAdViewTimestamps = (userId: string): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const key = `${STORAGE_KEYS.AD_OPTIONS}-${userId}-views`;
  const timestamps = localStorage.getItem(key);
  return timestamps ? JSON.parse(timestamps) : {};
};

// Save user ad view timestamp
export const saveUserAdViewTimestamp = (userId: string, adOptionId: string, timestamp: string): void => {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_KEYS.AD_OPTIONS}-${userId}-views`;
  const timestamps = getUserAdViewTimestamps(userId);
  
  timestamps[adOptionId] = timestamp;
  localStorage.setItem(key, JSON.stringify(timestamps));
};

// Check if ad is in cooldown
export const isAdInCooldown = (adOptionId: string, userId: string, cooldownMinutes = 5): boolean => {
  const timestamps = getUserAdViewTimestamps(userId);
  const lastViewed = timestamps[adOptionId];
  
  if (!lastViewed) return false;
  
  const lastViewedTime = new Date(lastViewed).getTime();
  const now = new Date().getTime();
  const cooldownMs = cooldownMinutes * 60 * 1000;
  
  return now - lastViewedTime < cooldownMs;
};

// Get cooldown time remaining in seconds
export const getAdCooldownRemaining = (adOptionId: string, userId: string, cooldownMinutes = 5): number => {
  const timestamps = getUserAdViewTimestamps(userId);
  const lastViewed = timestamps[adOptionId];
  
  if (!lastViewed) return 0;
  
  const lastViewedTime = new Date(lastViewed).getTime();
  const now = new Date().getTime();
  const cooldownMs = cooldownMinutes * 60 * 1000;
  const remainingMs = Math.max(0, cooldownMs - (now - lastViewedTime));
  
  return Math.ceil(remainingMs / 1000);
};

// Record ad view and add coins
export const recordAdView = (adOptionId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    toast.error("You must be logged in to view ads");
    return false;
  }
  
  const adOptions = getAdOptions();
  const adOption = adOptions.find(opt => opt.id === adOptionId);
  
  if (!adOption) {
    toast.error("Ad option not found");
    return false;
  }
  
  // Check cooldown
  if (isAdInCooldown(adOptionId, currentUser.id)) {
    const cooldownSecs = getAdCooldownRemaining(adOptionId, currentUser.id);
    toast.error(`Please wait ${cooldownSecs} seconds before viewing this ad again`);
    return false;
  }
  
  // Record view
  const now = new Date().toISOString();
  saveUserAdViewTimestamp(currentUser.id, adOptionId, now);
  
  // Add coins to user
  updateUserCoins(currentUser.id, currentUser.coins + adOption.coins);
  
  toast.success(`Ad viewed! You earned ${adOption.coins} coins`);
  return true;
};

// Get active popup ad
export const getActivePopupAd = (): AdContent | null => {
  const contents = getAdContents();
  return contents.find(content => content.type === 'popup' && content.active) || null;
};

// Get active banner ads (multiple)
export const getActiveBannerAds = (): AdContent[] => {
  const contents = getAdContents();
  return contents.filter(content => content.type === 'banner' && content.active).slice(0, 3);
};
