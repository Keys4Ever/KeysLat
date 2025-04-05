import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType, FormData } from '../shared/interfaces/Auth';
import { DecodedToken } from '../shared/interfaces/Token';
import { User, UserData } from '../shared/interfaces/User';
import httpClient, { checkTokenExpiration } from '../shared/utils/httpClient';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from '../shared/utils/getCookie';
import { useNavigate } from 'react-router-dom';
import { ApiResponse } from '../shared/interfaces/Response';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Response extends ApiResponse{
  payload:{
    token: string;
    user: UserData;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<User>({ authenticated: false, data: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    initializeAuth();
  }, []);
  const initializeAuth = async () => {
    try {
      let token: string | null | undefined = localStorage.getItem("auth_token");
  
  
      if (!token) {
        token = getCookie("auth_token");
  
        if (token !== null && token !== undefined) {
          localStorage.setItem("auth_token", token);
        }
      }
  
  
      if (token && !checkTokenExpiration(token)) {
        logout();
        return;
      }
  
      if (token) {
        const response = await httpClient.get<Response>("/auth/profile");
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('Decoded token: ', decoded);
        setAuth({
          authenticated: true,
          data: {
            user_id: response.data.payload.user.user_id,
            email: response.data.payload.user.email,
            username: response.data.payload.user.username,
            profile_picture: response.data.payload.user.profile_picture,
          },
        });
      }
    } catch (error) {
      console.error("Error en initializeAuth:", error);
      setAuth({ authenticated: false, data: null });
    } finally {
      setLoading(false);
    }
  };
  

  const login = async (formData: FormData) => {
    try {
      setLoading(true);
  
      const response = await httpClient.post<{
        payload: {
          message: string;
          token: string;
          user: UserData;
          status?: number;
          details?: string;
        };
      }>('/auth/login', formData, { withCredentials: true });
  
      const token = response.data.payload.token;
  
      if (token) {
        localStorage.setItem('auth_token', token);
  
        setAuth({
          authenticated: true,
          data: {
            user_id: response.data.payload.user.user_id,
            email: response.data.payload.user.email,
            username: response.data.payload.user.username,
            profile_picture: response.data.payload.user.profile_picture,
          },
        });
  
        navigate('/dashboard');
        return { success: true, details: response.data.payload.details, status: response.data.payload.status };
      }
  
      throw new Error('No se encontró el token.');
    } catch (error: any) {
      const defaultMessage = 'Error de autenticación';
      const responsePayload = error?.response?.data?.payload;
  
      const errorMessage =
        responsePayload?.description || error?.response?.data?.message || defaultMessage;
  
      const errorDetails = responsePayload?.details || null;
      const statusCode = responsePayload?.status || error?.response?.status || null;
  
      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
        status: statusCode,
      };
    } finally {
      setLoading(false);
    }
  };
  

  const logout = async () => {
    localStorage.removeItem('auth_token');
    setAuth({ authenticated: false, data: null });
    setLoading(false);
  };

  const register = async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await httpClient.post<{ payload: { message: string; token: string; user: UserData } }>(
        "/auth/register",
        formData
      );
  
      const { token, user } = response.data.payload;
      if (token !== null && token !== undefined) {
        localStorage.setItem("auth_token", token);
        const decoded = jwtDecode<DecodedToken>(token);
  
        setAuth({
          authenticated: true,
          data: {
            user_id: decoded.user_id,
            email: user.email,
            username: user.username,
            profile_picture: user.profile_picture,
          },
        });
        navigate('/dashboard');
        return { success: true, message: response.data.payload.message };
      }
  
      return { success: true, message: response.data.payload.message };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.payload?.message || "Error de registro",
      };
    } finally {
      setLoading(false);
    }
  };
  

  const refreshAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token && checkTokenExpiration(token)) {
        const response = await httpClient.get<{ payload: { token: string, user: UserData } }>(
          '/auth/refresh'
        );
        const decoded = jwtDecode<DecodedToken>(token);

        setAuth({
          authenticated: true,
          data: {
            user_id: decoded.user_id,
            email: response.data.payload.user.email,
            username: response.data.payload.user.username,
            profile_picture: response.data.payload.user.profile_picture,
          },
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
    initializeAuth,
    isAuthenticated: auth.authenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
