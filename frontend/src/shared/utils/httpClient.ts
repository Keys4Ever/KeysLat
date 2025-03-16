import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../interfaces/Token';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if(!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};

export const checkTokenExpiration = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const { exp } = decodeToken(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

export default httpClient;