// Authentication types for NEET Prep AI Platform
// Story 1.1: User Authentication System

export type UserTier = 'free' | 'basic' | 'premium' | 'enterprise';

export type UserRole = 'student' | 'coach' | 'parent' | 'admin';

export type LearningStyle = 
  | 'visual' 
  | 'auditory' 
  | 'kinesthetic' 
  | 'reading_writing';

export interface Student {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  tier: UserTier;
  role: UserRole;
  referred_by?: string;
  onboarding_completed: boolean;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  student_id: string;
  target_exam_date?: string;
  target_score?: number;
  study_hours_per_day: number;
  preferred_subjects: string[];
  weak_areas: string[];
  learning_style?: LearningStyle;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends Student {
  profile?: UserProfile;
}

// Authentication form types
export interface SignUpFormData {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
  phone?: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface UpdatePasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  full_name?: string;
  phone?: string;
  target_exam_date?: string;
  target_score?: number;
  study_hours_per_day?: number;
  preferred_subjects?: string[];
  weak_areas?: string[];
  learning_style?: LearningStyle;
  timezone?: string;
}

// Authentication context types
export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (data: SignUpFormData) => Promise<{ user?: AuthUser; error?: string }>;
  signIn: (data: SignInFormData) => Promise<{ user?: AuthUser; error?: string }>;
  signOut: () => Promise<{ error?: string }>;
  resetPassword: (data: ResetPasswordFormData) => Promise<{ error?: string }>;
  updatePassword: (data: UpdatePasswordFormData) => Promise<{ error?: string }>;
  updateProfile: (data: ProfileFormData) => Promise<{ user?: AuthUser; error?: string }>;
  refreshUser: () => Promise<void>;
}

// API response types
export interface AuthResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SessionData {
  user: AuthUser | null;
  expires?: string;
}

// Error types
export interface AuthError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Permission types
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export type RolePermissions = {
  [key in UserRole]: Permission[];
}

// Session types
export interface SessionConfig {
  maxAge: number;
  cookieName: string;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}
