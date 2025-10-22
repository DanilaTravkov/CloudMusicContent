import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Music } from 'lucide-react';
import { mockSongs, mockAlbums, mockArtists, type Song } from '../../lib/mockData';
import { Layout } from '../Layout';
import { toast } from 'sonner';

interface HomePageProps {
  onPlaySong?: (song: Song) => void;
}

export function HomePage({ onPlaySong }: HomePageProps) {
  const getArtistNames = (artistIds: string[]) => {
    return artistIds
      .map(id => mockArtists.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };  const handlePlaySong = (song: Song) => {
    if (onPlaySong) {
      onPlaySong(song);
    } else {
      // For standalone usage, show a toast notification
      toast.info(`Playing: ${song.title}`);
      console.log('Playing song:', song.title);
      // You could add actual audio playback logic here
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

      {/* Recently Added */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-2xl">Recently Added</h3>
          <Button variant="ghost" className="text-purple-300 hover:text-white hover:bg-white/10">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockSongs.slice(0, 5).map(song => (
            <Card
              key={song.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              onClick={() => handlePlaySong(song)}
            >
              <CardContent className="p-4">
                <div className="relative mb-3">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                    {song.imageUrl ? (
                      <img src={song.imageUrl} alt={song.title} className="size-full object-cover" />
                    ) : (
                      <Music className="size-12 text-white" />
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 size-10 rounded-full bg-purple-600 hover:bg-purple-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Play className="size-4 fill-current" />
                  </Button>
                </div>
                <h4 className="text-white truncate mb-1">{song.title}</h4>
                <p className="text-purple-300 text-sm truncate">{getArtistNames(song.artistIds)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Albums */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-2xl">Featured Albums</h3>
          <Button variant="ghost" className="text-purple-300 hover:text-white hover:bg-white/10">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAlbums.map(album => (
            <Card
              key={album.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="size-20 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {album.imageUrl ? (
                      <img src={album.imageUrl} alt={album.title} className="size-full object-cover" />
                    ) : (
                      <Music className="size-10 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white truncate mb-1">{album.title}</h4>
                    <p className="text-purple-300 text-sm truncate">{getArtistNames(album.artistIds)}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {album.genres.map(genre => (
                        <Badge key={genre} variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 rounded-full size-10"
                    onClick={() => {
                      const firstSong = mockSongs.find(s => s.albumId === album.id);
                      if (firstSong) handlePlaySong(firstSong);
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

      {/* Popular Artists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-2xl">Popular Artists</h3>
          <Button variant="ghost" className="text-purple-300 hover:text-white hover:bg-white/10">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mockArtists.map(artist => (
            <Card
              key={artist.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="aspect-square rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden mb-3">
                  {artist.imageUrl ? (
                    <img src={artist.imageUrl} alt={artist.name} className="size-full object-cover" />
                  ) : (
                    <Music className="size-12 text-white" />
                  )}
                </div>
                <h4 className="text-white text-center truncate">{artist.name}</h4>
                <p className="text-purple-300 text-sm text-center">Artist</p>
              </CardContent>
            </Card>
          ))}
        </div>      </section>
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
