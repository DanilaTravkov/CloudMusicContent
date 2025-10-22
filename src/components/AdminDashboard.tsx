import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Music2, LogOut, Users, Disc3, Music } from 'lucide-react';
import { ArtistsManagement } from './admin/ArtistsManagement';
import { SongsManagement } from './admin/SongManagement';
import { AlbumsManagement } from './admin/AlbumsManagemen';
import { useAuth } from '../contexts/AuthContext';

type AdminView = 'artists' | 'songs' | 'albums';

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('songs');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <header className="bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
                <Music2 className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl">StreamHub Admin</h1>
                <p className="text-purple-300 text-sm">Content Management System</p>
              </div>
            </div>            
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white hover:text-red-400 hover:bg-white/10"
              >
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          <Button
            variant={currentView === 'artists' ? 'default' : 'outline'}
            onClick={() => setCurrentView('artists')}
            className={currentView === 'artists' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
              : 'border-white/20 text-white hover:bg-white/10'}
          >
            <Users className="size-4 mr-2" />
            Artists
          </Button>
          <Button
            variant={currentView === 'albums' ? 'default' : 'outline'}
            onClick={() => setCurrentView('albums')}
            className={currentView === 'albums' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
              : 'border-white/20 text-white hover:bg-white/10'}
          >
            <Disc3 className="size-4 mr-2" />
            Albums
          </Button>
          <Button
            variant={currentView === 'songs' ? 'default' : 'outline'}
            onClick={() => setCurrentView('songs')}
            className={currentView === 'songs' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
              : 'border-white/20 text-white hover:bg-white/10'}
          >
            <Music className="size-4 mr-2" />
            Songs
          </Button>
        </div>

        {currentView === 'artists' && <ArtistsManagement />}
        {currentView === 'albums' && <AlbumsManagement />}
        {currentView === 'songs' && <SongsManagement />}
      </div>
    </div>
  );
}
