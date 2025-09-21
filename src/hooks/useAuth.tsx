import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Récupérer le token depuis localStorage ou sessionStorage
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      // Récupérer les infos utilisateur
      const userData =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (!token) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Vérifier le token avec l'API
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (data.valid && data.user) {
        setAuthState({
          user: data.user,
          token: token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else if (userData) {
        // Fallback: utiliser les données stockées si l'API échoue
        try {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            token: token,
            isLoading: false,
            isAuthenticated: true,
          });
        } catch {
          // Si les données utilisateur sont corrompues
          logout();
        }
      } else {
        // Token invalide et pas de données utilisateur
        logout();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const login = (token: string, user: User, rememberMe: boolean = false) => {
    // Nettoyer d'abord les anciens tokens
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    // Stocker selon le choix rememberMe
    if (rememberMe) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    // Mettre à jour l'état
    setAuthState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });

    // Rediriger
    router.push("/admin/dashboard");
  };

  const logout = () => {
    // Nettoyer le storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    // Mettre à jour l'état
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });

    // Rediriger vers la page de login
    router.push("/admin");
  };

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
};