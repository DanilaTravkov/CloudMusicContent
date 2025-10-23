import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Music, AlertCircle, Loader, Users } from 'lucide-react';
import { getSongs, getAlbums, getArtists } from '../../lib/api';
import type { Song, Album, Artist } from '../../types/music';
import { Layout } from '../Layout';
import { toast } from 'sonner';

interface HomePageProps {
  onPlaySong?: (song: Song) => void;
}

export function HomePage({ onPlaySong }: HomePageProps) {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [songsData, albumsData, artistsData] = await Promise.all([
          getSongs(5),
          getAlbums(5),
          getArtists(5),
        ]);

        setSongs(songsData.songs);
        setAlbums(albumsData.albums);
        setArtists(artistsData.artists);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        console.error('Error loading data:', {
          error: err,
          errorMessage,
          apiUrl: import.meta.env.VITE_API_GATEWAY,
        });
        toast.error(`Failed to load music data: ${errorMessage}`);
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

  const content = (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 p-8 md:p-12">
        <div className="relative z-10">
          <h2 className="text-white text-3xl md:text-4xl mb-4">Welcome to StreamHub</h2>
          <p className="text-purple-100 text-lg mb-6 max-w-2xl">
            Discover new music, create playlists, and enjoy unlimited streaming of your favorite artists.
          </p>
          <Button className="bg-white text-purple-600 hover:bg-purple-50">
            Explore Now
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="size-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-white font-medium">Failed to load music</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="size-8 text-purple-400 animate-spin" />
          <p className="text-white ml-3">Loading music...</p>
        </div>
      )}

      {/* Recently Added */}
      {!isLoading && songs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-2xl">Recently Added</h3>
            <Button 
              variant="ghost" 
              className="text-purple-300 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/songs')}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {songs.map(song => (
              <Card
                key={song.song_id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <CardContent className="p-3">
                  <div className="flex flex-col gap-3">
                    <div className="size-16 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                      <Music className="size-8 text-white" />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-white truncate text-sm font-medium">{song.title}</h4>
                        <p className="text-purple-300 text-xs truncate">{song.artist_name || song.artist}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 rounded-full size-8 flex-shrink-0"
                        onClick={() => handlePlaySong(song)}
                      >
                        <Play className="size-3 fill-current" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Featured Albums */}
      {!isLoading && albums.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-2xl">Featured Albums</h3>
            <Button 
              variant="ghost" 
              className="text-purple-300 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/albums')}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map(album => (
              <Card
                key={album.album_id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {album.cover_image_url ? (
                        <img src={album.cover_image_url} alt={album.title} className="size-full object-cover" />
                      ) : (
                        <Music className="size-10 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white truncate mb-1">{album.title}</h4>
                      <p className="text-purple-300 text-sm truncate">{album.artist}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                          {album.genre}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 rounded-full size-10"
                      onClick={() => {
                        if (songs.length > 0 && onPlaySong) {
                          const song = songs[0];
                          handlePlaySong(song);
                        }
                      }}
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

      {/* Featured Artists */}
      {!isLoading && artists.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-2xl">Featured Artists</h3>
            <Button 
              variant="ghost" 
              className="text-purple-300 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/artists')}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {artists.map(artist => (
              <Card
                key={artist.pk}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <CardContent className="p-3">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-16 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                      {artist.image_url ? (
                        <img src={artist.image_url} alt={artist.name} className="size-full object-cover" />
                      ) : (
                        <Users className="size-8 text-white" />
                      )}
                    </div>
                    <div className="text-center min-w-0">
                      <h4 className="text-white truncate text-sm font-medium">{artist.name}</h4>
                      {artist.total_albums && (
                        <p className="text-purple-400 text-xs">{artist.total_albums} albums</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* No Data */}
      {!isLoading && songs.length === 0 && albums.length === 0 && artists.length === 0 && !error && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No music available</h3>
          <p className="text-purple-300">Check back soon for new content</p>
        </div>
      )}
    </div>
  );

  // If onPlaySong is provided, return content directly (used within UserDashboard)
  if (onPlaySong) {
    return content;
  }

  // Otherwise, wrap with Layout for standalone usage
  return (
    <Layout showNavigation={true}>
      {content}
    </Layout>
  );
}
