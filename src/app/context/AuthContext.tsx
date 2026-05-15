import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { UserRole, getCurrentUserRole } from "../config/roles";

// ── Types ──────────────────────────────────────────────────────────────────
export interface AuthUser {
  fullName: string;
  email: string;
  role: string;          // raw string stored in sessionStorage
  userRole: UserRole;    // typed enum value
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => { success: boolean; error?: string };
  logout: () => void;
}

// ── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

function buildUser(): AuthUser | null {
  if (sessionStorage.getItem("isLoggedIn") !== "true") return null;
  return {
    fullName: sessionStorage.getItem("userFullName") || "User",
    email:    sessionStorage.getItem("userEmail")    || "",
    role:     sessionStorage.getItem("userRole")     || "employee",
    userRole: getCurrentUserRole() ?? UserRole.EMPLOYEE,
  };
}

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(buildUser);

  const login = useCallback((email: string, password: string, remember = false) => {
    const users: { fullName: string; email: string; password: string; role: string }[] =
      JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Invalid email or password." };

    // Persist to session
    sessionStorage.setItem("isLoggedIn",    "true");
    sessionStorage.setItem("userFullName",  found.fullName);
    sessionStorage.setItem("userEmail",     found.email);
    sessionStorage.setItem("userRole",      found.role);

    // Optional localStorage remember
    if (remember) {
      localStorage.setItem("rememberedEmail", found.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    setUser(buildUser());
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
