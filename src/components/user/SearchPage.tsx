import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Search, Music, Play, AlertCircle, Loader, Users } from 'lucide-react';
import { getSongs, getAlbums, getArtists } from '../../lib/api';
import type { Song, Album, Artist } from '../../types/music';
import { Layout } from '../Layout';
import { toast } from 'sonner';

interface SearchPageProps {
  onPlaySong?: (song: Song) => void;
}

export function SearchPage({ onPlaySong }: SearchPageProps) {
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all songs and albums on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [songsData, albumsData, artistsData] = await Promise.all([
          getSongs(100), // Load more for searching
          getAlbums(100),
          getArtists(100),
        ]);

        setAllSongs(songsData.songs);
        setAllAlbums(albumsData.albums);
        setAllArtists(artistsData.artists);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        toast.error('Failed to load music data');
        console.error('Error loading data:', err);
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

  // Filter content based on search query
  const filteredSongs = allSongs.filter(song => {
    const matchesSearch = !searchQuery || 
      (song.title && song.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ((song.artist_name || song.artist) && (song.artist_name || song.artist)!.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (song.genre && song.genre.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const filteredAlbums = allAlbums.filter(album => {
    const matchesSearch = !searchQuery || 
      (album.title && album.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (album.artist && album.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (album.genre && album.genre.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = !searchQuery || 
      (artist.name && artist.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (artist.bio && artist.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Get unique genres from all songs
  const uniqueGenres = Array.from(
    new Set(allSongs.map(song => song.genre).filter(Boolean))
  ).sort();

  const content = (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h2 className="text-white text-2xl mb-4">Search & Discover</h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-purple-400" />
          <Input
            type="text"
            placeholder="Search for songs, albums, or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
        </div>

        {/* Genre Filter Info */}
        {uniqueGenres.length > 0 && (
          <div>
            <h3 className="text-white mb-3">Available Genres</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueGenres.map(genre => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 cursor-pointer"
                  onClick={() => setSearchQuery(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="size-5 text-red-400 shrink-0" />
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

      {/* Albums Results */}
      {!isLoading && filteredAlbums.length > 0 && (
        <section>
          <h3 className="text-white text-xl mb-3">
            Albums {searchQuery && `matching "${searchQuery}"`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlbums.map(album => (
              <Card
                key={album.album_id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                      {album.cover_image_url ? (
                        <img src={album.cover_image_url} alt={album.title} className="size-full object-cover" />
                      ) : (
                        <Music className="size-10 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white truncate mb-1">{album.title}</h4>
                      <p className="text-purple-300 text-sm truncate">{album.artist}</p>
                      <p className="text-purple-400 text-xs mt-1">{album.total_songs} tracks</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 rounded-full size-10"
                      onClick={() => {
                        if (allSongs.length > 0 && onPlaySong) {
                          const song = allSongs[0];
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

      {/* Artists Results */}
      {!isLoading && filteredArtists.length > 0 && (
        <section>
          <h3 className="text-white text-xl mb-3">
            Artists {searchQuery && `matching "${searchQuery}"`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtists.map(artist => (
              <Card
                key={artist.pk}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                      {artist.image_url ? (
                        <img src={artist.image_url} alt={artist.name} className="size-full object-cover" />
                      ) : (
                        <Users className="size-10 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white truncate mb-1">{artist.name}</h4>
                      {artist.total_albums && (
                        <p className="text-purple-400 text-xs">{artist.total_albums} albums</p>
                      )}
                      {artist.total_songs && (
                        <p className="text-purple-400 text-xs">{artist.total_songs} songs</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Songs Results */}
      {!isLoading && filteredSongs.length > 0 && (
        <section>
          <h3 className="text-white text-xl mb-3">
            Songs {searchQuery && `matching "${searchQuery}"`}
          </h3>
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
                    <div className="size-12 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
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
      {!isLoading && filteredSongs.length === 0 && filteredAlbums.length === 0 && filteredArtists.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No results found</h3>
          <p className="text-purple-300">Try adjusting your search query</p>
        </div>
      )}

      {/* No Data Loaded */}
      {!isLoading && allSongs.length === 0 && allAlbums.length === 0 && allArtists.length === 0 && !error && (
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
