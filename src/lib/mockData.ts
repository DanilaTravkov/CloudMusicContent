export interface Artist {
  id: string;
  name: string;
  biography: string;
  genres: string[];
  imageUrl: string;
}

export interface Song {
  id: string;
  title: string;
  artistIds: string[];
  albumId?: string;
  genres: string[];
  imageUrl: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  createdAt: string;
  lastModified: string;
  duration: string;
}

export interface Album {
  id: string;
  title: string;
  artistIds: string[];
  genres: string[];
  imageUrl: string;
  releaseDate: string;
  songIds: string[];
}

export const mockGenres = [
  'Rock',
  'Pop',
  'Hip Hop',
  'Electronic',
  'Jazz',
  'Classical',
  'R&B',
  'Country',
  'Metal',
  'Indie'
];

export const mockArtists: Artist[] = [
  {
    id: 'artist-1',
    name: 'The Midnight Riders',
    biography: 'A rock band known for their electrifying performances and powerful lyrics. Formed in 2015, they have released 3 studio albums and toured worldwide.',
    genres: ['Rock', 'Indie'],
    imageUrl: 'https://images.unsplash.com/photo-1699545002038-ff1aca1dc3e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMGd1aXRhcnxlbnwxfHx8fDE3NjEwNDY3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'artist-2',
    name: 'Luna Eclipse',
    biography: 'Electronic music producer and DJ pushing the boundaries of sound. Known for atmospheric beats and experimental soundscapes.',
    genres: ['Electronic', 'Pop'],
    imageUrl: 'https://images.unsplash.com/photo-1692176548571-86138128e36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBkanxlbnwxfHx8fDE3NjA5NTc0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'artist-3',
    name: 'Marcus Stone',
    biography: 'Hip hop artist and lyricist bringing authentic storytelling to modern rap. Winner of multiple awards for innovative wordplay.',
    genres: ['Hip Hop', 'R&B'],
    imageUrl: 'https://images.unsplash.com/photo-1621976498727-9e5d56476276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjBhcnRpc3R8ZW58MXx8fHwxNzYwOTczMzk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'artist-4',
    name: 'Sophia Rivers',
    biography: 'Jazz vocalist with a contemporary twist. Her smooth vocals and emotional depth have captivated audiences worldwide.',
    genres: ['Jazz', 'Pop'],
    imageUrl: 'https://images.unsplash.com/photo-1593459866242-426f7768f3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMG11c2ljaWFufGVufDF8fHx8MTc2MTA2Njg0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export const mockAlbums: Album[] = [
  {
    id: 'album-1',
    title: 'Night Drive',
    artistIds: ['artist-1'],
    genres: ['Rock', 'Indie'],
    imageUrl: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzYwOTgxOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    releaseDate: '2024-01-15',
    songIds: ['song-1', 'song-2', 'song-3']
  },
  {
    id: 'album-2',
    title: 'Electric Dreams',
    artistIds: ['artist-2'],
    genres: ['Electronic', 'Pop'],
    imageUrl: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzYwOTgxOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    releaseDate: '2024-06-20',
    songIds: ['song-4', 'song-5']
  }
];

export const mockSongs: Song[] = [
  {
    id: 'song-1',
    title: 'Highway Lights',
    artistIds: ['artist-1'],
    albumId: 'album-1',
    genres: ['Rock', 'Indie'],
    imageUrl: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzYwOTgxOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fileName: 'highway-lights.mp3',
    fileType: 'audio/mpeg',
    fileSize: '8.5 MB',
    createdAt: '2024-01-10T10:30:00Z',
    lastModified: '2024-01-12T14:20:00Z',
    duration: '3:45'
  },
  {
    id: 'song-2',
    title: 'Echoes of Tomorrow',
    artistIds: ['artist-1'],
    albumId: 'album-1',
    genres: ['Rock', 'Indie'],
    imageUrl: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzYwOTgxOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fileName: 'echoes-of-tomorrow.mp3',
    fileType: 'audio/mpeg',
    fileSize: '7.2 MB',
    createdAt: '2024-01-10T11:00:00Z',
    lastModified: '2024-01-12T14:25:00Z',
    duration: '4:12'
  },
  {
    id: 'song-3',
    title: 'Midnight Run',
    artistIds: ['artist-1'],
    albumId: 'album-1',
    genres: ['Rock', 'Indie'],
    imageUrl: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzYwOTgxOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fileName: 'midnight-run.mp3',
    fileType: 'audio/mpeg',
    fileSize: '9.1 MB',
    createdAt: '2024-01-10T12:00:00Z',
    lastModified: '2024-01-12T14:30:00Z',
    duration: '5:02'
  },
  {
    id: 'song-4',
    title: 'Neon Pulse',
    artistIds: ['artist-2'],
    albumId: 'album-2',
    genres: ['Electronic', 'Pop'],
    imageUrl: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzYwOTgxOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fileName: 'neon-pulse.mp3',
    fileType: 'audio/mpeg',
    fileSize: '6.8 MB',
    createdAt: '2024-06-15T09:00:00Z',
    lastModified: '2024-06-18T16:00:00Z',
    duration: '3:28'
  },
  {
    id: 'song-5',
    title: 'Starlight Memories',
    artistIds: ['artist-2'],
    albumId: 'album-2',
    genres: ['Electronic', 'Pop'],
    imageUrl: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzYwOTgxOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fileName: 'starlight-memories.mp3',
    fileType: 'audio/mpeg',
    fileSize: '7.5 MB',
    createdAt: '2024-06-15T10:30:00Z',
    lastModified: '2024-06-18T16:15:00Z',
    duration: '4:05'
  },
  {
    id: 'song-6',
    title: 'City Lights (Single)',
    artistIds: ['artist-3'],
    genres: ['Hip Hop', 'R&B'],
    imageUrl: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzYwOTgxOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fileName: 'city-lights.mp3',
    fileType: 'audio/mpeg',
    fileSize: '5.9 MB',
    createdAt: '2024-09-01T14:00:00Z',
    lastModified: '2024-09-03T10:00:00Z',
    duration: '3:15'
  },
  {
    id: 'song-7',
    title: 'Velvet Sky (Single)',
    artistIds: ['artist-4'],
    genres: ['Jazz', 'Pop'],
    imageUrl: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwdmlueWx8ZW58MXx8fHwxNzYwOTgxOTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    fileName: 'velvet-sky.mp3',
    fileType: 'audio/mpeg',
    fileSize: '6.2 MB',
    createdAt: '2024-08-15T11:30:00Z',
    lastModified: '2024-08-17T09:00:00Z',
    duration: '3:52'
  }
];
