import axios from 'axios';
import { ApiResponse, User, Sweet, Order } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      username,
      password,
    });
    return response.data.data!;
  },

  register: async (username: string, password: string, role?: string): Promise<{ user: User; token: string }> => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      username,
      password,
      role,
    });
    return response.data.data!;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
    return response.data.data!.user;
  },
};

// Sweets API
export const sweetsAPI = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get<ApiResponse<{ sweets: Sweet[] }>>('/sweets');
    return response.data.data!.sweets;
  },

  getById: async (id: string): Promise<Sweet> => {
    const response = await api.get<ApiResponse<{ sweet: Sweet }>>(`/sweets/${id}`);
    return response.data.data!.sweet;
  },

  create: async (sweet: Omit<Sweet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sweet> => {
    const response = await api.post<ApiResponse<{ sweet: Sweet }>>('/sweets', sweet);
    return response.data.data!.sweet;
  },

  update: async (id: string, sweet: Partial<Sweet>): Promise<Sweet> => {
    const response = await api.put<ApiResponse<{ sweet: Sweet }>>(`/sweets/${id}`, sweet);
    return response.data.data!.sweet;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sweets/${id}`);
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<{ orders: Order[] }>>('/orders');
    return response.data.data!.orders;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
    return response.data.data!.order;
  },

  create: async (orderData: { customerName: string; items: { sweetId: string; quantity: number }[] }): Promise<Order> => {
    const response = await api.post<ApiResponse<{ order: Order }>>('/orders', orderData);
    return response.data.data!.order;
  },
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<{ users: User[] }>>('/users');
    return response.data.data!.users;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data.data!.user;
  },

  create: async (user: { username: string; password: string; role?: string }): Promise<User> => {
    const response = await api.post<ApiResponse<{ user: User }>>('/users', user);
    return response.data.data!.user;
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}`, user);
    return response.data.data!.user;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default api;
