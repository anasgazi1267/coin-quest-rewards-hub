
import { STORAGE_KEYS } from './data';

// Get images from localStorage
export const getImages = (): string[] => {
  if (typeof window === 'undefined') return [];
  const images = localStorage.getItem(STORAGE_KEYS.IMAGES);
  return images ? JSON.parse(images) : [];
};

// Save a new image and return its URL
export const saveImage = (base64Image: string): string => {
  if (typeof window === 'undefined') return '';
  
  const images = getImages();
  const imageId = `img_${Date.now()}`;
  const imageUrl = base64Image; // In a real app, we'd upload to a server and get a URL
  
  images.unshift(imageUrl);
  localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
  
  return imageUrl;
};

// Delete an image by URL
export const deleteImage = (imageUrl: string): void => {
  if (typeof window === 'undefined') return;
  
  const images = getImages();
  const filteredImages = images.filter(url => url !== imageUrl);
  localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(filteredImages));
};
