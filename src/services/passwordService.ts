import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Đổi mật khẩu cho người dùng
 */
export async function changePasswordService(
  maNguoiDung: number,
  input: ChangePasswordInput
): Promise<ChangePasswordResponse> {
  const { oldPassword, newPassword } = input;

  try {
    // 1. Lấy thông tin người dùng
    const user = await prisma.nguoiDung.findUnique({
      where: { maNguoiDung },
      select: {
        matKhauHash: true,
        trangThai: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Người dùng không tồn tại',
      };
    }

    // 2. Kiểm tra trạng thái
    if (user.trangThai !== 'active') {
      return {
        success: false,
        message: 'Tài khoản không hoạt động',
      };
    }

    // 3. Kiểm tra mật khẩu cũ
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.matKhauHash);
    
    if (!isOldPasswordValid) {
      return {
        success: false,
        message: 'Mật khẩu cũ không đúng',
      };
    }

    // 4. Validate mật khẩu mới
    if (newPassword.length < 6) {
      return {
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      };
    }

    if (oldPassword === newPassword) {
      return {
        success: false,
        message: 'Mật khẩu mới phải khác mật khẩu cũ',
      };
    }

    // 5. Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // 6. Cập nhật mật khẩu và đặt phaiDoiMatKhau = false
    await prisma.nguoiDung.update({
      where: { maNguoiDung },
      data: {
        matKhauHash: newPasswordHash,
        phaiDoiMatKhau: false,
        thoiDiemCapNhat: new Date(),
      },
    });

    return {
      success: true,
      message: 'Đổi mật khẩu thành công',
    };
  } catch (error) {
    console.error('Change password error:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi trong quá trình đổi mật khẩu',
    };
  }
}
