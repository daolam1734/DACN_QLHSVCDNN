'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function ApprovalsPage() {
  const stats = [
    { label: 'Chờ duyệt', value: 0, icon: Clock, color: 'yellow' },
    { label: 'Đã duyệt', value: 0, icon: CheckCircle, color: 'green' },
    { label: 'Từ chối', value: 0, icon: XCircle, color: 'red' },
  ];

  return (
    <DashboardLayout title="Duyệt hồ sơ">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Duyệt hồ sơ</h2>
        <p className="text-sm text-gray-600 mt-1">Xem xét và phê duyệt các hồ sơ đi nước ngoài</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`w-12 h-12 text-${stat.color}-500`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Approvals Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Hồ sơ chờ duyệt</h3>
        </div>
        <div className="p-20 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">Không có hồ sơ chờ duyệt</p>
          <p className="text-gray-400 text-sm">
            Các hồ sơ cần duyệt sẽ hiển thị tại đây
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
