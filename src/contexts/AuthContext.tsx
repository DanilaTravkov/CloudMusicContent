import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types/auth';
import { login as loginAPI, LoginResponse } from '../lib/authApi';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const ACCESS_TOKEN_KEY = 'music_app_access_token';
const ID_TOKEN_KEY = 'music_app_id_token';
const REFRESH_TOKEN_KEY = 'music_app_refresh_token';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Decode JWT token and extract user info
 */
function decodeToken(token: string): Record<string, any> {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return {};
  }
}

/**
 * Extract user role from token
 */
function extractRoleFromToken(idToken: string): UserRole {
  const decoded = decodeToken(idToken);
  const groups = decoded['cognito:groups'] || [];
  
  if (groups.includes('admin')) {
    return 'admin';
  }
  
  return 'authorized';
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedIdToken = localStorage.getItem(ID_TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (storedIdToken && storedAccessToken) {
      try {
        const decoded = decodeToken(storedIdToken);
        const username = decoded['cognito:username'] || decoded.email;
        const role = extractRoleFromToken(storedIdToken);

        const userData: User = {
          id: decoded.sub,
          username,
          role,
          name: decoded.name || username,
          email: decoded.email,
        };

        setUser(userData);
        setAccessToken(storedAccessToken);
        setIdToken(storedIdToken);
        setRefreshToken(storedRefreshToken);
      } catch (error) {
        console.error('Failed to restore user from localStorage:', error);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(ID_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('[AuthContext] Starting login for username:', username);
      const response: LoginResponse = await loginAPI({ username, password });
      console.log('[AuthContext] Login API returned response:', { keys: Object.keys(response) });

      // Store tokens
      console.log('[AuthContext] Storing tokens in localStorage');
      localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
      localStorage.setItem(ID_TOKEN_KEY, response.id_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);

      // Set tokens in state
      setAccessToken(response.access_token);
      setIdToken(response.id_token);
      setRefreshToken(response.refresh_token);

      // Decode and set user
      const decoded = decodeToken(response.id_token);
      const role = extractRoleFromToken(response.id_token);
      console.log('[AuthContext] Decoded user:', { sub: decoded.sub, username: decoded['cognito:username'], role });

      const userData: User = {
        id: decoded.sub,
        username: decoded['cognito:username'] || decoded.email,
        role,
        name: decoded.name || username,
        email: decoded.email,
      };

      setUser(userData);
      console.log('[AuthContext] User set successfully');
    } catch (error) {
      console.error('[AuthContext] Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setIdToken(null);
    setRefreshToken(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ID_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const isAuthenticated = user !== null && accessToken !== null;

  const hasRole = (role: UserRole): boolean => {
    if (!user) return role === 'unauthorized';
    return user.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return roles.includes('unauthorized');
    return roles.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    accessToken: accessToken || undefined,
    idToken: idToken || undefined,
    refreshToken: refreshToken || undefined,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
