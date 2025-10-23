import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Music, Play, AlertCircle, Loader, ArrowLeft, Users } from 'lucide-react';
import { getArtistById, getSongsByArtist, getAlbumsByArtist } from '../../lib/api';
import type { Artist, Song, Album } from '../../types/music';
import { Layout } from '../Layout';
import { toast } from 'sonner';

interface ArtistDetailPageProps {
  onPlaySong?: (song: Song) => void;
}

export function ArtistDetailPage({ onPlaySong }: ArtistDetailPageProps) {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) {
      setError('Artist ID is missing');
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [artistData, songsData, albumsData] = await Promise.all([
          getArtistById(artistId),
          getSongsByArtist(artistId, 100),
          getAlbumsByArtist(artistId, 100),
        ]);

        setArtist(artistData.artist);
        setSongs(songsData.songs);
        setAlbums(albumsData.albums);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        toast.error('Failed to load artist data');
        console.error('Error loading artist data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [artistId]);

  const handlePlaySong = (song: Song) => {
    if (onPlaySong) {
      onPlaySong(song);
    } else {
      toast.info(`Playing: ${song.title}`);
      console.log('Playing song:', song.title);
    }
  };

  const content = (
    <div className="space-y-8 pb-20">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="text-purple-300 hover:text-white hover:bg-white/10 -ml-4"
        onClick={() => navigate('/artists')}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Artists
      </Button>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="size-5 text-red-400 shrink-0" />
          <div>
            <p className="text-white font-medium">Failed to load artist</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="size-8 text-purple-400 animate-spin" />
          <p className="text-white ml-3">Loading artist...</p>
        </div>
      )}

      {/* Artist Header */}
      {!isLoading && artist && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-6">
            <div className="size-32 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
              {artist.image_url ? (
                <img src={artist.image_url} alt={artist.name} className="size-full object-cover" />
              ) : (
                <Users className="size-16 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-white text-4xl mb-2">{artist.name}</h1>
              {artist.bio && (
                <p className="text-purple-300 text-base mb-4 max-w-xl">{artist.bio}</p>
              )}
              <div className="flex gap-6 text-sm text-purple-400">
                {artist.total_albums && <span>{artist.total_albums} Albums</span>}
                {artist.total_songs && <span>{artist.total_songs} Songs</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Albums Section */}
      {!isLoading && albums.length > 0 && (
        <section>
          <h2 className="text-white text-2xl mb-4">Albums</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {albums.map(album => (
              <Card
                key={album.album_id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="size-full rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden aspect-square">
                      {album.cover_image_url ? (
                        <img src={album.cover_image_url} alt={album.title} className="size-full object-cover" />
                      ) : (
                        <Music className="size-12 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-white truncate mb-1 font-semibold">{album.title}</h4>
                      <p className="text-purple-400 text-xs mt-1">{album.total_songs} tracks</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 rounded-full w-full"
                    >
                      <Play className="size-4 fill-current mr-2" />
                      Play Album
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Songs Section */}
      {!isLoading && songs.length > 0 && (
        <section>
          <h2 className="text-white text-2xl mb-4">Songs</h2>
          <div className="space-y-2">
            {songs.map((song, index) => (
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
                      <p className="text-purple-300 text-sm truncate">{song.album}</p>
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
                      {song.genre && (
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                            {song.genre}
                          </Badge>
                        </div>
                      )}
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

      {/* No Data */}
      {!isLoading && albums.length === 0 && songs.length === 0 && !error && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No content available</h3>
          <p className="text-purple-300">This artist has no songs or albums yet</p>
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
