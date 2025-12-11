// Dashboard Types
export interface DashboardSummary {
  tong_ho_so: number;
  ho_so_cho_duyet: number;
  ho_so_da_duyet: number;
  ho_so_bi_tu_choi: number;
  ho_so_dang_xu_ly: number;
}

export interface HoSoByDonVi {
  ma_don_vi: string;
  ten_don_vi: string;
  so_luong: number;
}

export interface HoSoByLoai {
  ma_loai: string;
  ten_loai: string;
  so_luong: number;
}

export interface RecentHoSo {
  ma_ho_so: string;
  ten_vien_chuc: string;
  ten_don_vi: string;
  ten_trang_thai: string;
  thoi_diem_tao: Date;
}

export interface TrendData {
  thang: string;
  so_luong: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  byDonVi: HoSoByDonVi[];
  byLoai: HoSoByLoai[];
  recent: RecentHoSo[];
  trend: TrendData[];
}
