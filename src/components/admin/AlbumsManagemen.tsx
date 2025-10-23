import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Disc3, Music, AlertCircle, Loader } from 'lucide-react';
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from '../../lib/api';
import type { Album } from '../../types/music';
import { toast } from 'sonner';

// Mock access token - в реальном приложении это будет из AuthContext
const MOCK_ACCESS_TOKEN = 'mock-token-for-development';

export function AlbumsManagement() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    release_date: '',
    genre: '',
    description: '',
  });

  // Load albums on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const albumsData = await getAlbums(100);
      setAlbums(albumsData.albums);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load albums';
      setError(errorMessage);
      toast.error(`Failed to load: ${errorMessage}`);
      console.error('Error loading albums:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      release_date: '',
      genre: '',
      description: '',
    });
    setEditingAlbum(null);
  };

  const handleOpenDialog = (album?: Album) => {
    if (album) {
      setEditingAlbum(album);
      setFormData({
        title: album.title,
        artist: album.artist,
        release_date: album.release_date || '',
        genre: album.genre || '',
        description: album.description || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.artist || !formData.release_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);

      const requestData = {
        title: formData.title,
        artist: formData.artist,
        release_date: formData.release_date,
        genre: formData.genre || undefined,
        description: formData.description || undefined,
      };

      if (editingAlbum) {
        const result = await updateAlbum(editingAlbum.album_id, requestData, MOCK_ACCESS_TOKEN);
        setAlbums(prev =>
          prev.map(a => (a.album_id === editingAlbum.album_id ? result.album : a))
        );
        toast.success('Album updated successfully');
      } else {
        const result = await createAlbum(requestData, MOCK_ACCESS_TOKEN);
        setAlbums(prev => [...prev, result.album]);
        toast.success('Album created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save album';
      toast.error(errorMessage);
      console.error('Error saving album:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (album: Album) => {
    if (!confirm(`Are you sure you want to delete "${album.title}"?`)) {
      return;
    }

    try {
      await deleteAlbum(album.album_id, MOCK_ACCESS_TOKEN);
      setAlbums(prev => prev.filter(a => a.album_id !== album.album_id));
      toast.success('Album deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete album';
      toast.error(errorMessage);
      console.error('Error deleting album:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl mb-1">Albums Management</h2>
          <p className="text-purple-300">Create and manage album collections</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="size-4 mr-2" />
              Create Album
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 text-white border-white/20 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAlbum ? 'Edit Album' : 'Create New Album'}</DialogTitle>
              <DialogDescription className="text-purple-300">
                Upload entire album or create collection
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Album Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artist">Artist *</Label>
                  <Input
                    id="artist"
                    value={formData.artist}
                    onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="release_date">Release Date *</Label>
                  <Input
                    id="release_date"
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value }))}
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
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Album description..."
                  className="bg-white/10 border-white/20 text-white"
                />
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
                    editingAlbum ? 'Update Album' : 'Create Album'
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
            <p className="text-white font-medium">Failed to load albums</p>
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
          <p className="text-white ml-3">Loading albums...</p>
        </div>
      )}

      {/* Albums Grid */}
      {!isLoading && albums.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map(album => (
            <Card key={album.album_id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="size-20 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                    {album.cover_image_url ? (
                      <img src={album.cover_image_url} alt={album.title} className="size-full object-cover" />
                    ) : (
                      <Disc3 className="size-10 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white truncate">{album.title}</CardTitle>
                    <p className="text-purple-300 text-sm mt-1">{album.artist}</p>
                    <p className="text-purple-400 text-xs mt-1">
                      {new Date(album.release_date).toLocaleDateString()}
                    </p>
                    {album.genre && (
                      <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-200 mt-2">
                        {album.genre}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-purple-300 text-sm mb-4">
                  <Music className="size-4" />
                  <span>{album.total_songs || 0} tracks</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(album)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Edit className="size-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(album)}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="size-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Albums */}
      {!isLoading && albums.length === 0 && !error && (
        <div className="text-center py-12">
          <Disc3 className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No albums yet</h3>
          <p className="text-purple-300">Create your first album to get started</p>
        </div>
      )}
    </div>
  );
}
