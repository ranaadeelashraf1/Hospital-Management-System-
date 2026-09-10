import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

const TOKEN_KEY = "medicare_token";
const USER_KEY = "medicare_user";

// Maps a backend role to the base path of that role's portal
export const roleHome = {
  ADMIN: "/dashboard",
  RECEPTIONIST: "/dashboard",
  DOCTOR: "/doctor/dashboard",
  PATIENT: "/patient/dashboard",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    // Re-validate the token / refresh the user on app load
    authApi
      .me()
      .then((data) => {
        setUser(data);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user: loggedInUser } = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (payload) => {
    const { user: newUser } = await authApi.register(payload);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
