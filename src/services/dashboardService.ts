import { prisma } from '@/lib/prisma';

/**
 * Dashboard Summary Statistics
 */
export interface DashboardSummary {
  tong_ho_so: number;
  ho_so_cho_duyet: number;
  ho_so_da_duyet: number;
  ho_so_bi_tu_choi: number;
  ho_so_dang_xu_ly: number;
}

/**
 * Statistics by Unit
 */
export interface HoSoByDonVi {
  ma_don_vi: number;
  ten_don_vi: string;
  so_luong: number;
}

/**
 * Statistics by Profile Type
 */
export interface HoSoByLoai {
  ma_loai_ho_so: number;
  ten_loai_ho_so: string;
  so_luong: number;
}

/**
 * Recent Profile Item
 */
export interface RecentHoSo {
  ma_ho_so: number;
  tieu_de: string | null;
  muc_dich: string | null;
  quoc_gia: string | null;
  thoi_gian_bat_dau: Date | null;
  trang_thai: string;
  ho_ten_vien_chuc: string;
  ten_don_vi: string;
  thoi_diem_tao: Date;
}

/**
 * Get dashboard summary statistics
 * Optimized with single query using aggregation
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  // Get all profiles with their status
  const profiles = await prisma.hoSoDiNuocNgoai.findMany({
    select: {
      maHoSo: true,
      trangThai: {
        select: {
          tenTrangThai: true
        }
      }
    }
  });

  // Count by status
  const summary: DashboardSummary = {
    tong_ho_so: profiles.length,
    ho_so_cho_duyet: 0,
    ho_so_da_duyet: 0,
    ho_so_bi_tu_choi: 0,
    ho_so_dang_xu_ly: 0
  };

  profiles.forEach((profile: any) => {
    const status = profile.trangThai.tenTrangThai.toLowerCase();
    
    if (status.includes('chờ') || status.includes('mới')) {
      summary.ho_so_cho_duyet++;
    } else if (status.includes('duyệt') || status.includes('hoàn thành')) {
      summary.ho_so_da_duyet++;
    } else if (status.includes('từ chối') || status.includes('hủy')) {
      summary.ho_so_bi_tu_choi++;
    } else {
      summary.ho_so_dang_xu_ly++;
    }
  });

  return summary;
}

/**
 * Get profile count by unit
 * Uses GROUP BY for efficient aggregation
 */
export async function getHoSoByDonVi(): Promise<HoSoByDonVi[]> {
  const result = await prisma.hoSoDiNuocNgoai.groupBy({
    by: ['maVienChuc'],
    _count: {
      maHoSo: true
    }
  });

  // Get unit details
  const vienChucIds = result.map((r: any) => r.maVienChuc);
  const vienChucs = await prisma.vienChuc.findMany({
    where: {
      maVienChuc: {
        in: vienChucIds
      }
    },
    include: {
      donVi: true
    }
  });

  // Map to units
  const unitMap = new Map<number, { tenDonVi: string; count: number }>();
  
  result.forEach((item: any) => {
    const vienChuc = vienChucs.find((vc: any) => vc.maVienChuc === item.maVienChuc);
    if (vienChuc && vienChuc.donVi) {
      const existing = unitMap.get(vienChuc.maDonVi);
      if (existing) {
        existing.count += item._count.maHoSo;
      } else {
        unitMap.set(vienChuc.maDonVi, {
          tenDonVi: vienChuc.donVi.tenDonVi,
          count: item._count.maHoSo
        });
      }
    }
  });

  return Array.from(unitMap.entries()).map(([maDonVi, data]) => ({
    ma_don_vi: maDonVi,
    ten_don_vi: data.tenDonVi,
    so_luong: data.count
  })).sort((a, b) => b.so_luong - a.so_luong);
}

/**
 * Get profile count by type
 * Efficient GROUP BY query
 */
export async function getHoSoByLoai(): Promise<HoSoByLoai[]> {
  const result = await prisma.hoSoDiNuocNgoai.groupBy({
    by: ['maLoaiHoSo'],
    _count: {
      maHoSo: true
    },
    orderBy: {
      _count: {
        maHoSo: 'desc'
      }
    }
  });

  // Get type names
  const typeIds = result.map((r: any) => r.maLoaiHoSo);
  const types = await prisma.loaiHoSo.findMany({
    where: {
      maLoaiHoSo: {
        in: typeIds
      }
    }
  });

  return result.map((item: any) => {
    const type = types.find((t: any) => t.maLoaiHoSo === item.maLoaiHoSo);
    return {
      ma_loai_ho_so: item.maLoaiHoSo,
      ten_loai_ho_so: type?.tenLoaiHoSo || 'Không xác định',
      so_luong: item._count.maHoSo
    };
  });
}

/**
 * Get recent profiles
 * Optimized with pagination and selective fields
 */
export async function getRecentHoSo(limit: number = 10): Promise<RecentHoSo[]> {
  const profiles = await prisma.hoSoDiNuocNgoai.findMany({
    take: limit,
    orderBy: {
      thoiDiemTao: 'desc'
    },
    select: {
      maHoSo: true,
      tieuDe: true,
      mucDich: true,
      quocGia: true,
      thoiGianBatDau: true,
      thoiDiemTao: true,
      trangThai: {
        select: {
          tenTrangThai: true
        }
      },
      vienChuc: {
        select: {
          nguoiDung: {
            select: {
              hoTen: true
            }
          },
          donVi: {
            select: {
              tenDonVi: true
            }
          }
        }
      }
    }
  });

  return profiles.map((p: any) => ({
    ma_ho_so: p.maHoSo,
    tieu_de: p.tieuDe,
    muc_dich: p.mucDich,
    quoc_gia: p.quocGia,
    thoi_gian_bat_dau: p.thoiGianBatDau,
    trang_thai: p.trangThai.tenTrangThai,
    ho_ten_vien_chuc: p.vienChuc.nguoiDung.hoTen,
    ten_don_vi: p.vienChuc.donVi.tenDonVi,
    thoi_diem_tao: p.thoiDiemTao
  }));
}

/**
 * Get trend data (monthly statistics)
 * For charts showing profile creation over time
 */
export interface TrendData {
  thang: string;
  so_luong: number;
}

export async function getHoSoTrend(months: number = 6): Promise<TrendData[]> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const profiles = await prisma.hoSoDiNuocNgoai.findMany({
    where: {
      thoiDiemTao: {
        gte: startDate
      }
    },
    select: {
      thoiDiemTao: true
    }
  });

  // Group by month
  const monthMap = new Map<string, number>();
  
  profiles.forEach((p: any) => {
    const monthKey = `${p.thoiDiemTao.getFullYear()}-${String(p.thoiDiemTao.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
  });

  // Generate all months in range
  const result: TrendData[] = [];
  const current = new Date(startDate);
  
  while (current <= new Date()) {
    const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    result.push({
      thang: monthKey,
      so_luong: monthMap.get(monthKey) || 0
    });
    current.setMonth(current.getMonth() + 1);
  }

  return result;
}
