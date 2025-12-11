'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Loader2
} from 'lucide-react';

interface User {
  ma_nguoi_dung: number;
  ten_dang_nhap: string;
  ho_ten: string;
  email: string;
  so_dien_thoai?: string;
  don_vi?: string;
  trang_thai: 'active' | 'inactive' | 'locked';
  phai_doi_mat_khau: boolean;
  roles: string[];
  ngay_tao: string;
}

export default function SystemUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // TODO: Fetch users from API
    // Temporary mock data
    const mockUsers: User[] = [
      {
        ma_nguoi_dung: 1,
        ten_dang_nhap: 'admin',
        ho_ten: 'Quản trị viên',
        email: 'admin@tvu.edu.vn',
        so_dien_thoai: '0901234567',
        don_vi: 'Phòng CNTT',
        trang_thai: 'active',
        phai_doi_mat_khau: false,
        roles: ['ADMIN'],
        ngay_tao: '2025-01-01'
      },
      {
        ma_nguoi_dung: 2,
        ten_dang_nhap: 'truongkhoa',
        ho_ten: 'Nguyễn Văn A',
        email: 'truongkhoa@tvu.edu.vn',
        so_dien_thoai: '0912345678',
        don_vi: 'Khoa Công nghệ',
        trang_thai: 'active',
        phai_doi_mat_khau: false,
        roles: ['TRUONG_DON_VI'],
        ngay_tao: '2025-01-05'
      },
      {
        ma_nguoi_dung: 3,
        ten_dang_nhap: 'giangvien1',
        ho_ten: 'Trần Thị B',
        email: 'giangvien1@tvu.edu.vn',
        don_vi: 'Khoa Kinh tế',
        trang_thai: 'active',
        phai_doi_mat_khau: true,
        roles: ['GIANG_VIEN'],
        ngay_tao: '2025-01-10'
      }
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchSearch = 
      user.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.ten_dang_nhap.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchRole = filterRole === 'all' || user.roles.includes(filterRole);
    const matchStatus = filterStatus === 'all' || user.trang_thai === filterStatus;
    
    return matchSearch && matchRole && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      locked: 'bg-red-100 text-red-700'
    };
    
    const labels = {
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      locked: 'Bị khóa'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleNames: Record<string, string> = {
      ADMIN: 'Quản trị viên',
      TRUONG_DON_VI: 'Trưởng đơn vị',
      PHO_TRUONG_DON_VI: 'Phó trưởng đơn vị',
      CAN_BO_PHONG_BAN: 'Cán bộ phòng ban',
      GIANG_VIEN: 'Giảng viên',
      VIEWER: 'Người xem'
    };
    
    return (
      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
        {roleNames[role] || role}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Quản lý Người dùng">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Quản lý Người dùng">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              Quản lý Người dùng
            </h1>
            <p className="text-gray-600 mt-1">Quản lý tài khoản và phân quyền người dùng</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Thêm người dùng
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {users.filter(u => u.trang_thai === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Bị khóa</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {users.filter(u => u.trang_thai === 'locked').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Cần đổi mật khẩu</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {users.filter(u => u.phai_doi_mat_khau).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="ADMIN">Quản trị viên</option>
                <option value="TRUONG_DON_VI">Trưởng đơn vị</option>
                <option value="PHO_TRUONG_DON_VI">Phó trưởng đơn vị</option>
                <option value="CAN_BO_PHONG_BAN">Cán bộ phòng ban</option>
                <option value="GIANG_VIEN">Giảng viên</option>
                <option value="VIEWER">Người xem</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="locked">Bị khóa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn vị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.ma_nguoi_dung} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.ho_ten}</div>
                        <div className="text-sm text-gray-500">@{user.ten_dang_nhap}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.so_dien_thoai && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {user.so_dien_thoai}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.don_vi ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4" />
                          {user.don_vi}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(role => (
                          <div key={role}>
                            {getRoleBadge(role)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(user.trang_thai)}
                        {user.phai_doi_mat_khau && (
                          <div className="text-xs text-orange-600 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Cần đổi MK
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.ngay_tao).toLocaleDateString('vi-VN')}
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
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
