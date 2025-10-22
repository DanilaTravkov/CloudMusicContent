import { useState } from 'react';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Search, Music, Play, Users, Disc3 } from 'lucide-react';
import { mockSongs, mockAlbums, mockArtists, mockGenres, type Song } from '../../lib/mockData';
import { Layout } from '../Layout';
import { toast } from 'sonner';

interface SearchPageProps {
  onPlaySong?: (song: Song) => void;
}

export function SearchPage({ onPlaySong }: SearchPageProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedArtist, setSelectedArtist] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');  const handlePlaySong = (song: Song) => {
    if (onPlaySong) {
      onPlaySong(song);
    } else {
      toast.info(`Playing: ${song.title}`);
      console.log('Playing song:', song.title);
      // Allow unauthorized users to play songs too
    }
  };

  const getArtistNames = (artistIds: string[]) => {
    return artistIds
      .map(id => mockArtists.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  // Filter content based on selected genre and artist
  const filteredSongs = mockSongs.filter(song => {
    const matchesGenre = !selectedGenre || song.genres.includes(selectedGenre);
    const matchesArtist = !selectedArtist || song.artistIds.includes(selectedArtist);
    const matchesSearch = !searchQuery || 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getArtistNames(song.artistIds).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesArtist && matchesSearch;
  });

  const filteredAlbums = mockAlbums.filter(album => {
    const matchesGenre = !selectedGenre || album.genres.includes(selectedGenre);
    const matchesArtist = !selectedArtist || album.artistIds.includes(selectedArtist);
    const matchesSearch = !searchQuery || 
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getArtistNames(album.artistIds).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesArtist && matchesSearch;
  });

  const filteredArtists = mockArtists.filter(artist => {
    const matchesGenre = !selectedGenre || artist.genres.includes(selectedGenre);
    const matchesSearch = !searchQuery || 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });
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

        {/* Genre Filter */}
        <div>
          <h3 className="text-white mb-3">Filter by Genre</h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!selectedGenre ? 'default' : 'outline'}
              className={`cursor-pointer ${
                !selectedGenre
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'border-white/20 text-white hover:bg-white/10'
              }`}
              onClick={() => {
                setSelectedGenre('');
                setSelectedArtist('');
              }}
            >
              All Genres
            </Badge>
            {mockGenres.map(genre => (
              <Badge
                key={genre}
                variant={selectedGenre === genre ? 'default' : 'outline'}
                className={`cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Artists in Selected Genre */}
      {selectedGenre && (
        <section>
          <h3 className="text-white text-xl mb-3">Artists in {selectedGenre}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {filteredArtists.map(artist => (
              <Card
                key={artist.id}
                className={`cursor-pointer transition-all ${
                  selectedArtist === artist.id
                    ? 'bg-purple-600/30 border-purple-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setSelectedArtist(selectedArtist === artist.id ? '' : artist.id)}
              >
                <CardContent className="p-3">
                  <div className="aspect-square rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden mb-2">
                    {artist.imageUrl ? (
                      <img src={artist.imageUrl} alt={artist.name} className="size-full object-cover" />
                    ) : (
                      <Users className="size-8 text-white" />
                    )}
                  </div>
                  <h4 className="text-white text-sm text-center truncate">{artist.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Albums Results */}
      {filteredAlbums.length > 0 && (
        <section>
          <h3 className="text-white text-xl mb-3">
            {selectedArtist ? `Albums by ${mockArtists.find(a => a.id === selectedArtist)?.name}` : 'Albums'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlbums.map(album => (
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
                        <Disc3 className="size-10 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white truncate mb-1">{album.title}</h4>
                      <p className="text-purple-300 text-sm truncate">{getArtistNames(album.artistIds)}</p>
                      <p className="text-purple-400 text-xs mt-1">{album.songIds.length} tracks</p>
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
      )}

      {/* Songs Results */}
      {filteredSongs.length > 0 && (
        <section>
          <h3 className="text-white text-xl mb-3">Songs</h3>
          <div className="space-y-2">
            {filteredSongs.map((song, index) => (
              <Card
                key={song.id}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => handlePlaySong(song)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-4">
                    <span className="text-purple-400 w-6 text-center">{index + 1}</span>
                    <div className="size-12 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                    <div className="text-right">
                      <p className="text-purple-300 text-sm">{song.duration}</p>
                      <div className="flex gap-1 mt-1">
                        {song.genres.slice(0, 2).map(genre => (
                          <Badge key={genre} variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                            {genre}
                          </Badge>
                        ))}
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
      {filteredSongs.length === 0 && filteredAlbums.length === 0 && filteredArtists.length === 0 && (selectedGenre || selectedArtist || searchQuery) && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No results found</h3>
          <p className="text-purple-300">Try adjusting your filters or search query</p>
        </div>      )}
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
