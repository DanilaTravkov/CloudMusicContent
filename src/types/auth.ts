export type UserRole = 'unauthorized' | 'authorized' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name?: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}
