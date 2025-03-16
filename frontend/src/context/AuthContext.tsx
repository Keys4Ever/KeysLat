// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, FormData } from '../shared/interfaces/Auth';
import { DecodedToken } from '../shared/interfaces/Token';
import { User, UserData } from '../shared/interfaces/User';
import { jwtDecode } from 'jwt-decode';
import httpClient, { checkTokenExpiration, decodeToken, setAuthToken } from '../shared/utils/httpClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<User>({ authenticated: false, data: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokenValid = checkTokenExpiration();
        
        if (tokenValid) {
          const token = localStorage.getItem('authToken');
          if (token) {
            const decoded = decodeToken(token);
            const response = await httpClient.get<UserData>(`/users/${decoded.user_id}`);
            
            setAuth({
              authenticated: true,
              data: {
                user_id: decoded.user_id,
                email: response.data.email,
                username: response.data.username,
                profile_picture: response.data.profile_picture
              }
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await httpClient.post<{ token: string; user: UserData }>('/auth/login', formData);

      if (response.data.token) {
        setAuthToken(response.data.token);
        const decoded = jwtDecode<DecodedToken>(response.data.token);

        setAuth({
          authenticated: true,
          data: {
            user_id: decoded.user_id,
            email: response.data.user.email,
            username: response.data.user.username,
            profile_picture: response.data.user.profile_picture
          }
        });
      }
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error de autenticación'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await httpClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('authToken');
      setAuth({ authenticated: false, data: null });
      setLoading(false);
    }
  };

  const register = async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await httpClient.post<{ token: string; user: UserData }>('/auth/register', formData);

      if (response.data.token) {
        setAuthToken(response.data.token);
        const decoded = jwtDecode<DecodedToken>(response.data.token);

        setAuth({
          authenticated: true,
          data: {
            user_id: decoded.user_id,
            email: response.data.user.email,
            username: response.data.user.username,
            profile_picture: response.data.user.profile_picture
          }
        });
      }
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error de registro'
      };
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token && checkTokenExpiration()) {
        const response = await httpClient.get<UserData>('/auth/refresh');
        const decoded = jwtDecode<DecodedToken>(token);

        setAuth({
          authenticated: true,
          data: {
            user_id: decoded.user_id,
            email: response.data.email,
            username: response.data.username,
            profile_picture: response.data.profile_picture
          }
        });
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      logout();
    }
  };

  const value = {
    auth,
    loading,
    login,
    logout,
    register,
    refreshAuth,
    isAuthenticated: auth.authenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};