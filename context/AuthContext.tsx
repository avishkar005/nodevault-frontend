"use client";

import React,
{
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { User } from "@/types";
import { toast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API = "http://localhost:8080/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }

    setIsLoading(false);

  }, []);

  const login = useCallback(async (email: string, password: string) => {

    try {

      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        toast({ title: "Login Failed", variant: "destructive" });
        return false;
      }

      const data = await res.json();

      const u: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        createdAt: data.user.createdAt
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(u));

      setToken(data.token);
      setUser(u);

      toast({ title: "Login success" });

      return true;

    } catch (e) {

      toast({ title: "Login Failed", variant: "destructive" });
      return false;

    }

  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {

    try {

      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const msg = await res.text();
        toast({
          title: msg || "Registration failed",
          variant: "destructive"
        });
        return false;
      }

      const data = await res.json();

      const u: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        createdAt: data.user.createdAt
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(u));

      setToken(data.token);
      setUser(u);

      toast({ title: "Registration success" });

      return true;

    } catch (e) {

      toast({ title: "Registration failed", variant: "destructive" });
      return false;

    }

  }, []);

  const loginWithGoogle = useCallback(async () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}