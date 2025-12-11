'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Shield,
  Search,
  Plus,
  Edit,
  Trash2,
  Users as UsersIcon,
  Check,
  Lock,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface Permission {
  ma_quyen: number;
  ma_quyen_key: string;
  mo_ta: string;
  nhom_quyen: string;
}

interface Role {
  ma_vai_tro: number;
  ten_vai_tro: string;
  mo_ta: string;
  ma_vai_tro_key: string;
  so_nguoi_dung: number;
  permissions: Permission[];
}

export default function SystemRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRole, setExpandedRole] = useState<number | null>(null);

  useEffect(() => {
    // TODO: Fetch roles from API
    // Temporary mock data
    const mockRoles: Role[] = [
      {
        ma_vai_tro: 1,
        ten_vai_tro: 'Quản trị viên',
        mo_ta: 'Toàn quyền quản lý hệ thống',
        ma_vai_tro_key: 'ADMIN',
        so_nguoi_dung: 1,
        permissions: [
          { ma_quyen: 1, ma_quyen_key: 'view_all_profiles', mo_ta: 'Xem hồ sơ toàn trường', nhom_quyen: 'Hồ sơ' },
          { ma_quyen: 2, ma_quyen_key: 'manage_users', mo_ta: 'Thêm, sửa, xóa người dùng', nhom_quyen: 'Hệ thống' },
          { ma_quyen: 3, ma_quyen_key: 'manage_roles', mo_ta: 'Quản lý vai trò và quyền', nhom_quyen: 'Hệ thống' },
        ]
      },
      {
        ma_vai_tro: 2,
        ten_vai_tro: 'Trưởng đơn vị',
        mo_ta: 'Duyệt hồ sơ cấp cao',
        ma_vai_tro_key: 'TRUONG_DON_VI',
        so_nguoi_dung: 3,
        permissions: [
          { ma_quyen: 4, ma_quyen_key: 'view_unit_profiles', mo_ta: 'Xem hồ sơ trong đơn vị', nhom_quyen: 'Hồ sơ' },
          { ma_quyen: 5, ma_quyen_key: 'approve_head', mo_ta: 'Duyệt cấp trưởng đơn vị', nhom_quyen: 'Duyệt' },
        ]
      },
      {
        ma_vai_tro: 3,
        ten_vai_tro: 'Giảng viên',
        mo_ta: 'Tạo và quản lý hồ sơ cá nhân',
        ma_vai_tro_key: 'GIANG_VIEN',
        so_nguoi_dung: 15,
        permissions: [
          { ma_quyen: 6, ma_quyen_key: 'create_profile', mo_ta: 'Tạo hồ sơ mới', nhom_quyen: 'Hồ sơ' },
          { ma_quyen: 7, ma_quyen_key: 'edit_profile', mo_ta: 'Chỉnh sửa hồ sơ của mình', nhom_quyen: 'Hồ sơ' },
        ]
      }
    ];
    
    setRoles(mockRoles);
    setLoading(false);
  }, []);

  const filteredRoles = roles.filter(role =>
    role.ten_vai_tro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.mo_ta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      'Hồ sơ': 'bg-blue-100 text-blue-700',
      'Duyệt': 'bg-purple-100 text-purple-700',
      'Báo cáo': 'bg-green-100 text-green-700',
      'Hệ thống': 'bg-red-100 text-red-700'
    };
    return colors[group] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <DashboardLayout title="Vai trò & Quyền">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Vai trò & Quyền">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              Vai trò & Quyền
            </h1>
            <p className="text-gray-600 mt-1">Quản lý vai trò và phân quyền hệ thống</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Thêm vai trò
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng vai trò</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{roles.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng quyền</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {roles.reduce((acc, role) => acc + role.permissions.length, 0)}
                </p>
              </div>
              <Lock className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Người dùng được phân quyền</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {roles.reduce((acc, role) => acc + role.so_nguoi_dung, 0)}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-4">
          {filteredRoles.map((role) => (
            <div key={role.ma_vai_tro} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Role Header */}
              <div
                onClick={() => setExpandedRole(expandedRole === role.ma_vai_tro ? null : role.ma_vai_tro)}
                className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{role.ten_vai_tro}</h3>
                  <p className="text-gray-600 mt-1">{role.mo_ta}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                      <UsersIcon className="w-4 h-4" />
                      {role.so_nguoi_dung} người dùng
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                      <Lock className="w-4 h-4" />
                      {role.permissions.length} quyền
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  {role.so_nguoi_dung === 0 && (
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <ChevronRight 
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedRole === role.ma_vai_tro ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>

              {/* Permissions Detail */}
              {expandedRole === role.ma_vai_tro && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Quyền hạn</h4>
                  <div className="space-y-3">
                    {role.permissions.map((permission) => (
                      <div key={permission.ma_quyen} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{permission.ma_quyen_key}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${getGroupColor(permission.nhom_quyen)}`}>
                              {permission.nhom_quyen}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{permission.mo_ta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy vai trò nào</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
