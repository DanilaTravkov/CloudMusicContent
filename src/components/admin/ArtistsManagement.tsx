import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardTitle, CardHeader } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, AlertCircle, Loader, Users } from 'lucide-react';
import { getArtists } from '../../lib/api';
// import { useAuth } from '../../contexts/AuthContext';
import type { Artist } from '../../types/music';
import { toast } from 'sonner';

export function ArtistsManagement() {
  // const { } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    genre: '',
    country: '',
    profile_image_url: ''
  });

  // Load artists on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const artistsData = await getArtists(100);
      setArtists(artistsData.artists);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load artists';
      setError(errorMessage);
      toast.error(`Failed to load: ${errorMessage}`);
      console.error('Error loading artists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      biography: '',
      genre: '',
      country: '',
      profile_image_url: ''
    });
    setEditingArtist(null);
  };

  const handleOpenDialog = (artist?: Artist) => {
    if (artist) {
      setEditingArtist(artist);
      setFormData({
        name: artist.name,
        biography: artist.biography || '',
        genre: artist.genre || '',
        country: artist.country || '',
        profile_image_url: artist.profile_image_url || ''
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For now, show a message that artist management is not yet implemented
    toast.error('Artist create/edit functionality is not yet implemented in the API');
    
    // TODO: Implement when backend artist management endpoints are available
    /*
    if (!accessToken) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    if (!formData.name) {
      toast.error('Artist name is required');
      return;
    }

    try {
      setIsSaving(true);

      const requestData = {
        name: formData.name,
        biography: formData.biography || undefined,
        genre: formData.genre || undefined,
        country: formData.country || undefined,
        profile_image_url: formData.profile_image_url || undefined,
      };

      if (editingArtist) {
        // const result = await updateArtist(editingArtist.artist_id, requestData, accessToken);
        // setArtists(prev => prev.map(a => (a.artist_id === editingArtist.artist_id ? result.artist : a)));
        toast.success('Artist updated successfully');
      } else {
        // const result = await createArtist(requestData, accessToken);
        // setArtists(prev => [...prev, result.artist]);
        toast.success('Artist created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save artist';
      toast.error(errorMessage);
      console.error('Error saving artist:', err);
    } finally {
      setIsSaving(false);
    }
    */
  };

  const handleDelete = async (artist: Artist) => {
    console.log(artist)
    // For now, show a message that artist deletion is not yet implemented
    toast.error('Artist deletion functionality is not yet implemented in the API');
    
    // TODO: Implement when backend artist management endpoints are available
    /*
    if (!accessToken) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${artist.name}"?`)) {
      return;
    }

    try {
      // await deleteArtist(artist.artist_id, accessToken);
      setArtists(prev => prev.filter(a => a.artist_id !== artist.artist_id));
      toast.success('Artist deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete artist';
      toast.error(errorMessage);
      console.error('Error deleting artist:', err);
    }
    */
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl mb-1">Artists Management</h2>
          <p className="text-purple-300">Manage artist profiles and information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="size-4 mr-2" />
              Add Artist
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 text-white border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingArtist ? 'Edit Artist' : 'Add New Artist'}</DialogTitle>
              <DialogDescription className="text-purple-300">
                Enter the artist's information below. Note: Create/edit functionality is not yet implemented.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Artist Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="biography">Biography</Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                  rows={4}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile_image_url">Profile Image URL</Label>
                <Input
                  id="profile_image_url"
                  value={formData.profile_image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, profile_image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
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
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isSaving ? (
                    <>
                      <Loader className="size-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingArtist ? 'Update Artist' : 'Create Artist'
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
            <p className="text-white font-medium">Failed to load artists</p>
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
          <p className="text-white ml-3">Loading artists...</p>
        </div>
      )}

      {/* Artists Grid */}
      {!isLoading && artists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map(artist => (
            <Card key={artist.artist_id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="size-16 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {artist.profile_image_url ? (
                      <img src={artist.profile_image_url} alt={artist.name} className="size-full object-cover" />
                    ) : (
                      <Users className="size-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white truncate">{artist.name}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {artist.genre && (
                        <Badge variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                          {artist.genre}
                        </Badge>
                      )}
                      {artist.country && (
                        <Badge variant="secondary" className="text-xs bg-indigo-900/50 text-indigo-200">
                          {artist.country}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-4 text-xs text-purple-400 mt-2">
                      {artist.total_albums && <span>{artist.total_albums} albums</span>}
                      {artist.total_songs && <span>{artist.total_songs} songs</span>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {artist.biography && (
                  <p className="text-purple-200 text-sm line-clamp-3 mb-4">{artist.biography}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(artist)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Edit className="size-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(artist)}
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

      {/* No Artists */}
      {!isLoading && artists.length === 0 && !error && (
        <div className="text-center py-12">
          <Users className="size-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No artists yet</h3>
          <p className="text-purple-300">Artists will appear here when they are added to the system</p>
        </div>
      )}
    </div>
  );
}
