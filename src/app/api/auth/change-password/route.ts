import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { changePasswordService, ChangePasswordInput } from '@/services/passwordService';
import { createErrorResponse, createSuccessResponse, ErrorCodes } from '@/lib/api-response';

/**
 * POST /api/auth/change-password
 * Đổi mật khẩu người dùng
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Xác thực người dùng (skip password check vì đang đổi mật khẩu)
    const authResult = await requireAuth(request, { skipPasswordCheck: true });
    
    if ('error' in authResult) {
      return authResult.error;
    }

    // 2. Lấy dữ liệu từ request body
    const body: ChangePasswordInput = await request.json();

    // 3. Validate input
    if (!body.oldPassword || !body.newPassword) {
      return NextResponse.json(
        createErrorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'Mật khẩu cũ và mật khẩu mới là bắt buộc'
        ),
        { status: 400 }
      );
    }

    // 4. Gọi service đổi mật khẩu
    const result = await changePasswordService(
      authResult.user.ma_nguoi_dung,
      body
    );

    // 5. Trả kết quả
    if (result.success) {
      return NextResponse.json(
        createSuccessResponse(null, result.message),
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.BAD_REQUEST, result.message),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Change password API error:', error);
    return NextResponse.json(
      createErrorResponse(
        ErrorCodes.INTERNAL_ERROR,
        'Đã xảy ra lỗi server'
      ),
      { status: 500 }
    );
  }
}
