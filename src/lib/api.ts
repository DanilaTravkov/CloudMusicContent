import type {
  SongsResponse,
  AlbumsResponse,
  SingleSongResponse,
  SingleAlbumResponse,
  AlbumSongsResponse,
} from '../types/music';

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY as string;

if (!API_GATEWAY) {
  console.warn('VITE_API_GATEWAY is not set. API calls may fail.');
}

// Show API URL on page for debugging
if (typeof window !== 'undefined') {
  console.log('=== API Configuration ===');
  console.log('API_GATEWAY:', API_GATEWAY);
  console.log('Environment:', import.meta.env);
}

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    
    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } else if (contentType?.includes('text/html')) {
      errorMessage = `Server error (HTML response): ${response.statusText}`;
    } else {
      const text = await response.text();
      errorMessage = text.substring(0, 100) || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  if (!contentType?.includes('application/json')) {
    throw new Error(`Expected JSON response, got ${contentType || 'unknown'}`);
  }

  try {
    return await response.json();
  } catch (err) {
    throw new Error(`Invalid JSON response: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

// ============ SONGS ============

/**
 * Получить все песни с пагинацией
 * GET /songs
 */
export async function getSongs(limit: number = 20, lastKey?: string): Promise<SongsResponse> {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  if (lastKey) {
    params.append('last_key', lastKey);
  }

  const url = `${API_GATEWAY}/songs?${params.toString()}`;
  console.log('Fetching songs from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<SongsResponse>(response);
}

/**
 * Получить конкретную песню по ID
 * GET /songs/{songId}
 */
export async function getSongById(songId: string): Promise<SingleSongResponse> {
  const response = await fetch(`${API_GATEWAY}/songs/${songId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<SingleSongResponse>(response);
}

/**
 * Создать новую песню (требует авторизации и роли admin)
 * POST /songs
 */
export async function createSong(
  data: {
    title: string;
    artist: string;
    duration: number;
    album_id: string;
    genre?: string;
    audio_file?: string;
    file_extension?: string;
  },
  accessToken: string
): Promise<SingleSongResponse> {
  const response = await fetch(`${API_GATEWAY}/songs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<SingleSongResponse>(response);
}

/**
 * Обновить песню по ID (требует авторизации и роли admin)
 * PUT /songs/{songId}
 */
export async function updateSong(
  songId: string,
  data: {
    title?: string;
    artist?: string;
    duration?: number;
    genre?: string;
  },
  accessToken: string
): Promise<SingleSongResponse> {
  const response = await fetch(`${API_GATEWAY}/songs/${songId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<SingleSongResponse>(response);
}

/**
 * Удалить песню по ID (требует авторизации и роли admin)
 * DELETE /songs/{songId}
 */
export async function deleteSong(songId: string, accessToken: string): Promise<void> {
  const response = await fetch(`${API_GATEWAY}/songs/${songId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    await handleResponse<never>(response); // Will throw appropriate error
  }
}

// ============ ALBUMS ============

/**
 * Получить все альбомы с пагинацией
 * GET /albums
 */
export async function getAlbums(limit: number = 20, lastKey?: string): Promise<AlbumsResponse> {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  if (lastKey) {
    params.append('last_key', lastKey);
  }

  const url = `${API_GATEWAY}/albums?${params.toString()}`;
  console.log('Fetching albums from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<AlbumsResponse>(response);
}

/**
 * Получить конкретный альбом по ID
 * GET /albums/{albumId}
 */
export async function getAlbumById(albumId: string): Promise<SingleAlbumResponse> {
  const response = await fetch(`${API_GATEWAY}/albums/${albumId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<SingleAlbumResponse>(response);
}

/**
 * Получить все песни в альбоме
 * GET /albums/{albumId}/songs
 */
export async function getAlbumSongs(
  albumId: string,
  limit: number = 20,
  lastKey?: string
): Promise<AlbumSongsResponse> {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  if (lastKey) {
    params.append('last_key', lastKey);
  }

  const response = await fetch(`${API_GATEWAY}/albums/${albumId}/songs?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<AlbumSongsResponse>(response);
}

/**
 * Создать новый альбом (требует авторизации и роли admin)
 * POST /albums
 */
export async function createAlbum(
  data: {
    title: string;
    artist: string;
    release_date?: string;
    genre?: string;
    description?: string;
    cover_image_url?: string;
  },
  accessToken: string
): Promise<SingleAlbumResponse> {
  const response = await fetch(`${API_GATEWAY}/albums`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<SingleAlbumResponse>(response);
}

/**
 * Обновить альбом по ID (требует авторизации и роли admin)
 * PUT /albums/{albumId}
 */
export async function updateAlbum(
  albumId: string,
  data: {
    title?: string;
    artist?: string;
    release_date?: string;
    genre?: string;
    description?: string;
    cover_image_url?: string;
  },
  accessToken: string
): Promise<SingleAlbumResponse> {
  const response = await fetch(`${API_GATEWAY}/albums/${albumId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<SingleAlbumResponse>(response);
}

/**
 * Удалить альбом по ID (требует авторизации и роли admin)
 * DELETE /albums/{albumId}
 */
export async function deleteAlbum(albumId: string, accessToken: string): Promise<void> {
  const response = await fetch(`${API_GATEWAY}/albums/${albumId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    await handleResponse<never>(response); // Will throw appropriate error
  }
}
