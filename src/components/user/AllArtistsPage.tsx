import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Search, Users, AlertCircle, Loader } from 'lucide-react';
import { getArtists } from '../../lib/api';
import type { Artist } from '../../types/music';
import { Layout } from '../Layout';
import { toast } from 'sonner';

export function AllArtistsPage() {
  const navigate = useNavigate();
  const [allArtists, setAllArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const artistsData = await getArtists(100);
        setAllArtists(artistsData.artists);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        toast.error('Failed to load artists');
        console.error('Error loading artists:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = !searchQuery || 
      (artist.name && artist.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (artist.bio && artist.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const content = (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-white text-2xl mb-4">All Artists</h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-purple-400" />
          <Input
            type="text"
            placeholder="Search artists by name..."
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
            <p className="text-white font-medium">Failed to load artists</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="size-8 text-purple-400 animate-spin" />
          <p className="text-white ml-3">Loading artists...</p>
        </div>
      )}

      {/* Artists Results */}
      {!isLoading && filteredArtists.length > 0 && (
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredArtists.map(artist => (
              <Card
                key={artist.pk}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => {
                  const artistId = artist.pk?.split('#')[1];
                  if (artistId) {
                    navigate(`/artists/${artistId}`);
                  }
                }}
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
                    <div className="text-center min-w-0 w-full">
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

      {/* No Results */}
      {!isLoading && filteredArtists.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Users className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No artists found</h3>
          <p className="text-purple-300">Try adjusting your search query</p>
        </div>
      )}

      {/* No Data Loaded */}
      {!isLoading && allArtists.length === 0 && !error && (
        <div className="text-center py-12">
          <Users className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No artists available</h3>
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
