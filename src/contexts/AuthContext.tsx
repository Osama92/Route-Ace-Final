import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "operations" | "support" | "dispatcher" | "driver" | "super_admin" | "org_admin" | "ops_manager" | "finance_manager" | "customer" | "internal_team" | "core_founder" | "core_builder" | "core_product" | "core_engineer";
type ApprovalStatus = "pending" | "approved" | "suspended" | "rejected";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: AppRole | null;
  loading: boolean;
  currentSessionId: string | null;
  isApproved: boolean;
  approvalStatus: ApprovalStatus | null;
  suspensionReason: string | null;
  isSuperAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  refreshApprovalStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus | null>(null);
  const [suspensionReason, setSuspensionReason] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const isApproved = approvalStatus === "approved";
  const isSuperAdmin = userRole === "super_admin";

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.log("No role found for user");
        return null;
      }
      return data?.role as AppRole;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  const fetchApprovalStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("approval_status, suspension_reason")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.log("No profile found for user");
        return { status: null, reason: null };
      }
      return {
        status: data?.approval_status as ApprovalStatus,
        reason: data?.suspension_reason,
      };
    } catch (error) {
      console.error("Error fetching approval status:", error);
      return { status: null, reason: null };
    }
  };

  const refreshApprovalStatus = async () => {
    if (user) {
      const { status, reason } = await fetchApprovalStatus(user.id);
      setApprovalStatus(status);
      setSuspensionReason(reason);
    }
  };

  // Create a new session record when user logs in
  const createSessionRecord = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_sessions")
        .insert({
          user_id: userId,
          login_at: new Date().toISOString(),
          ip_address: null,
          user_agent: navigator.userAgent,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error creating session record:", error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error("Error creating session record:", error);
      return null;
    }
  };

  // Update session record when user logs out
  const updateSessionRecord = async (sessionId: string) => {
    if (!sessionId) return;

    try {
      const { data: sessionData } = await supabase
        .from("user_sessions")
        .select("login_at")
        .eq("id", sessionId)
        .single();

      let sessionDuration = null;
      if (sessionData?.login_at) {
        const loginTime = new Date(sessionData.login_at);
        const logoutTime = new Date();
        sessionDuration = Math.round((logoutTime.getTime() - loginTime.getTime()) / 60000);
      }

      await supabase
        .from("user_sessions")
        .update({
          logout_at: new Date().toISOString(),
          session_duration_minutes: sessionDuration,
        })
        .eq("id", sessionId);
    } catch (error) {
      console.error("Error updating session record:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Helper to load user data (role + approval) with guaranteed finally-setLoading
    const loadUserData = async (userId: string) => {
      try {
        const [role, approval] = await Promise.all([
          fetchUserRole(userId),
          fetchApprovalStatus(userId),
        ]);
        if (!isMounted) return;
        setUserRole(role);
        setApprovalStatus(approval.status);
        setSuspensionReason(approval.reason);
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    // Listener for ONGOING auth changes — does NOT control global loading
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        if (event === "SIGNED_IN" && session?.user) {
          // Use setTimeout to avoid Supabase deadlock inside onAuthStateChange
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              const newSessionId = await createSessionRecord(session.user.id);
              if (newSessionId && isMounted) {
                sessionIdRef.current = newSessionId;
                setCurrentSessionId(newSessionId);
              }
              await loadUserData(session.user.id);
            } finally {
              if (isMounted) setLoading(false);
            }
          }, 0);
        } else if (event === "SIGNED_OUT") {
          if (sessionIdRef.current) {
            updateSessionRecord(sessionIdRef.current);
            sessionIdRef.current = null;
            setCurrentSessionId(null);
          }
          setUserRole(null);
          setApprovalStatus(null);
          setSuspensionReason(null);
          setLoading(false);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          // Refresh silently — don't touch loading state
          setTimeout(() => loadUserData(session.user.id), 0);
        } else if (event !== "SIGNED_IN") {
          // Any other event with no user → stop loading
          if (!session?.user) setLoading(false);
        }
      }
    );

    // INITIAL session load — controls global loading, must set loading=false in finally
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const newSessionId = await createSessionRecord(session.user.id);
          if (newSessionId && isMounted) {
            sessionIdRef.current = newSessionId;
            setCurrentSessionId(newSessionId);
          }
          await loadUserData(session.user.id);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // Clean up session on page unload
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        const payload = JSON.stringify({
          session_id: sessionIdRef.current,
          logout_at: new Date().toISOString(),
        });
        navigator.sendBeacon?.(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_sessions?id=eq.${sessionIdRef.current}`,
          payload
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    // Update session record before signing out
    if (sessionIdRef.current) {
      await updateSessionRecord(sessionIdRef.current);
      sessionIdRef.current = null;
      setCurrentSessionId(null);
    }
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setApprovalStatus(null);
    setSuspensionReason(null);
  };

  const hasRole = (role: AppRole) => userRole === role;
  
  const hasAnyRole = (roles: AppRole[]) => userRole !== null && roles.includes(userRole);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        loading,
        currentSessionId,
        isApproved,
        approvalStatus,
        suspensionReason,
        isSuperAdmin,
        signUp,
        signIn,
        signOut,
        hasRole,
        hasAnyRole,
        refreshApprovalStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
