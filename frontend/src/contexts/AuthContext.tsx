import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "doctor" | "nurse" | "service";

interface AuthContextType {
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("surginerve_token")
  );
  const [role, setRole] = useState<UserRole | null>(
    () => (localStorage.getItem("surginerve_role") as UserRole) || null
  );

  const login = (newToken: string, newRole: UserRole) => {
    localStorage.setItem("surginerve_token", newToken);
    localStorage.setItem("surginerve_role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("surginerve_token");
    localStorage.removeItem("surginerve_role");
    setToken(null);
    setRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
