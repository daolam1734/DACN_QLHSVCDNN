import { NextRequest, NextResponse } from 'next/server';
import { withAuthorization } from '@/middleware/authorize';
import { getHoSoTrend } from '@/services/dashboardService';

/**
 * GET /api/dashboard/admin/trend
 * Get trend data for charts
 * Admin only
 * Query params: months (default 6, max 12)
 */
export const GET = withAuthorization(
  { 
    roles: ['ADMIN'],
    permissions: ['view_all_profiles']
  },
  async (request, user) => {
    try {
      const { searchParams } = new URL(request.url);
      const monthsParam = searchParams.get('months');
      const months = monthsParam ? Math.min(parseInt(monthsParam), 12) : 6;

      if (isNaN(months) || months < 1) {
        return NextResponse.json(
          {
            success: false,
            message: 'Tham số months không hợp lệ'
          },
          { status: 400 }
        );
      }

      const data = await getHoSoTrend(months);

      return NextResponse.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Dashboard trend error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Lỗi khi tải dữ liệu xu hướng'
        },
        { status: 500 }
      );
    }
  }
);
