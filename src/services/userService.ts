import { prisma } from '@/lib/prisma';

export interface UserProfile {
  ma_nguoi_dung: number;
  ho_ten: string;
  email: string;
  so_dien_thoai?: string | null;
  gioi_tinh?: string | null;
  trang_thai: string;
  vai_tro: Array<{
    ma_vai_tro: number;
    ten_vai_tro: string;
    ma_vai_tro_key: string;
  }>;
  don_vi: {
    ma_don_vi: number;
    ten_don_vi: string;
  } | null;
}

/**
 * Lấy thông tin profile người dùng
 */
export async function getUserProfile(maNguoiDung: number): Promise<{
  success: boolean;
  data?: UserProfile;
  message?: string;
}> {
  try {
    // 1. Truy vấn thông tin người dùng với quan hệ
    const user = await prisma.nguoiDung.findUnique({
      where: {
        maNguoiDung: maNguoiDung,
      },
      select: {
        maNguoiDung: true,
        hoTen: true,
        email: true,
        trangThai: true,
        nguoiDungVaiTro: {
          select: {
            vaiTro: {
              select: {
                maVaiTro: true,
                tenVaiTro: true,
                maVaiTroKey: true,
              },
            },
          },
        },
        vienChuc: {
          select: {
            maDonVi: true,
            donVi: {
              select: {
                maDonVi: true,
                tenDonVi: true,
              },
            },
          },
        },
      },
    });

    // 2. Kiểm tra user tồn tại
    if (!user) {
      return {
        success: false,
        message: 'Người dùng không tồn tại',
      };
    }

    // 3. Kiểm tra trạng thái tài khoản
    if (user.trangThai !== 'active') {
      return {
        success: false,
        message: 'Phiên đăng nhập không hợp lệ',
      };
    }

    // 4. Lấy thông tin vai trò
    const vaiTroList = user.nguoiDungVaiTro.map((ndvt: any) => ({
      ma_vai_tro: ndvt.vaiTro.maVaiTro,
      ten_vai_tro: ndvt.vaiTro.tenVaiTro,
      ma_vai_tro_key: ndvt.vaiTro.maVaiTroKey,
    }));

    // 5. Lấy thông tin đơn vị
    const donViInfo = user.vienChuc?.donVi
      ? {
          ma_don_vi: user.vienChuc.donVi.maDonVi,
          ten_don_vi: user.vienChuc.donVi.tenDonVi,
        }
      : null;

    // 6. Tạo response data
    const profileData: UserProfile = {
      ma_nguoi_dung: user.maNguoiDung,
      ho_ten: user.hoTen,
      email: user.email,
      so_dien_thoai: null, // TODO: Thêm sau khi có field trong schema
      gioi_tinh: null, // TODO: Thêm sau khi có field trong schema
      trang_thai: user.trangThai,
      vai_tro: vaiTroList,
      don_vi: donViInfo,
    };

    return {
      success: true,
      data: profileData,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      message: 'Lỗi khi lấy thông tin người dùng',
    };
  }
}
