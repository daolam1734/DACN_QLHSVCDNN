import { NextRequest, NextResponse } from 'next/server';
import { withAuthorization } from '@/middleware/authorize';
import { getRecentHoSo } from '@/services/dashboardService';

/**
 * GET /api/dashboard/admin/recent
 * Get recent profiles
 * Admin only
 * Query params: limit (default 10, max 50)
 */
export const GET = withAuthorization(
  { 
    roles: ['ADMIN'],
    permissions: ['view_all_profiles']
  },
  async (request, user) => {
    try {
      const { searchParams } = new URL(request.url);
      const limitParam = searchParams.get('limit');
      const limit = limitParam ? Math.min(parseInt(limitParam), 50) : 10;

      if (isNaN(limit) || limit < 1) {
        return NextResponse.json(
          {
            success: false,
            message: 'Tham số limit không hợp lệ'
          },
          { status: 400 }
        );
      }

      const data = await getRecentHoSo(limit);

      return NextResponse.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Dashboard recent profiles error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Lỗi khi tải danh sách hồ sơ mới nhất'
        },
        { status: 500 }
      );
    }
  }
);
