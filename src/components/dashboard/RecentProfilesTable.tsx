import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Clock, User, Building2, FileText } from 'lucide-react';
import type { RecentHoSo } from '@/types/dashboard';

interface RecentProfilesTableProps {
  data: RecentHoSo[];
}

const statusColors: Record<string, string> = {
  'Chờ duyệt': 'bg-yellow-100 text-yellow-800',
  'Đã duyệt': 'bg-green-100 text-green-800',
  'Bị từ chối': 'bg-red-100 text-red-800',
  'Đang xử lý': 'bg-blue-100 text-blue-800'
};

export default function RecentProfilesTable({ data }: RecentProfilesTableProps) {
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Hồ sơ gần đây
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã hồ sơ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Viên chức
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn vị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian tạo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Chưa có hồ sơ nào</p>
                </td>
              </tr>
            ) : (
              safeData.map((item) => (
                <tr key={item.ma_ho_so} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {item.ma_ho_so}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{item.ten_vien_chuc}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{item.ten_don_vi}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[item.ten_trang_thai] || 'bg-gray-100 text-gray-800'}`}>
                      {item.ten_trang_thai}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(item.thoi_diem_tao), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
