'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  Users as UsersIcon,
  MapPin,
  Mail,
  Phone,
  Loader2,
  ExternalLink,
  Archive
} from 'lucide-react';

interface Unit {
  ma_don_vi: number;
  ten_don_vi: string;
  ma_don_vi_parent?: number;
  ten_don_vi_parent?: string;
  dia_chi?: string;
  email?: string;
  so_dien_thoai?: string;
  dien_tich?: number;
  trang_thai: 'active' | 'inactive';
  so_nhan_vien: number;
  so_hoso: number;
  ngay_tao: string;
}

export default function SystemUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // TODO: Fetch units from API
    // Temporary mock data
    const mockUnits: Unit[] = [
      {
        ma_don_vi: 1,
        ten_don_vi: 'Khoa Công nghệ Thông tin',
        dia_chi: '123 Đường A, Quận 1, TP.HCM',
        email: 'cntt@tvu.edu.vn',
        so_dien_thoai: '(028) 1234 5678',
        dien_tich: 5000,
        trang_thai: 'active',
        so_nhan_vien: 45,
        so_hoso: 42,
        ngay_tao: '2025-01-01'
      },
      {
        ma_don_vi: 2,
        ten_don_vi: 'Khoa Kinh tế',
        dia_chi: '123 Đường B, Quận 2, TP.HCM',
        email: 'kinh-te@tvu.edu.vn',
        so_dien_thoai: '(028) 2345 6789',
        dien_tich: 3500,
        trang_thai: 'active',
        so_nhan_vien: 32,
        so_hoso: 28,
        ngay_tao: '2025-01-01'
      },
      {
        ma_don_vi: 3,
        ten_don_vi: 'Phòng Quản lý Hành chính',
        dia_chi: '123 Đường C, Quận 3, TP.HCM',
        email: 'admin@tvu.edu.vn',
        so_dien_thoai: '(028) 3456 7890',
        dien_tich: 2000,
        trang_thai: 'active',
        so_nhan_vien: 15,
        so_hoso: 0,
        ngay_tao: '2025-01-01'
      },
      {
        ma_don_vi: 4,
        ten_don_vi: 'Khoa Ngoại ngữ',
        dia_chi: '456 Đường D, Quận 4, TP.HCM',
        email: 'ngoai-ngu@tvu.edu.vn',
        so_dien_thoai: '(028) 4567 8901',
        dien_tich: 4000,
        trang_thai: 'inactive',
        so_nhan_vien: 28,
        so_hoso: 0,
        ngay_tao: '2025-01-05'
      }
    ];
    
    setUnits(mockUnits);
    setLoading(false);
  }, []);

  const filteredUnits = units.filter(unit => {
    const matchSearch = 
      unit.ten_don_vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || unit.trang_thai === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700'
    };
    
    const labels = {
      active: 'Hoạt động',
      inactive: 'Không hoạt động'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Quản lý Đơn vị">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Quản lý Đơn vị">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              Quản lý Đơn vị
            </h1>
            <p className="text-gray-600 mt-1">Quản lý cấu trúc và thông tin các đơn vị</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Thêm đơn vị
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng đơn vị</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{units.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {units.filter(u => u.trang_thai === 'active').length}
                </p>
              </div>
              <Archive className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {units.reduce((acc, unit) => acc + unit.so_nhan_vien, 0)}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng hồ sơ</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {units.reduce((acc, unit) => acc + unit.so_hoso, 0)}
                </p>
              </div>
              <ExternalLink className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên đơn vị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Units Grid/List View */}
        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnits.map((unit) => (
              <div key={unit.ma_don_vi} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">{unit.ten_don_vi}</h3>
                    {getStatusBadge(unit.trang_thai)}
                  </div>

                  <div className="space-y-3 mb-4">
                    {unit.dia_chi && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                        <span>{unit.dia_chi}</span>
                      </div>
                    )}
                    {unit.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
                        <a href={`mailto:${unit.email}`} className="hover:text-blue-600">
                          {unit.email}
                        </a>
                      </div>
                    )}
                    {unit.so_dien_thoai && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                        <a href={`tel:${unit.so_dien_thoai}`} className="hover:text-blue-600">
                          {unit.so_dien_thoai}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{unit.so_nhan_vien}</p>
                      <p className="text-xs text-gray-600 mt-1">Nhân viên</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{unit.so_hoso}</p>
                      <p className="text-xs text-gray-600 mt-1">Hồ sơ</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn vị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hồ sơ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUnits.map((unit) => (
                    <tr key={unit.ma_don_vi} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{unit.ten_don_vi}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          {unit.email && (
                            <div className="text-gray-600">{unit.email}</div>
                          )}
                          {unit.so_dien_thoai && (
                            <div className="text-gray-600">{unit.so_dien_thoai}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{unit.so_nhan_vien}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{unit.so_hoso}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(unit.trang_thai)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredUnits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy đơn vị nào</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
