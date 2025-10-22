import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Disc3, Music, Upload } from 'lucide-react';
import { mockAlbums, mockArtists, mockSongs, mockGenres, type Album } from '../../lib/mockData';
import { toast } from 'sonner';

export function AlbumsManagement() {
  const [albums, setAlbums] = useState<Album[]>(mockAlbums);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artistIds: [] as string[],
    genres: [] as string[],
    imageUrl: '',
    releaseDate: '',
    songIds: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      title: '',
      artistIds: [],
      genres: [],
      imageUrl: '',
      releaseDate: '',
      songIds: []
    });
    setEditingAlbum(null);
  };

  const handleOpenDialog = (album?: Album) => {
    if (album) {
      setEditingAlbum(album);
      setFormData({
        title: album.title,
        artistIds: album.artistIds,
        genres: album.genres,
        imageUrl: album.imageUrl,
        releaseDate: album.releaseDate,
        songIds: album.songIds
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAlbum) {
      setAlbums(prev => prev.map(a => 
        a.id === editingAlbum.id 
          ? { ...a, ...formData }
          : a
      ));
      toast.success('Album updated successfully');
    } else {
      const newAlbum: Album = {
        id: `album-${Date.now()}`,
        ...formData
      };
      setAlbums(prev => [...prev, newAlbum]);
      toast.success('Album created successfully');
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (albumId: string) => {
    setAlbums(prev => prev.filter(a => a.id !== albumId));
    toast.success('Album deleted successfully');
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const toggleArtist = (artistId: string) => {
    setFormData(prev => ({
      ...prev,
      artistIds: prev.artistIds.includes(artistId)
        ? prev.artistIds.filter(id => id !== artistId)
        : [...prev.artistIds, artistId]
    }));
  };

  const toggleSong = (songId: string) => {
    setFormData(prev => ({
      ...prev,
      songIds: prev.songIds.includes(songId)
        ? prev.songIds.filter(id => id !== songId)
        : [...prev.songIds, songId]
    }));
  };

  const getArtistNames = (artistIds: string[]) => {
    return artistIds
      .map(id => mockArtists.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');
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
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="size-4 mr-2" />
              Create Album
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 text-white border-white/20 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAlbum ? 'Edit Album' : 'Create New Album'}</DialogTitle>
              <DialogDescription className="text-purple-300">
                Upload entire album or create collection of songs
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
                  <Label htmlFor="releaseDate">Release Date *</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Artists * (Select one or more)</Label>
                <div className="flex flex-wrap gap-2">
                  {mockArtists.map(artist => (
                    <Badge
                      key={artist.id}
                      variant={formData.artistIds.includes(artist.id) ? 'default' : 'outline'}
                      className={`cursor-pointer ${
                        formData.artistIds.includes(artist.id)
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                      onClick={() => toggleArtist(artist.id)}
                    >
                      {artist.name}
                    </Badge>
                  ))}
                </div>
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
                <Label>Songs</Label>
                <div className="bg-white/5 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                  {mockSongs.length > 0 ? (
                    mockSongs.map(song => (
                      <div
                        key={song.id}
                        onClick={() => toggleSong(song.id)}
                        className={`p-2 rounded cursor-pointer transition-colors ${
                          formData.songIds.includes(song.id)
                            ? 'bg-purple-600'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">{song.title}</p>
                            <p className="text-purple-300 text-xs">{getArtistNames(song.artistIds)}</p>
                          </div>
                          <p className="text-purple-300 text-xs">{song.duration}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-purple-300 text-sm text-center py-4">No songs available. Create songs first.</p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button type="button" className="bg-purple-600 hover:bg-purple-700 flex-1">
                    <Upload className="size-4 mr-2" />
                    Upload Multiple Files
                  </Button>
                  <p className="text-xs text-purple-300">Or select existing songs above</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Album Cover URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/album-cover.jpg"
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
                  {editingAlbum ? 'Update Album' : 'Create Album'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map(album => (
          <Card key={album.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="size-20 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {album.imageUrl ? (
                    <img src={album.imageUrl} alt={album.title} className="size-full object-cover" />
                  ) : (
                    <Disc3 className="size-10 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-white truncate">{album.title}</CardTitle>
                  <p className="text-purple-300 text-sm mt-1">{getArtistNames(album.artistIds)}</p>
                  <p className="text-purple-400 text-xs mt-1">
                    {new Date(album.releaseDate).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {album.genres.map(genre => (
                      <Badge key={genre} variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-purple-300 text-sm mb-4">
                <Music className="size-4" />
                <span>{album.songIds.length} tracks</span>
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
                  onClick={() => handleDelete(album.id)}
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
