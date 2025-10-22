import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardTitle, CardHeader } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Music2 } from 'lucide-react';
import { mockArtists, mockGenres, type Artist } from '../../lib/mockData';
import { toast } from 'sonner';

export function ArtistsManagement() {
  const [artists, setArtists] = useState<Artist[]>(mockArtists);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    genres: [] as string[],
    imageUrl: ''
  });

  const resetForm = () => {
    setFormData({ name: '', biography: '', genres: [], imageUrl: '' });
    setEditingArtist(null);
  };

  const handleOpenDialog = (artist?: Artist) => {
    if (artist) {
      setEditingArtist(artist);
      setFormData({
        name: artist.name,
        biography: artist.biography,
        genres: artist.genres,
        imageUrl: artist.imageUrl
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingArtist) {
      // Update existing artist
      setArtists(prev => prev.map(a => 
        a.id === editingArtist.id 
          ? { ...a, ...formData }
          : a
      ));
      toast.success('Artist updated successfully');
    } else {
      // Create new artist
      const newArtist: Artist = {
        id: `artist-${Date.now()}`,
        ...formData
      };
      setArtists(prev => [...prev, newArtist]);
      toast.success('Artist created successfully');
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (artistId: string) => {
    setArtists(prev => prev.filter(a => a.id !== artistId));
    toast.success('Artist deleted successfully');
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
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
                Enter the artist's information below
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
                <Label htmlFor="biography">Biography *</Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                  required
                  rows={4}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Genres *</Label>
                <div className="flex flex-wrap gap-2">
                  {mockGenres.map(genre => (
                    <Badge
                      key={genre}
                      variant={formData.genres.includes(genre) ? 'default' : 'outline'}
                      className={`cursor-pointer ${
                        formData.genres.includes(genre)
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
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
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {editingArtist ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map(artist => (
          <Card key={artist.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="size-16 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {artist.imageUrl ? (
                    <img src={artist.imageUrl} alt={artist.name} className="size-full object-cover" />
                  ) : (
                    <Music2 className="size-8 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-white truncate">{artist.name}</CardTitle>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {artist.genres.map(genre => (
                      <Badge key={genre} variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 text-sm line-clamp-3 mb-4">{artist.biography}</p>
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
                  onClick={() => handleDelete(artist.id)}
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
    </div>
  );
}
