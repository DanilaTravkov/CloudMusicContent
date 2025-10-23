import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Music, ArrowLeft, AlertCircle, Loader, Users } from 'lucide-react';
import { getAlbumById, getAlbumSongs } from '../../lib/api';
import type { Album, Song } from '../../types/music';
import { Layout } from '../Layout';
import { toast } from 'sonner';

export function AlbumDetailPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!albumId) {
        setError('Album ID not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [albumData, songsData] = await Promise.all([
          getAlbumById(albumId),
          getAlbumSongs(albumId, 100),
        ]);

        setAlbum(albumData.album);
        setSongs(songsData.songs);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load album';
        setError(errorMessage);
        console.error('Error loading album:', err);
        toast.error(`Failed to load album: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [albumId]);

  const handlePlaySong = (song: Song) => {
    toast.info(`Playing: ${song.title}`);
    console.log('Playing song:', song.title);
  };

  // Get unique artists from songs in album
  const uniqueArtists = Array.from(
    new Map(
      songs
        .filter(song => song.artist_name || song.artist)
        .map(song => [
          (song.artist_name || song.artist)?.toLowerCase(),
          song.artist_name || song.artist || 'Unknown Artist',
        ])
    ).values()
  );

  const content = (
    <div className="space-y-8 pb-20">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="text-purple-300 hover:text-white hover:bg-white/10"
        onClick={() => navigate('/albums')}
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Albums
      </Button>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="size-5 text-red-400 shrink-0" />
          <div>
            <p className="text-white font-medium">Failed to load album</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="size-8 text-purple-400 animate-spin" />
          <p className="text-white ml-3">Loading album...</p>
        </div>
      )}

      {/* Album Header */}
      {!isLoading && album && (
        <section className="bg-linear-to-b from-white/10 to-white/5 rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Album Cover */}
            <div className="size-40 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
              {album.cover_image_url ? (
                <img src={album.cover_image_url} alt={album.title} className="size-full object-cover" />
              ) : (
                <Music className="size-20 text-white" />
              )}
            </div>

            {/* Album Info */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <Badge className="bg-purple-600 text-white mb-2">ALBUM</Badge>
              <h1 className="text-white text-4xl font-bold mb-2">{album.title}</h1>
              <p className="text-purple-300 text-lg mb-4">{album.artist}</p>

              {/* Album Stats */}
              <div className="flex flex-wrap gap-4 mb-4 justify-center md:justify-start">
                {album.genre && (
                  <div>
                    <p className="text-purple-400 text-sm">Genre</p>
                    <p className="text-white">{album.genre}</p>
                  </div>
                )}
                {album.release_date && (
                  <div>
                    <p className="text-purple-400 text-sm">Released</p>
                    <p className="text-white">{new Date(album.release_date).getFullYear()}</p>
                  </div>
                )}
                <div>
                  <p className="text-purple-400 text-sm">Songs</p>
                  <p className="text-white">{songs.length}</p>
                </div>
              </div>

              {/* Play Button */}
              {songs.length > 0 && (
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => handlePlaySong(songs[0])}
                >
                  <Play className="size-4 mr-2 fill-current" />
                  Play Album
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Artists Section */}
      {!isLoading && uniqueArtists.length > 0 && (
        <section>
          <h3 className="text-white text-2xl mb-4">Artists</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uniqueArtists.map((artistName, idx) => (
              <Card
                key={`${artistName}-${idx}`}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <CardContent className="p-3">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-16 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                      <Users className="size-8 text-white" />
                    </div>
                    <div className="text-center min-w-0">
                      <h4 className="text-white truncate text-sm font-medium">{artistName}</h4>
                    </div>
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
          <h3 className="text-white text-2xl mb-4">Tracks</h3>
          <div className="space-y-2">
            {songs.map((song, idx) => (
              <Card
                key={song.song_id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-purple-400 font-medium w-8 text-right">{idx + 1}</span>

                  <div className="size-12 rounded bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                    <Music className="size-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-white truncate font-medium">{song.title}</h4>
                    <p className="text-purple-300 text-sm truncate">{song.artist_name || song.artist}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {song.genre && (
                      <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-200 shrink-0">
                        {song.genre}
                      </Badge>
                    )}
                    {song.duration && (
                      <span className="text-purple-300 text-sm shrink-0 w-10 text-right">
                        {Math.floor((song.duration as number) / 60)}:{String((song.duration as number) % 60).padStart(2, '0')}
                      </span>
                    )}
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 rounded-full size-10 shrink-0"
                      onClick={() => handlePlaySong(song)}
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

      {/* No Songs */}
      {!isLoading && songs.length === 0 && !error && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No songs in this album</h3>
          <p className="text-purple-300">This album doesn't have any tracks yet</p>
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
