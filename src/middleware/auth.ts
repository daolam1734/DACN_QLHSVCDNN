import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware xác thực JWT token
 * Kiểm tra token từ Authorization header và giải mã
 */
export async function authenticateToken(
  request: NextRequest
): Promise<{ isValid: boolean; user?: JWTPayload; error?: string }> {
  try {
    // 1. Lấy token từ Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return {
        isValid: false,
        error: 'Không tìm thấy token xác thực',
      };
    }

    // 2. Kiểm tra format Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return {
        isValid: false,
        error: 'Format token không hợp lệ',
      };
    }

    // 3. Lấy token (bỏ prefix "Bearer ")
    const token = authHeader.substring(7);

    if (!token) {
      return {
        isValid: false,
        error: 'Token không được để trống',
      };
    }

    // 4. Xác thực và giải mã token
    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        isValid: false,
        error: 'Token không hợp lệ hoặc đã hết hạn',
      };
    }

    // 5. Kiểm tra payload có đầy đủ thông tin
    if (!decoded.ma_nguoi_dung || !decoded.email) {
      return {
        isValid: false,
        error: 'Token không chứa đủ thông tin',
      };
    }

    // 6. Trả về thông tin user từ token
    return {
      isValid: true,
      user: decoded,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      isValid: false,
      error: 'Lỗi xác thực token',
    };
  }
}

/**
 * Wrapper để bảo vệ API routes
 * Sử dụng: const result = await requireAuth(request);
 */
export async function requireAuth(request: NextRequest, options?: { skipPasswordCheck?: boolean }) {
  const authResult = await authenticateToken(request);

  if (!authResult.isValid) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: authResult.error || 'Phiên đăng nhập không hợp lệ',
        },
        { status: 401 }
      ),
    };
  }

  // Nếu skipPasswordCheck = true, không kiểm tra phải đổi mật khẩu
  // Dùng cho endpoint /auth/change-password
  if (options?.skipPasswordCheck) {
    return {
      user: authResult.user!,
    };
  }

  // Kiểm tra người dùng có phải đổi mật khẩu không
  try {
    const user = await prisma.nguoiDung.findUnique({
      where: { maNguoiDung: authResult.user!.ma_nguoi_dung },
      select: { phaiDoiMatKhau: true },
    });

    if (user && user.phaiDoiMatKhau) {
      return {
        error: NextResponse.json(
          {
            success: false,
            message: 'Bạn phải đổi mật khẩu trước khi sử dụng hệ thống',
            code: 'PASSWORD_CHANGE_REQUIRED',
          },
          { status: 403 }
        ),
      };
    }
  } catch (error) {
    console.error('Error checking password change requirement:', error);
  }

  return {
    user: authResult.user!,
  };
}
