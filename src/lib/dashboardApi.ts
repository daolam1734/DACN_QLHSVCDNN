// Dashboard API Client
import axios from 'axios';
import type {
  DashboardSummary,
  HoSoByDonVi,
  HoSoByLoai,
  RecentHoSo,
  TrendData
} from '@/types/dashboard';

const api = axios.create({
  baseURL: '/api/dashboard/admin',
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  console.log('Dashboard API - Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Dashboard API Response:', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Dashboard API Error:', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const dashboardApi = {
  /**
   * Lấy tổng quan thống kê
   */
  getSummary: async (): Promise<DashboardSummary> => {
    const { data } = await api.get<{ success: boolean; data: DashboardSummary }>('/summary');
    return data.data;
  },

  /**
   * Lấy thống kê theo đơn vị
   */
  getByDonVi: async (): Promise<HoSoByDonVi[]> => {
    const { data } = await api.get<{ success: boolean; data: HoSoByDonVi[] }>('/by-don-vi');
    return data.data;
  },

  /**
   * Lấy thống kê theo loại hồ sơ
   */
  getByLoai: async (): Promise<HoSoByLoai[]> => {
    const { data } = await api.get<{ success: boolean; data: HoSoByLoai[] }>('/loai-ho-so');
    return data.data;
  },

  /**
   * Lấy danh sách hồ sơ gần đây
   */
  getRecent: async (limit = 10): Promise<RecentHoSo[]> => {
    const { data } = await api.get<{ success: boolean; data: RecentHoSo[] }>('/recent', {
      params: { limit }
    });
    return data.data;
  },

  /**
   * Lấy dữ liệu xu hướng theo tháng
   */
  getTrend: async (months = 6): Promise<TrendData[]> => {
    const { data } = await api.get<{ success: boolean; data: TrendData[] }>('/trend', {
      params: { months }
    });
    return data.data;
  },

  /**
   * Lấy tất cả dữ liệu dashboard cùng lúc
   */
  getAllData: async () => {
    const [summary, byDonVi, byLoai, recent, trend] = await Promise.all([
      dashboardApi.getSummary(),
      dashboardApi.getByDonVi(),
      dashboardApi.getByLoai(),
      dashboardApi.getRecent(10),
      dashboardApi.getTrend(6)
    ]);

    return { summary, byDonVi, byLoai, recent, trend };
  }
};
