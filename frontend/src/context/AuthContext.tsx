import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthContextType } from "../shared/interfaces/Auth";
import { User } from "../shared/interfaces/User";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const config = {
  useSimulation: true,
  apiBaseUrl: "/api",
  simulationDelay: 800,
};

const mockUser = {
  user_id: "usr_123456",
  username: "John Doe",
  email: "john.doe@example.com",
  profile_picture: "https://i.imgur.com/wquxgOM.jpeg"
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<User>({ authenticated: false, data: null });
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  const fetchAuthStatus = async () => {
    try {
      let response;
      
      if (config.useSimulation) {
        await new Promise(resolve => setTimeout(resolve, config.simulationDelay));
        
        const simulateSuccess = Math.random() > 0.2;
        
        if (simulateSuccess) {
          response = {
            authenticated: true,
            user: mockUser
          };
        } else {
          response = {
            authenticated: false,
            user: null
          };
        }
      } else {
        const apiResponse = await fetch(`${config.apiBaseUrl}/auth/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!apiResponse.ok) {
          throw new Error(`API error: ${apiResponse.status}`);
        }
        
        response = await apiResponse.json();
      }

      if (response.authenticated) {
        setAuth({ authenticated: true, data: response.user });
        setAuthenticated(true);
      } else {
        setAuth({ authenticated: false, data: null });
        setAuthenticated(false);
      }
    } catch (err) {
      console.error("Authentication status error:", err);
      setAuth({ authenticated: false, data: null });
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials?: { email: string; password: string }) => {
    try {
      setLoading(true);
      
      if (config.useSimulation) {
        await new Promise(resolve => setTimeout(resolve, config.simulationDelay));
        
        if (Math.random() > 0.1) {
          setAuth({
            authenticated: true,
            data: mockUser
          });
          setAuthenticated(true);
          return { success: true };
        } else {
          throw new Error("Invalid credentials");
        }
      } else {
        const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Login failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.authenticated) {
          setAuth({ authenticated: true, data: data.user });
          setAuthenticated(true);
          return { success: true };
        } else {
          throw new Error(data.message || "Login failed");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : "Unknown error" 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      if (config.useSimulation) {
        await new Promise(resolve => setTimeout(resolve, config.simulationDelay));
        
        setAuth({ authenticated: false, data: null });
        setAuthenticated(false);
        return { success: true };
      } else {
        const response = await fetch(`${config.apiBaseUrl}/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Logout failed: ${response.status}`);
        }
        
        setAuth({ authenticated: false, data: null });
        setAuthenticated(false);
        return { success: true };
      }
    } catch (err) {
      console.error("Logout error:", err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : "Unknown error" 
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  const contextValue: AuthContextType = {
    auth,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshAuth: fetchAuthStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;