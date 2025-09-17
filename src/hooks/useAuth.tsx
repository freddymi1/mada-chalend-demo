import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
    isAuthenticated: false
  });

  const router = useRouter()

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Récupérer le token depuis localStorage ou sessionStorage
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (data.valid) {
        setAuthState({
          user: data.user,
          token: token,
          isLoading: false,
          isAuthenticated: true
        });
      } else {
        // Token invalide, nettoyer le storage
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = (token: string, user: User, rememberMe: boolean = false) => {
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    setAuthState({
      user,
      token,
      isLoading: false,
      isAuthenticated: true
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    localStorage.clear()
    
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false
    });
    router.push('/admin')
  };

  return {
    ...authState,
    login,
    logout,
    checkAuth
  };
};