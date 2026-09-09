import { createElement, createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, clearSession, getStoredUser, getToken, setSession } from "./services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    let active = true;
    const handleExpired = () => { if (active) { clearSession(); setUser(null); setLoading(false); } };
    window.addEventListener("packsure-auth-expired", handleExpired);
    if (!getToken()) { setLoading(false); return () => { active = false; window.removeEventListener("packsure-auth-expired", handleExpired); }; }
    api.me().then(({ user: current }) => {
      if (active) { setUser(current); localStorage.setItem("packsure_user", JSON.stringify(current)); }
    }).catch(() => { if (active) { clearSession(); setUser(null); } }).finally(() => active && setLoading(false));
    return () => { active = false; window.removeEventListener("packsure-auth-expired", handleExpired); };
  }, []);

  const value = useMemo(() => ({
    user, loading,
    async login(credentials) {
      const result = await api.login(credentials);
      setSession(result.token, result.user);
      setUser(result.user);
      return result;
    },
    async signup(payload) {
      const result = await api.signup(payload);
      if (result.token) {
        setSession(result.token, result.user);
        setUser(result.user);
      } else {
        // Supabase may require email verification before issuing a session.
        // Never mark the user as logged in without a real PackSure token.
        clearSession();
        setUser(null);
        if (result.verificationRequired) {
          window.location.assign(`/login?registered=1&email=${encodeURIComponent(payload.email || "")}`);
        }
      }
      return result;
    },
    logout() { clearSession(); setUser(null); },
  }), [user, loading]);

  return createElement(AuthContext.Provider, { value }, children);
}

export const useAuth = () => useContext(AuthContext);
