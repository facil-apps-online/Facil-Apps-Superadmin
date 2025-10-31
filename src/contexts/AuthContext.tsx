import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// --- INTERFACES ---
interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  country_id?: string;
  language_id?: string;
  currency_id?: string;
  timezone?: string;
}

export interface UserAssignment {
  assignment_id?: string;
  tenant_id?: string;
  tenant_name?: string;
  role_id?: string;
  role: string;
  branch_id?: string | null;
  branch_name?: string | null;
  status: 'active' | 'inactive';
  platform_id?: string;
  stake_percentage?: number;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  assignments: UserAssignment[];
  currentAssignment: UserAssignment | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  switchAssignment: (assignmentId: string) => Promise<void>;
  switchCurrentAssignment: (assignment: UserAssignment) => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; supabaseClient: any }> = ({ children, supabaseClient }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [currentAssignment, setCurrentAssignment] = useState<UserAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const processSession = useCallback((sessionData: Session | null) => {
    setSession(sessionData);
    setUser(sessionData?.user ?? null);

    if (sessionData?.user) {
      const { app_metadata, user_metadata, id, email } = sessionData.user;
      const userProfile: UserProfile = {
        id: id,
        email: email || '',
        firstName: user_metadata.first_name,
        lastName: user_metadata.last_name,
        avatarUrl: user_metadata.avatar_url,
        country_id: user_metadata.country_id,
        language_id: user_metadata.language_id,
        currency_id: user_metadata.currency_id,
        timezone: user_metadata.timezone,
      };
      setProfile(userProfile);

      if (app_metadata.assignments && Array.isArray(app_metadata.assignments) && app_metadata.assignments.length > 0) {
        console.log("AuthContext: User has assignments:", app_metadata.assignments);
        const allAssignments: UserAssignment[] = app_metadata.assignments.map((a: any) => ({
          assignment_id: a.assignment_id,
          tenant_id: a.tenant_id,
          tenant_name: a.tenant_name,
          role_id: a.role_id,
          role: a.role,
          branch_id: a.branch_id || null,
          branch_name: a.branch_name || null,
          status: a.status || 'active',
          platform_id: a.platform_id,
          stake_percentage: a.stake_percentage,
        }));
        setAssignments(allAssignments);
        setCurrentAssignment(allAssignments[0]);
        console.log("AuthContext: currentAssignment set to:", allAssignments[0]);
      } else {
        console.log("AuthContext: User has no assignments.");
        setAssignments([]);
        setCurrentAssignment(null);
      }
    } else {
      console.log("AuthContext: No user in sessionData.");
      setProfile(null);
      setAssignments([]);
      setCurrentAssignment(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (!supabaseClient?.auth) {
      setLoading(false);
      return;
    }
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => processSession(session));
    return () => subscription.unsubscribe();
  }, [supabaseClient, processSession]);

  const login = useCallback(async (email: string, password: string) => {
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;

    // After successful sign-in, explicitly get the session and process it
    const { data: { session }, error: getSessionError } = await supabaseClient.auth.getSession();
    if (getSessionError) throw getSessionError;
    
    processSession(session); // Manually trigger session processing to update context state

    const role = session?.user?.app_metadata?.assignments?.[0]?.role || null;
    return role;
  }, [supabaseClient, processSession]);

  const logout = useCallback(async () => {
    await supabaseClient.auth.signOut();
    navigate('/auth');
  }, [supabaseClient, navigate]);
  
  const refreshUser = useCallback(async () => {
    await supabaseClient.auth.refreshSession();
    const { data: { session } } = await supabaseClient.auth.getSession();
    processSession(session);
  }, [supabaseClient, processSession]);

  const switchAssignment = useCallback(async (assignmentId: string) => {
    if (!user) throw new Error("Usuario no autenticado para cambiar de asignación.");
    
    const { data, error } = await supabaseClient.functions.invoke('user-actions', {
      body: {
        action: 'switch-assignment',
        payload: { userId: user.id, newAssignmentId: assignmentId },
      },
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.message || "Error al cambiar de asignación.");

    await refreshUser();
  }, [user, supabaseClient, refreshUser]);

  const switchCurrentAssignment = useCallback((assignment: UserAssignment) => {
    setCurrentAssignment(assignment);
    // Navigate to the appropriate page for the new role
    switch (assignment.role) {
      case 'investor':
        navigate('/dashboard');
        break;
      case 'vendor':
        navigate('/commissions');
        break;
      case 'super_admin':
      case 'app_super_admin':
        navigate('/');
        break;
      default:
        navigate('/');
    }
  }, [navigate]);

  const contextValue = useMemo(() => ({
    session,
    user,
    profile,
    assignments,
    currentAssignment,
    isAuthenticated: !!currentAssignment && currentAssignment.status === 'active',
    login,
    logout,
    switchAssignment,
    switchCurrentAssignment,
    refreshUser,
    loading,
  }), [session, user, profile, assignments, currentAssignment, loading, login, logout, switchAssignment, switchCurrentAssignment, refreshUser]);

  console.log("AuthContext: providing value", contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};