import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Edit, Trash2, Music, Upload, Play } from 'lucide-react';
import { mockSongs, mockArtists, mockAlbums, mockGenres, type Song } from '../../lib/mockData';
import { toast } from 'sonner';

export function SongsManagement() {
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artistIds: [] as string[],
    albumId: '',
    genres: [] as string[],
    imageUrl: '',
    fileName: '',
    fileType: 'audio/mpeg',
    fileSize: '',
    duration: ''
  });
  const resetForm = () => {
    setFormData({
      title: '',
      artistIds: [],
      albumId: 'single',
      genres: [],
      imageUrl: '',
      fileName: '',
      fileType: 'audio/mpeg',
      fileSize: '',
      duration: ''
    });
    setEditingSong(null);
  };
  const handleOpenDialog = (song?: Song) => {
    if (song) {
      setEditingSong(song);
      setFormData({
        title: song.title,
        artistIds: song.artistIds,
        albumId: song.albumId || 'single',
        genres: song.genres,
        imageUrl: song.imageUrl,
        fileName: song.fileName,
        fileType: song.fileType,
        fileSize: song.fileSize,
        duration: song.duration
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const albumId = formData.albumId === 'single' ? undefined : formData.albumId;
    
    if (editingSong) {
      setSongs(prev => prev.map(s => 
        s.id === editingSong.id 
          ? {
              ...s,
              ...formData,
              albumId,
              lastModified: new Date().toISOString()
            }
          : s
      ));
      toast.success('Song updated successfully');
    } else {
      const newSong: Song = {
        id: `song-${Date.now()}`,
        ...formData,
        albumId,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setSongs(prev => [...prev, newSong]);
      toast.success('Song uploaded successfully');
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (songId: string) => {
    setSongs(prev => prev.filter(s => s.id !== songId));
    toast.success('Song deleted successfully');
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

  const getArtistNames = (artistIds: string[]) => {
    return artistIds
      .map(id => mockArtists.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getAlbumTitle = (albumId?: string) => {
    if (!albumId) return 'Single';
    return mockAlbums.find(a => a.id === albumId)?.title || 'Unknown Album';
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
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    placeholder="3:45"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
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
              </div>              <div className="space-y-2">
                <Label htmlFor="albumId">Album (Optional - Leave empty for single)</Label>
                <Select value={formData.albumId} onValueChange={(value) => setFormData(prev => ({ ...prev, albumId: value === 'single' ? '' : value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select an album or leave as single" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
                    <SelectItem value="single">Single (No Album)</SelectItem>
                    {mockAlbums.map(album => (
                      <SelectItem key={album.id} value={album.id}>
                        {album.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="fileName">File Name *</Label>
                <div className="flex gap-2">
                  <Input
                    id="fileName"
                    value={formData.fileName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileName: e.target.value }))}
                    placeholder="song-title.mp3"
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button type="button" className="bg-purple-600 hover:bg-purple-700">
                    <Upload className="size-4 mr-2" />
                    Browse
                  </Button>
                </div>
                <p className="text-xs text-purple-300">Metadata will be extracted from the file</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fileType">File Type</Label>
                  <Input
                    id="fileType"
                    value={formData.fileType}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileType: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileSize">File Size</Label>
                  <Input
                    id="fileSize"
                    placeholder="8.5 MB"
                    value={formData.fileSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileSize: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Cover Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/cover.jpg"
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
                  {editingSong ? 'Update Song' : 'Upload Song'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {songs.map(song => (
          <Card key={song.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {song.imageUrl ? (
                    <img src={song.imageUrl} alt={song.title} className="size-full object-cover" />
                  ) : (
                    <Music className="size-8 text-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white truncate">{song.title}</h3>
                  <p className="text-purple-300 text-sm">{getArtistNames(song.artistIds)}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs bg-indigo-900/50 text-indigo-200">
                      {getAlbumTitle(song.albumId)}
                    </Badge>
                    {song.genres.map(genre => (
                      <Badge key={genre} variant="secondary" className="text-xs bg-purple-900/50 text-purple-200">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right text-sm text-purple-300 space-y-1">
                  <div>{song.duration}</div>
                  <div className="text-xs">{song.fileSize}</div>
                  <div className="text-xs">{song.fileType}</div>
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
                    onClick={() => handleDelete(song.id)}
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
    </div>
  );
}
