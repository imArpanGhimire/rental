import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  getProfile,
} from "../../api/auth.api";
import { setUnauthorizedHandler } from "../../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we check for an existing session

  // On mount: try to rehydrate session from the httpOnly cookie.
  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((data) => {
        if (!cancelled) setUser(data.user || data);
      })
      .catch(() => {
        // No valid session (or /auth/me doesn't exist yet on the backend) — treat as logged out
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // If any API call gets a 401, clear local user state immediately.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    setUser(data.user || data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  // Merge a partial update into the current user (e.g. after editing the
  // name, or after an avatar upload/removal succeeds) without a refetch.
  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
