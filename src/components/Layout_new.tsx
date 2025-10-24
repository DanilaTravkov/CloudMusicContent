import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Music2, LogOut, Search, Home, Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export function Layout({ children, showNavigation = false }: LayoutProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
                <Music2 className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl">Stream</h1>
                <p className="text-purple-300 text-sm">Your music, unlimited</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-purple-300 text-sm">Welcome, {user?.name || user?.username}</span>
                  {user?.role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-white hover:text-red-400 hover:bg-white/10"
                  >
                    <LogOut className="size-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation for authenticated users */}
      {isAuthenticated && showNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-lg border-t border-white/10 pb-safe">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-around py-3">
              <Link to="/home" className="flex flex-col items-center gap-1 text-white/60 hover:text-white">
                <Home className="size-5" />
                <span className="text-xs">Home</span>
              </Link>
              <Link to="/search" className="flex flex-col items-center gap-1 text-white/60 hover:text-white">
                <Search className="size-5" />
                <span className="text-xs">Search</span>
              </Link>
              <Link to="/library" className="flex flex-col items-center gap-1 text-white/60 hover:text-white">
                <User className="size-5" />
                <span className="text-xs">Library</span>
              </Link>
              <Link to="/notifications" className="flex flex-col items-center gap-1 text-white/60 hover:text-white">
                <Bell className="size-5" />
                <span className="text-xs">Notifications</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
