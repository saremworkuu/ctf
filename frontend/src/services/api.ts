import { ApiNFT, ApiCartItem, ApiOrder, ApiUser, AuthResponse } from '../types';

// Use relative path in production (Vercel) to avoid cross-domain issues
// Use localhost:5000 in development
const BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiRegister(
  username: string,
  email: string,
  password: string,
  archiveSignature: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, archiveSignature }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function apiLogin(
  username: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<AuthResponse>(res);
}

// ─── NFTs ─────────────────────────────────────────────────────────────────────

export async function apiGetNFTs(): Promise<ApiNFT[]> {
  const res = await fetch(`${BASE_URL}/nfts`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<ApiNFT[]>(res);
}

export async function apiGetNFT(id: number): Promise<ApiNFT> {
  const res = await fetch(`${BASE_URL}/nfts/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<ApiNFT>(res);
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function apiGetCart(): Promise<ApiCartItem[]> {
  const res = await fetch(`${BASE_URL}/cart`, {
    headers: authHeaders(),
  });
  return handleResponse<ApiCartItem[]>(res);
}

export async function apiAddToCart(nftId: number): Promise<ApiCartItem> {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ nftId }),
  });
  return handleResponse<ApiCartItem>(res);
}

export async function apiRemoveFromCart(nftId: number): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/cart/${nftId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse<{ message: string }>(res);
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function apiCreateOrder(): Promise<{ message: string; orders: ApiOrder[] }> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<{ message: string; orders: ApiOrder[] }>(res);
}

export async function apiGetOrder(id: number): Promise<ApiOrder> {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse<ApiOrder>(res);
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function apiGetMe(): Promise<ApiUser> {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: authHeaders(),
  });
  return handleResponse<ApiUser>(res);
}

export async function apiGetUser(id: number): Promise<ApiUser> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse<ApiUser>(res);
}

export async function apiUpdateProfile(data: { email?: string; archiveSignature?: string }): Promise<{ message: string; user: ApiUser }> {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<{ message: string; user: ApiUser }>(res);
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function apiHealth(): Promise<{ status: string; db: string }> {
  const res = await fetch(`${BASE_URL}/health`);
  return handleResponse<{ status: string; db: string }>(res);
}
