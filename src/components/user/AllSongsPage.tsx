import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Search, Music, Play, AlertCircle, Loader } from 'lucide-react';
import { getSongs } from '../../lib/api';
import type { Song } from '../../types/music';
import { Layout } from '../Layout';
import { toast } from 'sonner';

interface AllSongsPageProps {
  onPlaySong?: (song: Song) => void;
}

export function AllSongsPage({ onPlaySong }: AllSongsPageProps) {
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const songsData = await getSongs(100);
        setAllSongs(songsData.songs);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        toast.error('Failed to load songs');
        console.error('Error loading songs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePlaySong = (song: Song) => {
    if (onPlaySong) {
      onPlaySong(song);
    } else {
      toast.info(`Playing: ${song.title}`);
      console.log('Playing song:', song.title);
    }
  };

  const filteredSongs = allSongs.filter(song => {
    const matchesSearch = !searchQuery || 
      (song.title && song.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ((song.artist_name || song.artist) && (song.artist_name || song.artist)!.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (song.genre && song.genre.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white text-2xl mb-4">All Songs</h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-purple-400" />
          <Input
            type="text"
            placeholder="Search songs by title, artist, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="size-5 text-red-400 shrink-0" />
          <div>
            <p className="text-white font-medium">Failed to load songs</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="size-8 text-purple-400 animate-spin" />
          <p className="text-white ml-3">Loading songs...</p>
        </div>
      )}

      {/* Songs Results */}
      {!isLoading && filteredSongs.length > 0 && (
        <section>
          <div className="space-y-2">
            {filteredSongs.map((song, index) => (
              <Card
                key={song.song_id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => handlePlaySong(song)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-4">
                    <span className="text-purple-400 w-6 text-center">{index + 1}</span>
                    <div className="size-12 rounded bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                      <Music className="size-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white truncate">{song.title}</h4>
                      <p className="text-purple-300 text-sm truncate">{song.artist_name || song.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-300 text-sm">
                        {(() => {
                          const duration = typeof song.duration === 'string' 
                            ? parseInt(song.duration, 10) 
                            : song.duration;
                          return `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;
                        })()}
                      </p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                          {song.genre}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 rounded-full size-10"
                    >
                      <Play className="size-4 fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {!isLoading && filteredSongs.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No songs found</h3>
          <p className="text-purple-300">Try adjusting your search query</p>
        </div>
      )}

      {/* No Data Loaded */}
      {!isLoading && allSongs.length === 0 && !error && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No songs available</h3>
          <p className="text-purple-300">Check back soon for new content</p>
        </div>
      )}
    </div>
  );

  return (
    <Layout showNavigation={true}>
      {content}
    </Layout>
  );
}
