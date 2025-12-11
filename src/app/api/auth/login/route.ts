import { NextResponse } from 'next/server';
import { loginService, LoginInput } from '@/services/authService';

/**
 * POST /api/auth/login
 * Đăng nhập hệ thống
 */
export async function POST(request: Request) {
  try {
    const body: LoginInput = await request.json();

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email và mật khẩu là bắt buộc',
        },
        { status: 400 }
      );
    }

    // Gọi service xử lý đăng nhập
    const result = await loginService(body, request);

    // Trả kết quả
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi server',
      },
      { status: 500 }
    );
  }
}
