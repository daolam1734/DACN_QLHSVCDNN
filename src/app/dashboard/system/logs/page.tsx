'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  History,
  Search,
  Filter,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  Shield
} from 'lucide-react';

interface SystemLog {
  ma_log: number;
  ten_nguoi_dung: string;
  email_nguoi_dung: string;
  hanh_dong: string;
  loai_hanh_dong: 'create' | 'update' | 'delete' | 'view' | 'approve' | 'error';
  mo_ta: string;
  ip_address: string;
  trang_thai: 'success' | 'failed' | 'pending';
  ngay_tao: string;
  chi_tiet?: string;
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  useEffect(() => {
    // TODO: Fetch logs from API
    // Temporary mock data
    const mockLogs: SystemLog[] = [
      {
        ma_log: 1,
        ten_nguoi_dung: 'Quản trị viên',
        email_nguoi_dung: 'admin@tvu.edu.vn',
        hanh_dong: 'Tạo người dùng mới',
        loai_hanh_dong: 'create',
        mo_ta: 'Tạo tài khoản giảng viên: Nguyễn Văn A',
        ip_address: '192.168.1.100',
        trang_thai: 'success',
        ngay_tao: new Date(Date.now() - 10 * 60000).toISOString(),
        chi_tiet: 'Tạo tài khoản mới với email: nva@tvu.edu.vn, vai trò: GIANG_VIEN'
      },
      {
        ma_log: 2,
        ten_nguoi_dung: 'Trưởng khoa',
        email_nguoi_dung: 'truongkhoa@tvu.edu.vn',
        hanh_dong: 'Duyệt hồ sơ',
        loai_hanh_dong: 'approve',
        mo_ta: 'Duyệt hồ sơ đi nước ngoài của Trần Thị B',
        ip_address: '192.168.1.101',
        trang_thai: 'success',
        ngay_tao: new Date(Date.now() - 30 * 60000).toISOString(),
        chi_tiet: 'Hồ sơ ID: 15, Trạng thái: Đã duyệt cấp trưởng'
      },
      {
        ma_log: 3,
        ten_nguoi_dung: 'Giảng viên',
        email_nguoi_dung: 'giangvien1@tvu.edu.vn',
        hanh_dong: 'Cập nhật hồ sơ',
        loai_hanh_dong: 'update',
        mo_ta: 'Cập nhật thông tin hồ sơ đi nước ngoài',
        ip_address: '192.168.1.102',
        trang_thai: 'success',
        ngay_tao: new Date(Date.now() - 1 * 3600000).toISOString(),
        chi_tiet: 'Hồ sơ ID: 12, Cập nhật các trường: Ngày kết thúc, Người hỗ trợ'
      },
      {
        ma_log: 4,
        ten_nguoi_dung: 'Quản trị viên',
        email_nguoi_dung: 'admin@tvu.edu.vn',
        hanh_dong: 'Xóa người dùng',
        loai_hanh_dong: 'delete',
        mo_ta: 'Xóa tài khoản người dùng không còn sử dụng',
        ip_address: '192.168.1.100',
        trang_thai: 'success',
        ngay_tao: new Date(Date.now() - 2 * 3600000).toISOString(),
        chi_tiet: 'Xóa tài khoản: old.user@tvu.edu.vn, ID: 45'
      },
      {
        ma_log: 5,
        ten_nguoi_dung: 'Giảng viên',
        email_nguoi_dung: 'giangvien2@tvu.edu.vn',
        hanh_dong: 'Đăng nhập thất bại',
        loai_hanh_dong: 'error',
        mo_ta: 'Đăng nhập thất bại - Sai mật khẩu',
        ip_address: '192.168.1.105',
        trang_thai: 'failed',
        ngay_tao: new Date(Date.now() - 3 * 3600000).toISOString(),
        chi_tiet: 'Thử đăng nhập sai mật khẩu 3 lần liên tiếp'
      },
      {
        ma_log: 6,
        ten_nguoi_dung: 'Admin',
        email_nguoi_dung: 'admin@tvu.edu.vn',
        hanh_dong: 'Xem báo cáo',
        loai_hanh_dong: 'view',
        mo_ta: 'Xem báo cáo thống kê hồ sơ',
        ip_address: '192.168.1.100',
        trang_thai: 'success',
        ngay_tao: new Date(Date.now() - 4 * 3600000).toISOString(),
        chi_tiet: 'Xem báo cáo loại: Thống kê hồ sơ theo đơn vị, Khoảng thời gian: 1 tháng'
      }
    ];
    
    setLogs(mockLogs);
    setLoading(false);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchSearch = 
      log.ten_nguoi_dung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email_nguoi_dung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.mo_ta.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchType = filterType === 'all' || log.loai_hanh_dong === filterType;
    const matchStatus = filterStatus === 'all' || log.trang_thai === filterStatus;
    
    return matchSearch && matchType && matchStatus;
  });

