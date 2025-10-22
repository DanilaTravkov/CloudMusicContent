import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Music } from 'lucide-react';
import { mockArtists, type Song } from '../../lib/mockData';

interface MusicPlayerProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function MusicPlayer({ song, isPlaying, onPlayPause, onNext, onPrevious }: MusicPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + 0.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, onNext]);

  // Reset progress when song changes
  useEffect(() => {
    setProgress(0);
  }, [song.id]);

  const getArtistNames = (artistIds: string[]) => {
    return artistIds
      .map(id => mockArtists.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const formatTime = (percentage: number) => {
    // Convert song duration to seconds (assuming format like "3:45")
    const [minutes, seconds] = song.duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    const currentSeconds = Math.floor((totalSeconds * percentage) / 100);
    const mins = Math.floor(currentSeconds / 60);
    const secs = currentSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-3">
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={[progress]}
            onValueChange={(value) => setProgress(value[0])}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-purple-300 mt-1">
            <span>{formatTime(progress)}</span>
            <span>{song.duration}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="size-14 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden flex-shrink-0">
              {song.imageUrl ? (
                <img src={song.imageUrl} alt={song.title} className="size-full object-cover" />
              ) : (
                <Music className="size-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white truncate">{song.title}</h4>
              <p className="text-purple-300 text-sm truncate">{getArtistNames(song.artistIds)}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsLiked(!isLiked)}
              className={`hidden md:flex ${isLiked ? 'text-pink-400' : 'text-white'} hover:text-pink-400 hover:bg-white/10`}
            >
              <Heart className={`size-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onPrevious}
              className="text-white hover:bg-white/10 hidden md:flex"
            >
              <SkipBack className="size-5" />
            </Button>
            <Button
              size="sm"
              onClick={onPlayPause}
              className="bg-white text-purple-600 hover:bg-purple-50 size-12 rounded-full"
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current ml-0.5" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onNext}
              className="text-white hover:bg-white/10 hidden md:flex"
            >
              <SkipForward className="size-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-white/10"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="size-5" />
              ) : (
                <Volume2 className="size-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={(value) => {
                setVolume(value[0]);
                setIsMuted(false);
              }}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
