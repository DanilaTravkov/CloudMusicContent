import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Music2, LogOut, Search, Home, Bell, Heart } from 'lucide-react';
import { HomePage } from './user/HomePage';
import { SearchPage } from './user/SearchPage';
import { LibraryPage } from './user/LibraryPage';
import { NotificationsPage } from './user/NotificationsPage';
import { MusicPlayer } from './user/MusicPlayer';
import { type Song } from '../types/music';
import { useAuth } from '../contexts/AuthContext';

type UserView = 'home' | 'search' | 'library' | 'notifications';

export function UserDashboard() {
  const [currentView, setCurrentView] = useState<UserView>('home');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      <header className="bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-purple-500 to-indigo-600 p-2 rounded-lg">
                <Music2 className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl">Stream</h1>
                <p className="text-purple-300 text-sm">Your music, unlimited</p>
              </div>
            </div>            <Button
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

      <div className="flex-1 container mx-auto px-4 py-6 pb-32">
        {currentView === 'home' && <HomePage onPlaySong={handlePlaySong} />}
        {currentView === 'search' && <SearchPage onPlaySong={handlePlaySong} />}
        {currentView === 'library' && <LibraryPage onPlaySong={handlePlaySong} />}
        {currentView === 'notifications' && <NotificationsPage />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-lg border-t border-white/10 pb-safe">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'text-purple-400 bg-purple-500/20'
                  : 'text-purple-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="size-5" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => setCurrentView('search')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'search'
                  ? 'text-purple-400 bg-purple-500/20'
                  : 'text-purple-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="size-5" />
              <span className="text-xs">Search</span>
            </button>

            <button
              onClick={() => setCurrentView('library')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'library'
                  ? 'text-purple-400 bg-purple-500/20'
                  : 'text-purple-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className="size-5" />
              <span className="text-xs">Library</span>
            </button>

            <button
              onClick={() => setCurrentView('notifications')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative ${
                currentView === 'notifications'
                  ? 'text-purple-400 bg-purple-500/20'
                  : 'text-purple-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bell className="size-5" />
              <span className="text-xs">Notifications</span>
              <span className="absolute top-1 right-2 size-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </nav>

      {currentSong && (        <MusicPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onNext={() => {
            // For now, just stop playing since we don't have a proper playlist
            setIsPlaying(false);
          }}
          onPrevious={() => {
            // For now, just stop playing since we don't have a proper playlist
            setIsPlaying(false);
          }}
        />
      )}
    </div>
  );
}