  const getActionIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      create: <ArrowUpRight className="w-4 h-4 text-green-600" />,
      update: <FileText className="w-4 h-4 text-blue-600" />,
      delete: <AlertCircle className="w-4 h-4 text-red-600" />,
      view: <Eye className="w-4 h-4 text-gray-600" />,
      approve: <CheckCircle className="w-4 h-4 text-green-600" />,
      error: <AlertCircle className="w-4 h-4 text-red-600" />
    };
    return icons[type] || <FileText className="w-4 h-4 text-gray-600" />;
  };

  const getActionLabel = (type: string) => {
    const labels: Record<string, string> = {
      create: 'Tạo mới',
      update: 'Cập nhật',
      delete: 'Xóa',
      view: 'Xem',
      approve: 'Duyệt',
      error: 'Lỗi'
    };
    return labels[type] || type;
  };

  const getActionColor = (type: string) => {
    const colors: Record<string, string> = {
      create: 'bg-green-100 text-green-700',
      update: 'bg-blue-100 text-blue-700',
      delete: 'bg-red-100 text-red-700',
      view: 'bg-gray-100 text-gray-700',
      approve: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      success: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700'
    };
    
    const labels = {
      success: 'Thành công',
      failed: 'Thất bại',
      pending: 'Chờ xử lý'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <DashboardLayout title="Lịch sử Hệ thống">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Lịch sử Hệ thống">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <History className="w-8 h-8 text-blue-600" />
              Lịch sử Hệ thống
            </h1>
            <p className="text-gray-600 mt-1">Theo dõi tất cả các hoạt động trong hệ thống</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            Xuất báo cáo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng hoạt động</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{logs.length}</p>
              </div>
              <History className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Thành công</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {logs.filter(l => l.trang_thai === 'success').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Thất bại</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {logs.filter(l => l.trang_thai === 'failed').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Chưa xử lý</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {logs.filter(l => l.trang_thai === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo người dùng hoặc hành động..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại hành động</option>
              <option value="create">Tạo mới</option>
              <option value="update">Cập nhật</option>
              <option value="delete">Xóa</option>
              <option value="view">Xem</option>
              <option value="approve">Duyệt</option>
              <option value="error">Lỗi</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="failed">Thất bại</option>
              <option value="pending">Chờ xử lý</option>
            </select>
          </div>
        </div>

        {/* Logs Timeline */}
        <div className="space-y-3">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.ma_log} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div
                  onClick={() => setExpandedLog(expandedLog === log.ma_log ? null : log.ma_log)}
                  className="p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${getActionColor(log.loai_hanh_dong)} flex-shrink-0`}>
                      {getActionIcon(log.loai_hanh_dong)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-900">{log.mo_ta}</p>
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${getActionColor(log.loai_hanh_dong)}`}>
                              {getActionLabel(log.loai_hanh_dong)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 flex-wrap">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {log.ten_nguoi_dung}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span>{log.email_nguoi_dung}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500">{formatTime(log.ngay_tao)}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {getStatusBadge(log.trang_thai)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedLog === log.ma_log && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">IP Address</p>
                        <p className="text-sm text-gray-900 font-mono mt-1">{log.ip_address}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Thời gian</p>
                        <p className="text-sm text-gray-900 mt-1">{new Date(log.ngay_tao).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>
                    {log.chi_tiet && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Chi tiết</p>
                        <p className="text-sm text-gray-700 mt-1 bg-white p-3 rounded border border-gray-200">{log.chi_tiet}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy hoạt động nào</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
