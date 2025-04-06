
import { Invitation, User } from '@/types';
import { STORAGE_KEYS } from './data';
import { getCurrentUser, getUsers, saveUsers } from './auth';
import { toast } from '@/lib/toast';

// Get all invitations
export const getInvitations = (): Invitation[] => {
  if (typeof window === 'undefined') return [];
  const invitations = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
  return invitations ? JSON.parse(invitations) : [];
};

// Save all invitations
export const saveInvitations = (invitations: Invitation[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
};

// Generate a random invite code
export const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Create an invitation for a user
export const createInvitation = (userId: string): Invitation => {
  const invitations = getInvitations();
  
  // Check if user already has an invitation
  const existingInvitation = invitations.find(inv => inv.userId === userId);
  if (existingInvitation) {
    return existingInvitation;
  }
  
  // Create new invitation
  const newInvitation: Invitation = {
    code: generateInviteCode(),
    userId,
    usedBy: [],
    createdAt: new Date().toISOString()
  };
  
  saveInvitations([...invitations, newInvitation]);
  
  // Update user with invite code
  const users = getUsers();
  const updatedUsers = users.map(user => {
    if (user.id === userId) {
      return { ...user, inviteCode: newInvitation.code };
    }
    return user;
  });
  
  saveUsers(updatedUsers);
  
  return newInvitation;
};

// Get user's invitation
export const getUserInvitation = (userId: string): Invitation | null => {
  const invitations = getInvitations();
  return invitations.find(inv => inv.userId === userId) || null;
};

// Use an invite code
export const useInviteCode = (code: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    toast.error("You must be logged in to use an invite code");
    return false;
  }
  
  // Cannot use an invite code if already invited by someone
  if (currentUser.invitedBy) {
    toast.error("You have already used an invite code");
    return false;
  }
  
  const invitations = getInvitations();
  const invitation = invitations.find(inv => inv.code === code);
  
  if (!invitation) {
    toast.error("Invalid invite code");
    return false;
  }
  
  // Cannot use own invite code
  if (invitation.userId === currentUser.id) {
    toast.error("You cannot use your own invite code");
    return false;
  }
  
  // Check if this user has already used this code
  if (invitation.usedBy.includes(currentUser.id)) {
    toast.error("You have already used this invite code");
    return false;
  }
  
  // Update invitation
  const updatedInvitations = invitations.map(inv => {
    if (inv.code === code) {
      return { ...inv, usedBy: [...inv.usedBy, currentUser.id] };
    }
    return inv;
  });
  
  saveInvitations(updatedInvitations);
  
  // Update both users
  const users = getUsers();
  const inviter = users.find(user => user.id === invitation.userId);
  
  if (inviter) {
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, invitedBy: inviter.id };
      }
      if (user.id === inviter.id) {
        return { 
          ...user, 
          inviteCount: (user.inviteCount || 0) + 1,
          coins: user.coins + 50 // Reward for successful invite
        };
      }
      return user;
    });
    
    saveUsers(updatedUsers);
    toast.success("Invite code used successfully! Inviter received 50 coins.");
    return true;
  }
  
  return false;
};

// Get invite link for sharing
export const getInviteLink = (code: string): string => {
  return `${window.location.origin}/register?invite=${code}`;
};
