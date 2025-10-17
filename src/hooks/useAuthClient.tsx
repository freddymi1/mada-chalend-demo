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

interface SignupData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export const useAuthClient = () => {
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
        localStorage.getItem("authTokenClient") ||
        sessionStorage.getItem("authTokenClient");

      // Récupérer les infos utilisateur
      const userData =
        localStorage.getItem("userClient") ||
        sessionStorage.getItem("userClient");

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
    localStorage.removeItem("authTokenClient");
    localStorage.removeItem("userClient");
    sessionStorage.removeItem("authTokenClient");
    sessionStorage.removeItem("userClient");

    // Stocker selon le choix rememberMe
    if (rememberMe) {
      localStorage.setItem("authTokenClient", token);
      localStorage.setItem("userClient", JSON.stringify(user));
    } else {
      sessionStorage.setItem("authTokenClient", token);
      sessionStorage.setItem("userClient", JSON.stringify(user));
    }

    // Mettre à jour l'état
    setAuthState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true,
    });

    // Rediriger
    router.push("/avis");
  };

  const signup = async (signupData: SignupData, rememberMe: boolean = false) => {
    try {
      // Appeler l'API de signup
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      // Si l'inscription réussit, connecter automatiquement l'utilisateur
      if (data.token && data.user) {
        login(data.token, data.user, rememberMe);
      }

      return { success: true, data };
    } catch (error: any) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = () => {
    // Nettoyer le storage
    localStorage.removeItem("authTokenClient");
    localStorage.removeItem("userClient");
    sessionStorage.removeItem("authTokenClient");
    sessionStorage.removeItem("userClient");

    // Mettre à jour l'état
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });

    // Rediriger vers la page de login
    router.push("/");
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    checkAuth,
  };
};