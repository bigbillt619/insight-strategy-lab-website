import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/** Tracks the current Supabase auth session (admin owner login). */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading, isAuthenticated: !!session };
}

/**
 * Verifies the current session belongs to an owner/admin by calling the
 * SECURITY DEFINER `is_admin()` RPC (gated on the app_admins allowlist).
 * A valid Supabase session alone is NOT sufficient for admin access.
 */
export function useIsAdmin() {
  const { session, loading: sessionLoading } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    let active = true;
    setChecking(true);
    supabase.rpc("is_admin").then(({ data, error }) => {
      if (!active) return;
      setIsAdmin(!error && data === true);
      setChecking(false);
    });
    return () => {
      active = false;
    };
  }, [session, sessionLoading]);

  return { isAdmin, loading: sessionLoading || checking };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
