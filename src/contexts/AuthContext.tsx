import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const login = async (username: string, password: string) => {
    // Mock login logic - in real app this would be an API call
    let role: UserRole = 'unauthorized';
    
    if (username === 'admin' && password) {
      role = 'admin';
    } else if (username && password) {
      role = 'authorized';
    }

    if (role !== 'unauthorized') {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        role,
        name: role === 'admin' ? 'Admin User' : 'Regular User'
      };
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
