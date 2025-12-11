import { NextRequest, NextResponse } from 'next/server';
import { withAuthorization } from '@/middleware/authorize';
import { getHoSoByLoai } from '@/services/dashboardService';

/**
 * GET /api/dashboard/admin/loai-ho-so
 * Get profile count by type
 * Admin only
 */
export const GET = withAuthorization(
  { 
    roles: ['ADMIN'],
    permissions: ['view_all_profiles']
  },
  async (request, user) => {
    try {
      const data = await getHoSoByLoai();

      return NextResponse.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Dashboard by type error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Lỗi khi tải thống kê theo loại hồ sơ'
        },
        { status: 500 }
      );
    }
  }
);
