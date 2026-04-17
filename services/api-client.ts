const API_BASE = '/api';

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  // Documents
  async getDocuments(workspaceId: string) {
    return fetchWithAuth(`/documents?workspaceId=${workspaceId}`);
  },

  async getDocument(id: string) {
    return fetchWithAuth(`/documents/${id}`);
  },

  async createDocument(data: Record<string, unknown>) {
    return fetchWithAuth('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDocument(id: string, data: Record<string, unknown>) {
    return fetchWithAuth(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteDocument(id: string) {
    return fetchWithAuth(`/documents/${id}`, { method: 'DELETE' });
  },

  // Projects
  async getProjects(workspaceId: string) {
    return fetchWithAuth(`/projects?workspaceId=${workspaceId}`);
  },

  async createProject(data: Record<string, unknown>) {
    return fetchWithAuth('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Sync
  async syncToDrive(documentId: string, content: string, title: string) {
    return fetchWithAuth('/sync/drive', {
      method: 'POST',
      body: JSON.stringify({ documentId, content, title }),
    });
  },
};
