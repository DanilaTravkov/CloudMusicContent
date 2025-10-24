import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Edit, Trash2, Music, Upload, Play, AlertCircle, Loader } from 'lucide-react';
import { getSongs, getAlbums, getArtists, createSong, updateSong, deleteSong } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Song, Album, Artist } from '../../types/music';
import { toast } from 'sonner';

export function SongsManagement() {
  const { accessToken, idToken } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist_id: '',
    duration: '',
    album_id: '',
    genre: '',
  });

  // Load songs and albums on mount
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [songsData, albumsData, artistsData] = await Promise.all([
        getSongs(100),
        getAlbums(100),
        getArtists(100),
      ]);
      setSongs(songsData.songs);
      setAlbums(albumsData.albums);
      setArtists(artistsData.artists);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      toast.error(`Failed to load: ${errorMessage}`);
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      title: '',
      artist_id: '',
      duration: '',
      album_id: '',
      genre: '',
    });
    setEditingSong(null);
  };
  const handleOpenDialog = (song?: Song) => {
    if (song) {
      setEditingSong(song);
      setFormData({
        title: song.title,
        artist_id: song.artist_id || '',
        duration: String(song.duration),
        album_id: song.album_id || '',
        genre: song.genre || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      toast.error('You must be logged in to perform this action');
      return;
    }    if (!formData.title || !formData.artist_id || !formData.duration || !formData.album_id) {
      toast.error('Please fill in all required fields');
      return;
    }    try {
      setIsSaving(true);

      const requestData = {
        title: formData.title,
        artist_id: formData.artist_id, // Send artist_id directly to match backend expectations
        duration: parseInt(formData.duration, 10),
        album_id: formData.album_id,
        genre: formData.genre || undefined,
      };

      if (editingSong) {
        const result = await updateSong(editingSong.song_id, requestData, accessToken);
        setSongs(prev =>
          prev.map(s => (s.song_id === editingSong.song_id ? result.song : s))
        );
        toast.success('Song updated successfully');
      } else {
        const result = await createSong(requestData, accessToken);
        setSongs(prev => [...prev, result.song]);
        toast.success('Song created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save song';
      toast.error(errorMessage);
      console.error('Error saving song:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (song: Song) => {
    if (!idToken || !accessToken) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${song.title}"?`)) {
      return;
    }

    try {
      await deleteSong(song.song_id, idToken);
      setSongs(prev => prev.filter(s => s.song_id !== song.song_id));
      toast.success('Song deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete song';
      toast.error(errorMessage);
      console.error('Error deleting song:', err);
    }
  };

  const getAlbumTitle = (albumId?: string) => {
    if (!albumId) return 'No album';
    return albums.find(a => a.album_id === albumId)?.title || 'Unknown Album';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl mb-1">Songs Management</h2>
          <p className="text-purple-300">Upload and manage musical content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Upload className="size-4 mr-2" />
              Upload Song
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 text-white border-white/20 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSong ? 'Edit Song' : 'Upload New Song'}</DialogTitle>
              <DialogDescription className="text-purple-300">
                Fill in the song details and metadata
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Song Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>                <div className="space-y-2">
                  <Label htmlFor="artist_id">Artist *</Label>
                  <Select value={formData.artist_id} onValueChange={(value) => setFormData(prev => ({ ...prev, artist_id: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select an artist" />
                    </SelectTrigger>                    <SelectContent className="bg-slate-900 border-white/20 text-white">
                      {artists.map(artist => (
                        <SelectItem key={artist.artist_id} value={artist.artist_id}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (seconds) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="album_id">Album *</Label>
                <Select value={formData.album_id} onValueChange={(value) => setFormData(prev => ({ ...prev, album_id: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select an album" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">                    {albums.map(album => (
                      <SelectItem key={album.album_id} value={album.album_id}>
                        {album.title} - {album.artist_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isSaving ? (
                    <>
                      <Loader className="size-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingSong ? 'Update Song' : 'Create Song'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 mb-6">
          <AlertCircle className="size-5 text-red-400 shrink-0" />
          <div>
            <p className="text-white font-medium">Failed to load songs</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="ml-auto border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="size-8 text-purple-400 animate-spin" />
          <p className="text-white ml-3">Loading songs...</p>
        </div>
      )}

      {/* Songs List */}
      {!isLoading && songs.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {songs.map(song => (
            <Card key={song.song_id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                    <Music className="size-8 text-white" />
                  </div>                  <div className="flex-1 min-w-0">
                    <h3 className="text-white truncate">{song.title}</h3>
                    <p className="text-purple-300 text-sm">{song.artist_name || song.artist}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs bg-indigo-900/50 text-indigo-200">
                        {getAlbumTitle(song.album_id)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                        {song.genre}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right text-sm text-purple-300 space-y-1">
                    <div>
                      {Math.floor(parseInt(String(song.duration), 10) / 60)}:
                      {String(parseInt(String(song.duration), 10) % 60).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Play className="size-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(song)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="size-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(song)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Songs */}
      {!isLoading && songs.length === 0 && !error && (
        <div className="text-center py-12">
          <Music className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No songs yet</h3>
          <p className="text-purple-300">Create your first song to get started</p>
        </div>
      )}
    </div>
  );
}
