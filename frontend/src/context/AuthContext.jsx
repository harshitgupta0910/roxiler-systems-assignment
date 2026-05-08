import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { loginRequest, registerRequest } from "../services/auth.js";

export const AuthContext = createContext(null);

const STORAGE_KEY = "store_rating_auth";

function readStoredAuth() {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) return { source: "local", data: JSON.parse(local) };
  const session = sessionStorage.getItem(STORAGE_KEY);
  if (session) return { source: "session", data: JSON.parse(session) };
  return { source: "none", data: null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored.data) {
      setUser(stored.data.user || null);
      setToken(stored.data.token || null);
    }
    setLoading(false);
  }, []);

  const persist = useCallback((nextUser, nextToken, storage = localStorage) => {
    setUser(nextUser);
    setToken(nextToken);
    storage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
    if (storage === sessionStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (payload, options = {}) => {
    const data = await loginRequest(payload);
    const storage = options.remember === false ? sessionStorage : localStorage;
    persist(data.user, data.token, storage);
    return data;
  }, [persist]);

  const register = useCallback(async (payload) => {
    const data = await registerRequest(payload);
    persist(data.user, data.token);
    return data;
  }, [persist]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, setUser }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
