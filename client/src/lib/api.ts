import { useAuthStore } from '../store/useAuthStore';

// Auto-detect production vs development host to prevent localhost failures on Vercel
const isProdHost =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

const RENDER_BACKEND_URL = 'https://amazon-clone-backend-l9g0.onrender.com';
const LOCAL_BACKEND_URL = 'http://localhost:5000';

const envUrl = (import.meta.env.VITE_API_URL || '').trim();

// If on Vercel/production and envUrl is localhost or empty, always point to live Render backend
const resolvedApiUrl =
  isProdHost && (envUrl === '' || envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))
    ? RENDER_BACKEND_URL
    : envUrl || (isProdHost ? RENDER_BACKEND_URL : LOCAL_BACKEND_URL);

const API_BASE_URL = resolvedApiUrl.endsWith('/')
  ? resolvedApiUrl.slice(0, -1)
  : resolvedApiUrl;

interface ApiOptions extends RequestInit {
  data?: unknown;
}

/**
 * Reusable HTTP client for making API requests to the Express backend.
 * Automatically attaches Authorization header if user is logged in.
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { data, headers, ...restOptions } = options;
  const token = useAuthStore.getState().token;

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
    ...restOptions,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const responseData = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage =
      (responseData && typeof responseData === 'object' && 'message' in responseData
        ? (responseData as { message: string }).message
        : null) ||
      `Request failed with status ${response.status}`;

    const error = new Error(errorMessage);
    (error as unknown as { responseData: unknown }).responseData = responseData;
    throw error;
  }

  return responseData as T;
}

export function apiGet<T = string>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', ...options });
}

export function apiPost<T = unknown>(
  endpoint: string,
  data?: unknown,
  options: ApiOptions = {}
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', data, ...options });
}

export function apiPut<T = unknown>(
  endpoint: string,
  data?: unknown,
  options: ApiOptions = {}
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PUT', data, ...options });
}

export function apiDelete<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE', ...options });
}
