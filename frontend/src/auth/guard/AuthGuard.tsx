import { ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../../shared/utils/httpClient';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isValid = checkTokenExpiration();
    
    if (!isValid && !auth.authenticated && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate]);

  return auth.authenticated ? children : null;
};