// useAuth hook for NEET Prep AI Platform
// Story 1.1: User Authentication System

'use client';

import { useContext } from 'react';
import { AuthContext } from '../providers/auth-provider';
import { AuthContextType } from '../types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Custom hooks for specific auth operations
export const useSignUp = () => {
  const { signUp, loading } = useAuth();
  return { signUp, loading };
};

export const useSignIn = () => {
  const { signIn, loading } = useAuth();
  return { signIn, loading };
};

export const useSignOut = () => {
  const { signOut, loading } = useAuth();
  return { signOut, loading };
};

export const useUser = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};

export const useProfile = () => {
  const { user, updateProfile, loading } = useAuth();
  return { 
    profile: user?.profile, 
    updateProfile, 
    loading 
  };
};
