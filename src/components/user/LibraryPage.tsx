import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Heart, Music, Bell, BellOff } from 'lucide-react';
import { mockArtists, mockGenres } from '../../lib/mockData';
import { type Song } from '../../types/music';
import { toast } from 'sonner';
import { Layout } from '../Layout';

interface LibraryPageProps {
  onPlaySong?: (song: Song) => void;
}

export function LibraryPage({ onPlaySong }: LibraryPageProps) {  // Mock subscriptions state
  const [subscribedArtists, setSubscribedArtists] = useState<string[]>(['artist-1', 'artist-2']);
  const [subscribedGenres, setSubscribedGenres] = useState<string[]>(['Rock', 'Electronic']);
  const handleToggleArtistSubscription = (artistId: string) => {
    if (subscribedArtists.includes(artistId)) {
      setSubscribedArtists(prev => prev.filter(id => id !== artistId));
      toast.success('Unsubscribed from artist');
    } else {
      setSubscribedArtists(prev => [...prev, artistId]);
      toast.success('Subscribed to artist! You will receive notifications when new content is published.');
    }
  };

  const handleToggleGenreSubscription = (genre: string) => {
    if (subscribedGenres.includes(genre)) {
      setSubscribedGenres(prev => prev.filter(g => g !== genre));
      toast.success('Unsubscribed from genre');
    } else {
      setSubscribedGenres(prev => [...prev, genre]);
      toast.success('Subscribed to genre! You will receive notifications when new content is published.');
    }
  };
  // TODO: Replace with real API call to get user's liked songs
  const likedSongsData: Song[] = [];

  const content = (
    <div className="space-y-8">
      {/* Liked Songs */}
      <section>        <div className="flex items-center gap-3 mb-4">
          <div className="bg-linear-to-br from-purple-500 to-pink-500 p-3 rounded-lg">
            <Heart className="size-6 text-white fill-current" />
          </div>
          <div>
            <h2 className="text-white text-2xl">Liked Songs</h2>
            <p className="text-purple-300">{likedSongsData.length} songs</p>
          </div>
        </div>
          <Card className="bg-white/5 border-white/10 p-8 text-center">
          <Heart className="size-12 text-purple-500 mx-auto mb-3" />
          <p className="text-purple-300">No liked songs yet. Start exploring!</p>
        </Card>
      </section>

      {/* Artist Subscriptions */}
      <section>
        <div className="mb-4">
          <h3 className="text-white text-xl mb-1">Artist Subscriptions</h3>
          <p className="text-purple-300 text-sm">Get notified when your favorite artists release new music</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockArtists.map(artist => {
            const isSubscribed = subscribedArtists.includes(artist.id);
            return (
              <Card
                key={artist.id}
                className={`transition-all ${
                  isSubscribed
                    ? 'bg-purple-600/20 border-purple-500/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <CardContent className="p-4">                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                      {artist.imageUrl ? (
                        <img src={artist.imageUrl} alt={artist.name} className="size-full object-cover" />
                      ) : (
                        <Music className="size-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white truncate mb-1">{artist.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {artist.genres.map(genre => (
                          <Badge key={genre} variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isSubscribed ? 'default' : 'outline'}
                      onClick={() => handleToggleArtistSubscription(artist.id)}
                      className={
                        isSubscribed
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'border-white/20 text-white hover:bg-white/10'
                      }
                    >
                      {isSubscribed ? (
                        <>
                          <Bell className="size-4 mr-2" />
                          Subscribed
                        </>
                      ) : (
                        <>
                          <BellOff className="size-4 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Genre Subscriptions */}
      <section>
        <div className="mb-4">
          <h3 className="text-white text-xl mb-1">Genre Subscriptions</h3>
          <p className="text-purple-300 text-sm">Get notified about new releases in your favorite genres</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {mockGenres.map(genre => {
            const isSubscribed = subscribedGenres.includes(genre);
            return (
              <Button
                key={genre}
                variant={isSubscribed ? 'default' : 'outline'}
                onClick={() => handleToggleGenreSubscription(genre)}
                className={
                  isSubscribed
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'border-white/20 text-white hover:bg-white/10'
                }
              >
                {isSubscribed && <Bell className="size-4 mr-2" />}
                {genre}
              </Button>
            );
          })}
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
