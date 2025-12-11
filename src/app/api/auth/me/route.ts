import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { getUserProfile } from '@/services/userService';

/**
 * GET /api/auth/me
 * Lấy thông tin người dùng hiện tại
 * Yêu cầu: Bearer token trong Authorization header
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Xác thực token
    const authResult = await requireAuth(request);

    if ('error' in authResult) {
      return authResult.error;
    }

    const { user } = authResult;

    // 2. Lấy thông tin profile từ database
    const result = await getUserProfile(user.ma_nguoi_dung);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || 'Phiên đăng nhập không hợp lệ',
        },
        { status: 401 }
      );
    }

    // 3. Trả về thông tin user
    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/auth/me error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi server',
      },
      { status: 500 }
    );
  }
}
