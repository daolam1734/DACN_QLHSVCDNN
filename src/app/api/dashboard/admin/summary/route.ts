import { NextRequest, NextResponse } from 'next/server';
import { withAuthorization } from '@/middleware/authorize';
import { getDashboardSummary } from '@/services/dashboardService';

/**
 * GET /api/dashboard/admin/summary
 * Get dashboard summary statistics
 * Admin only - requires ADMIN role or manage_users permission
 */
export const GET = withAuthorization(
  { 
    roles: ['ADMIN'],
    permissions: ['view_all_profiles']
  },
  async (request, user) => {
    try {
      const summary = await getDashboardSummary();

      return NextResponse.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Dashboard summary error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Lỗi khi tải thống kê dashboard'
        },
        { status: 500 }
      );
    }
  }
);
