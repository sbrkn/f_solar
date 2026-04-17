import { getIdToken } from '@/lib/firebase/auth';
import { API_ROUTES } from '@/lib/utils/constants';

class ApiClient {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await getIdToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async get<T>(url: string): Promise<T> {
    const headers = await this.getHeaders();
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error ?? `HTTP ${res.status}`);
    }
    return res.json();
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    const headers = await this.getHeaders();
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error ?? `HTTP ${res.status}`);
    }
    return res.json();
  }

  async put<T>(url: string, body: unknown): Promise<T> {
    const headers = await this.getHeaders();
    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error ?? `HTTP ${res.status}`);
    }
    return res.json();
  }

  async delete<T>(url: string): Promise<T> {
    const headers = await this.getHeaders();
    const res = await fetch(url, { method: 'DELETE', headers });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error ?? `HTTP ${res.status}`);
    }
    return res.json();
  }
}

export const apiClient = new ApiClient();
