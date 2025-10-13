import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, UserType, UserProfile, OwnerProfile } from '../config/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userType: UserType | null;
  userProfile: UserProfile | null;
  ownerProfile: OwnerProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
    userType: UserType
  ) => Promise<{ error: AuthError | null }>;
  signUpOwner: (
    email: string,
    password: string,
    name: string,
    contactNo: string,
    pgName: string,
    pgLocation: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile based on user type
  const fetchUserProfile = async (userId: string, type: UserType) => {
    try {
      if (type === 'user') {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }
        setUserProfile(data);
        setOwnerProfile(null);
      } else if (type === 'owner') {
        const { data, error } = await supabase
          .from('owner_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching owner profile:', error);
          return;
        }
        setOwnerProfile(data);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Get user type from metadata
  const getUserType = async (userId: string): Promise<UserType | null> => {
    try {
      const { data, error } = await supabase
        .from('user_metadata')
        .select('user_type')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user type:', error);
        return null;
      }
      
      return data?.user_type || null;
    } catch (error) {
      console.error('Error fetching user type:', error);
      return null;
    }
  };

  // Initialize session
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        getUserType(session.user.id).then(async (type) => {
          setUserType(type);
          if (type) {
            await fetchUserProfile(session.user.id, type);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const type = await getUserType(session.user.id);
        setUserType(type);
        if (type) {
          await fetchUserProfile(session.user.id, type);
        }
      } else {
        setUserType(null);
        setUserProfile(null);
        setOwnerProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up for normal users
  const signUp = async (
    email: string,
    password: string,
    name: string,
    userType: UserType
  ): Promise<{ error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: userType,
          },
        },
      });

      if (error) return { error };

      // Note: Email verification is required, user will need to check their email
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign up for owners with PG details
  const signUpOwner = async (
    email: string,
    password: string,
    name: string,
    contactNo: string,
    pgName: string,
    pgLocation: string
  ): Promise<{ error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: 'owner',
            contact_no: contactNo,
            pg_name: pgName,
            pg_location: pgLocation,
          },
        },
      });

      if (error) return { error };

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign in
  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setUserType(null);
    setUserProfile(null);
    setOwnerProfile(null);
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user && userType) {
      await fetchUserProfile(user.id, userType);
    }
  };

  const value = {
    session,
    user,
    userType,
    userProfile,
    ownerProfile,
    loading,
    signUp,
    signUpOwner,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
