import { NextRequest, NextResponse } from 'next/server';
import { withAuthorization } from '@/middleware/authorize';
import { getHoSoByDonVi } from '@/services/dashboardService';

/**
 * GET /api/dashboard/admin/by-don-vi
 * Get profile count by unit
 * Admin only
 */
export const GET = withAuthorization(
  { 
    roles: ['ADMIN'],
    permissions: ['view_all_profiles']
  },
  async (request, user) => {
    try {
      const data = await getHoSoByDonVi();

      return NextResponse.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Dashboard by unit error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Lỗi khi tải thống kê theo đơn vị'
        },
        { status: 500 }
      );
    }
  }
);
