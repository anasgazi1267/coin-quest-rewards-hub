
import { AppSettings } from '@/types';
import { STORAGE_KEYS } from './data';

// Get app settings
export const getAppSettings = (): AppSettings => {
  if (typeof window === 'undefined') {
    return {
      siteName: 'Coin Quest',
      primaryColor: '#8B5CF6',
      accentColor: '#D946EF',
      logoUrl: '/placeholder.svg',
      dailyRewardAmount: 100,
    };
  }
  
  const settings = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
  return settings ? JSON.parse(settings) : {
    siteName: 'Coin Quest',
    primaryColor: '#8B5CF6',
    accentColor: '#D946EF',
    logoUrl: '/placeholder.svg',
    dailyRewardAmount: 100,
  };
};

// Save app settings
export const saveAppSettings = (settings: AppSettings): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
};
