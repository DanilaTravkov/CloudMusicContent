// Типы данных соответствующие РЕАЛЬНОМУ API ответу

export interface Song {
  pk: string;
  sk: string;
  song_id: string;
  title: string;
  artist?: string; // может быть не в ответе
  artist_name?: string; // новое поле из бэка
  artist_id?: string;
  duration: string | number; // API возвращает строку, но может быть число
  album?: string; // например "Unknown" или название альбома
  album_id?: string; // если указано
  genre?: string;
  s3_key?: string;
  audio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Album {
  pk: string;
  sk: string;
  album_id: string;
  title: string;
  artist: string;
  release_date: string;
  genre: string;
  description: string;
  cover_image_url: string;
  total_songs: number;
  created_at: string;
  updated_at: string;
}

export interface Artist {
  pk: string;
  sk: string;
  artist_id?: string;
  name: string;
  bio?: string;
  image_url?: string;
  total_albums?: number;
  total_songs?: number;
  created_at: string;
  updated_at: string;
}

export interface SongsResponse {
  message: string;
  count: number;
  songs: Song[];
  last_key: string | null;
}

export interface AlbumsResponse {
  message: string;
  count: number;
  albums: Album[];
  last_key: string | null;
}

export interface ArtistsResponse {
  message: string;
  count: number;
  artists: Artist[];
  last_key: string | null;
}

export interface SingleSongResponse {
  message: string;
  song: Song;
}

export interface SingleAlbumResponse {
  message: string;
  album: Album;
}

export interface AlbumSongsResponse {
  message: string;
  album_id: string;
  count: number;
  songs: Song[];
  last_key: string | null;
}
