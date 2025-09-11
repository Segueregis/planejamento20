import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'lider' | 'tecnico' | 'operador';

interface UserProfile {
  id: string;
  email: string;
  nome: string;
  perfil: string;
  roles?: UserRole[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string, perfil: UserRole) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }

      const roles = rolesData?.map(r => r.role as UserRole) || [];
      
      const userProfileData: UserProfile = {
        ...profile,
        roles
      };

      console.log('Setting user profile:', userProfileData);
      setUserProfile(userProfileData);
    } catch (error) {
      console.error('Exception fetching user profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { event, hasUser: !!session?.user, userId: session?.user?.id });
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('Fetching profile for user:', session.user.id);
            // Fetch user profile and roles
            await fetchUserProfile(session.user.id);
          } else {
            setUserProfile(null);
          }
          
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
        
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext signIn called with:', { email });
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('Supabase signIn response:', { error, user: data?.user?.id });
      return { error };
    } catch (err) {
      console.error('Supabase signIn exception:', err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, nome: string, perfil: UserRole) => {
    console.log('AuthContext signUp called', { email, nome, perfil });
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome,
            perfil
          }
        }
      });
      
      console.log('Supabase signUp response:', { error, data });
      return { error };
    } catch (err) {
      console.error('Supabase signUp exception:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    setUserProfile(null);
    await supabase.auth.signOut();
  };

  const hasRole = (role: UserRole): boolean => {
    return userProfile?.roles?.includes(role) || false;
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};