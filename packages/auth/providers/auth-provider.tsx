// Authentication Provider for NEET Prep AI Platform
// Story 1.1: User Authentication System

'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { createClientSupabase, handleAuthError, authEvents } from '../utils/supabase';
import { 
  AuthUser, 
  AuthContextType, 
  SignUpFormData, 
  SignInFormData, 
  ResetPasswordFormData, 
  UpdatePasswordFormData,
  ProfileFormData 
} from '../types';

// Create Auth Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClientSupabase();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('student_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Fetch complete user data with profile
  const fetchCompleteUser = async (authUser: any) => {
    try {
      // Get student data
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (studentError) {
        console.error('Error fetching student data:', studentError);
        return null;
      }

      // Get profile data
      const profile = await fetchUserProfile(authUser.id);

      const completeUser: AuthUser = {
        ...student,
        profile: profile || undefined,
      };

      return completeUser;
    } catch (error) {
      console.error('Error fetching complete user:', error);
      return null;
    }
  };

  // Sign up function
  const signUp = useCallback(async (formData: SignUpFormData) => {
    try {
      setLoading(true);

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: formData.role || 'student',
          },
        },
      });

      if (error) {
        return { error: handleAuthError(error) };
      }

      if (data.user) {
        // Create student record
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone,
            role: formData.role || 'student',
          });

        if (studentError) {
          console.error('Error creating student record:', studentError);
          return { error: 'Failed to create user profile' };
        }

        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            student_id: data.user.id,
            timezone: 'Asia/Kolkata',
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't fail the signup if profile creation fails
        }

        authEvents.onSignUp(data.user);
        
        return { 
          user: await fetchCompleteUser(data.user) || undefined 
        };
      }

      return { error: 'Sign up failed' };
    } catch (error) {
      return { error: handleAuthError(error) };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Sign in function
  const signIn = useCallback(async (formData: SignInFormData) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        return { error: handleAuthError(error) };
      }

      if (data.user) {
        const completeUser = await fetchCompleteUser(data.user);
        if (completeUser) {
          setUser(completeUser);
          authEvents.onSignIn(data.user);
          return { user: completeUser };
        }
      }

      return { error: 'Sign in failed' };
    } catch (error) {
      return { error: handleAuthError(error) };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: handleAuthError(error) };
      }

      setUser(null);
      authEvents.onSignOut();
      return {};
    } catch (error) {
      return { error: handleAuthError(error) };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Reset password function
  const resetPassword = useCallback(async (formData: ResetPasswordFormData) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        return { error: handleAuthError(error) };
      }

      authEvents.onPasswordReset(formData.email);
      return {};
    } catch (error) {
      return { error: handleAuthError(error) };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Update password function
  const updatePassword = useCallback(async (formData: UpdatePasswordFormData) => {
    try {
      setLoading(true);

      if (formData.password !== formData.confirmPassword) {
        return { error: 'Passwords do not match' };
      }

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        return { error: handleAuthError(error) };
      }

      return {};
    } catch (error) {
      return { error: handleAuthError(error) };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Update profile function
  const updateProfile = useCallback(async (formData: ProfileFormData) => {
    try {
      setLoading(true);

      if (!user) {
        return { error: 'No user logged in' };
      }

      // Update student data
      const studentUpdates: any = {};
      if (formData.full_name !== undefined) studentUpdates.full_name = formData.full_name;
      if (formData.phone !== undefined) studentUpdates.phone = formData.phone;

      if (Object.keys(studentUpdates).length > 0) {
        const { error: studentError } = await supabase
          .from('students')
          .update(studentUpdates)
          .eq('id', user.id);

        if (studentError) {
          return { error: handleAuthError(studentError) };
        }
      }

      // Update profile data
      const profileUpdates: any = {};
      if (formData.target_exam_date !== undefined) profileUpdates.target_exam_date = formData.target_exam_date;
      if (formData.target_score !== undefined) profileUpdates.target_score = formData.target_score;
      if (formData.study_hours_per_day !== undefined) profileUpdates.study_hours_per_day = formData.study_hours_per_day;
      if (formData.preferred_subjects !== undefined) profileUpdates.preferred_subjects = formData.preferred_subjects;
      if (formData.weak_areas !== undefined) profileUpdates.weak_areas = formData.weak_areas;
      if (formData.learning_style !== undefined) profileUpdates.learning_style = formData.learning_style;
      if (formData.timezone !== undefined) profileUpdates.timezone = formData.timezone;

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            student_id: user.id,
            ...profileUpdates,
          });

        if (profileError) {
          return { error: handleAuthError(profileError) };
        }
      }

      // Refresh user data
      const updatedUser = await fetchCompleteUser({ id: user.id });
      if (updatedUser) {
        setUser(updatedUser);
        return { user: updatedUser };
      }

      return { error: 'Failed to update profile' };
    } catch (error) {
      return { error: handleAuthError(error) };
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const completeUser = await fetchCompleteUser(authUser);
        setUser(completeUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && isMounted) {
          const completeUser = await fetchCompleteUser(session.user);
          if (isMounted) {
            setUser(completeUser);
          }
        } else if (isMounted) {
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const completeUser = await fetchCompleteUser(session.user);
          setUser(completeUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
