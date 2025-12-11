'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { BarChart3, Download, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  return (
    <DashboardLayout title="Báo cáo">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Báo cáo thống kê</h2>
        <p className="text-sm text-gray-600 mt-1">Xem và xuất các báo cáo về hồ sơ đi nước ngoài</p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <BarChart3 className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Báo cáo tổng quan</h3>
          <p className="text-sm text-gray-600 mb-4">Thống kê tổng hợp các hồ sơ theo thời gian</p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xem chi tiết →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <TrendingUp className="w-10 h-10 text-green-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Báo cáo theo đơn vị</h3>
          <p className="text-sm text-gray-600 mb-4">Thống kê hồ sơ phân theo từng đơn vị</p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xem chi tiết →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Download className="w-10 h-10 text-purple-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Xuất báo cáo</h3>
          <p className="text-sm text-gray-600 mb-4">Xuất dữ liệu ra file Excel, PDF</p>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xuất ngay →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
