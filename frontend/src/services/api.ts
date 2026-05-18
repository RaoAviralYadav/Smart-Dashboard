import axios, { AxiosInstance } from 'axios';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (email: string, password: string, firstName: string, lastName: string) =>
    api.post('/auth/register', { email, password, firstName, lastName }),
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password })
};

// Lead endpoints
export const leadAPI = {
  create: (name: string, email: string, status: string, source: string) =>
    api.post<Lead>('/leads', { name, email, status, source }),
  getAll: (page: number = 1, status?: string, source?: string, search?: string, sort: string = 'latest') => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (status) params.append('status', status);
    if (source) params.append('source', source);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    return api.get<LeadsResponse>(`/leads?${params.toString()}`);
  },
  getOne: (id: string) =>
    api.get<Lead>(`/leads/${id}`),
  update: (id: string, data: Partial<Lead>) =>
    api.put<Lead>(`/leads/${id}`, data),
  delete: (id: string) =>
    api.delete(`/leads/${id}`),
  export: (status?: string, source?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (source) params.append('source', source);
    if (search) params.append('search', search);
    return api.get(`/leads/export/csv?${params.toString()}`, { responseType: 'blob' });
  }
};

export default api;
