'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { User, FileText } from 'lucide-react';

export default function MyProfilesPage() {
  return (
    <DashboardLayout title="Hồ sơ của tôi">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Hồ sơ của tôi</h2>
        <p className="text-sm text-gray-600 mt-1">Xem và quản lý các hồ sơ cá nhân đã tạo</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-20 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium mb-2">Chưa có hồ sơ nào</p>
        <p className="text-gray-400 text-sm mb-6">
          Bạn chưa tạo hồ sơ nào. Tạo hồ sơ mới để bắt đầu.
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Tạo hồ sơ mới
        </button>
      </div>
    </DashboardLayout>
  );
}
