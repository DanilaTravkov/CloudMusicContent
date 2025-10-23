import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Search, Music, Play, AlertCircle, Loader } from 'lucide-react';
import { getAlbums } from '../../lib/api';
import type { Album } from '../../types/music';
import { Layout } from '../Layout';
import { toast } from 'sonner';

export function AllAlbumsPage() {
  const navigate = useNavigate();
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const albumsData = await getAlbums(100);
        setAllAlbums(albumsData.albums);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        toast.error('Failed to load albums');
        console.error('Error loading albums:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAlbums = allAlbums.filter(album => {
    const matchesSearch = !searchQuery || 
      (album.title && album.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (album.artist && album.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (album.genre && album.genre.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const content = (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-white text-2xl mb-4">All Albums</h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-purple-400" />
          <Input
            type="text"
            placeholder="Search albums by title, artist, or genre..."
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
            <p className="text-white font-medium">Failed to load albums</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="size-8 text-purple-400 animate-spin" />
          <p className="text-white ml-3">Loading albums...</p>
        </div>
      )}

      {/* Albums Results */}
      {!isLoading && filteredAlbums.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAlbums.map(album => (
              <Card
                key={album.album_id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                onClick={() => {
                  if (album.album_id) {
                    navigate(`/albums/${album.album_id}`);
                  }
                }}
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
                      <p className="text-purple-300 text-sm truncate">{album.artist}</p>
                      <p className="text-purple-400 text-xs mt-1">{album.total_songs} tracks</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 rounded-full w-full"
                      onClick={(e) => e.stopPropagation()}
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

      {/* No Results */}
      {!isLoading && filteredAlbums.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No albums found</h3>
          <p className="text-purple-300">Try adjusting your search query</p>
        </div>
      )}

      {/* No Data Loaded */}
      {!isLoading && allAlbums.length === 0 && !error && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No albums available</h3>
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
