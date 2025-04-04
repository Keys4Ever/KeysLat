import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../interfaces/Token';
import { getCookie } from './getCookie';

const baseURL = import.meta.env.VITE_BACKEND_URL;
console.log('BASE URL', baseURL);

const httpClient = axios.create({
  baseURL,
  withCredentials: true, // Habilitar credenciales
  headers: {
    'Content-Type': 'application/json',
  }
});
httpClient.interceptors.request.use((config) => {
  let token = getCookie('auth_token'); 
  if(!token) token = localStorage.getItem('auth_token');
  
  if (token) {
    if(!config.headers) config.headers = {};
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 && 
      !originalRequest.url.includes('/auth/login') &&
      !window.location.pathname.includes('/login') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};

export const checkTokenExpiration = (token?: string) => {
  if (!token) token = localStorage.getItem('auth_token') || '';

  try {
    return true;
  } catch {
    return false;
  }
};

export default httpClient;