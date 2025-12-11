import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateAccessToken, JWTPayload } from '@/lib/jwt';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    ma_nguoi_dung: number;
    email: string;
    ho_ten: string;
    ma_vai_tro?: number | null;
    ma_don_vi?: number | null;
    phai_doi_mat_khau: boolean;
  };
}

/**
 * Kiểm tra email có đúng domain @tvu.edu.vn không
 */
function isValidTVUEmail(email: string): boolean {
  return email.toLowerCase().endsWith('@tvu.edu.vn');
}

/**
 * Lấy địa chỉ IP từ request
 */
function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Lấy thông tin thiết bị từ User-Agent
 */
function getDeviceInfo(request: Request): string {
  return request.headers.get('user-agent') || 'Unknown Device';
}

/**
 * Ghi lịch sử đăng nhập
 */
async function logLoginHistory(
  maNguoiDung: number,
  request: Request,
  ketQua: 'success' | 'failed'
): Promise<void> {
  try {
    await prisma.lichSuDangNhap.create({
      data: {
        maNguoiDung,
        ip: getClientIP(request),
        thietBi: getDeviceInfo(request),
        ketQua,
      },
    });
  } catch (error) {
    console.error('Error logging login history:', error);
  }
}

/**
 * Xử lý đăng nhập
 */
export async function loginService(
  input: LoginInput,
  request: Request
): Promise<LoginResponse> {
  const { email, password } = input;

  // 1. Kiểm tra email domain @tvu.edu.vn
  if (!isValidTVUEmail(email)) {
    return {
      success: false,
      message: 'Email hoặc mật khẩu không đúng',
    };
  }

  try {
    // 2. Tìm người dùng theo email
    const user = await prisma.nguoiDung.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        maNguoiDung: true,
        email: true,
        matKhauHash: true,
        hoTen: true,
        phaiDoiMatKhau: true,
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
          },
        },
      },
    });

    // 3. Kiểm tra người dùng tồn tại
    if (!user) {
      return {
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      };
    }

    // 4. Kiểm tra trạng thái active
    if (user.trangThai !== 'active') {
      await logLoginHistory(user.maNguoiDung, request, 'failed');
      return {
        success: false,
        message: 'Tài khoản đã bị khóa hoặc không hoạt động',
      };
    }

    // 5. Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.matKhauHash);
    
    if (!isPasswordValid) {
      await logLoginHistory(user.maNguoiDung, request, 'failed');
      return {
        success: false,
        message: 'Email hoặc mật khẩu không đúng',
      };
    }

    // 6. Tạo JWT token
    const roles = user.nguoiDungVaiTro.map(ndvt => ndvt.vaiTro.maVaiTroKey);
    const tokenPayload: JWTPayload = {
      ma_nguoi_dung: user.maNguoiDung,
      email: user.email,
      roles: roles,
      ma_don_vi: user.vienChuc?.maDonVi || null,
    };

    const token = generateAccessToken(tokenPayload);

    // 7. Ghi lịch sử đăng nhập thành công
    await logLoginHistory(user.maNguoiDung, request, 'success');

    // 8. Trả kết quả
    return {
      success: true,
      token,
      user: {
        ma_nguoi_dung: user.maNguoiDung,
        email: user.email,
        ho_ten: user.hoTen,
        ma_vai_tro: user.nguoiDungVaiTro[0]?.vaiTro.maVaiTro || null,
        ma_don_vi: user.vienChuc?.maDonVi || null,
        phai_doi_mat_khau: user.phaiDoiMatKhau,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi trong quá trình đăng nhập',
    };
  }
}
