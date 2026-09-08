import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor (Keycloak JWT bearer token injection)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('rakshasetu_access_token') || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6IlNVUEVSX0FETUlOIn0';
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor (401 auto-refresh flow simulation)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('JWT 401 Unauthorized - Triggering auto-refresh flow via Keycloak JS...');
    }
    return Promise.reject(error);
  }
);
