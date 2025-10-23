/**
 * Authentication API Service
 * Handles all auth operations: register, login, refresh tokens
 */

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  given_name: string;
  family_name: string;
  birthdate: string; // YYYY-MM-DD
}

export interface RegisterResponse {
  message: string;
  user_sub: string;
  username: string;
  email: string;
}

export interface ConfirmRequest {
  username: string;
  confirmation_code: string;
}

export interface ConfirmResponse {
  message: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  message: string;
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Helper function to handle auth API responses
 */
async function handleAuthResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  console.log('[Auth API Response]', {
    status: response.status,
    ok: response.ok,
    contentType,
    statusText: response.statusText,
  });

  if (!response.ok) {
    let errorMessage = 'Unknown error';

    if (contentType?.includes('application/json')) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
    } else {
      const text = await response.text();
      errorMessage = text || `HTTP ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  if (contentType?.includes('application/json')) {
    try {
      const data = await response.json();
      console.log('[Auth API] Successfully parsed JSON response', { keys: Object.keys(data) });
      return data;
    } catch (e) {
      console.error('[Auth API] Failed to parse JSON response:', e);
      throw new Error('Failed to parse response');
    }
  }

  console.error('[Auth API] Unexpected content type:', contentType);
  throw new Error('Invalid response format');
}

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  console.log('[Auth API] POST /auth/register', {
    username: data.username,
    email: data.email,
  });

  const response = await fetch(`${API_GATEWAY}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleAuthResponse<RegisterResponse>(response);
}

/**
 * Confirm user email with confirmation code
 */
export async function confirmEmail(data: ConfirmRequest): Promise<ConfirmResponse> {
  console.log('[Auth API] POST /auth/confirm', {
    username: data.username,
  });

  const response = await fetch(`${API_GATEWAY}/auth/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleAuthResponse<ConfirmResponse>(response);
}

/**
 * Login user and get tokens
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  console.log('[Auth API] POST /auth/login', {
    username: data.username,
  });

  const response = await fetch(`${API_GATEWAY}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleAuthResponse<LoginResponse>(response);
}

/**
 * Refresh tokens using refresh token
 */
export async function refreshTokens(
  refreshToken: string
): Promise<RefreshResponse> {
  console.log('[Auth API] POST /auth/refresh');

  const response = await fetch(`${API_GATEWAY}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  return handleAuthResponse<RefreshResponse>(response);
}
