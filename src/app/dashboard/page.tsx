'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  AlertCircle,
  Users,
  Shield,
  Building2,
  History,
  Activity,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ProfilesChart from '@/components/dashboard/ProfilesChart';
import TrendChart from '@/components/dashboard/TrendChart';
import RecentProfilesTable from '@/components/dashboard/RecentProfilesTable';
import { dashboardApi } from '@/lib/dashboardApi';
import type { DashboardData } from '@/types/dashboard';

interface UserData {
  maNguoiDung?: number;
  roles?: string[];
  permissions?: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check authentication
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Load user data
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
          setUserData(JSON.parse(userDataStr));
        }

        // Fetch all dashboard data
        const dashboardData = await dashboardApi.getAllData();
        console.log('Dashboard data received:', dashboardData);
        setData(dashboardData);
      } catch (err: any) {
        console.error('Dashboard error:', err);
        console.error('Error details:', err.response?.data);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login');
        } else if (err.response?.status === 403) {
          setError('Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên.');
        } else {
          setError(err.response?.data?.error || 'Có lỗi xảy ra khi tải dữ liệu dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Render admin-specific dashboard
  const isAdmin = userData?.roles?.includes('ADMIN');

  const renderAdminDashboard = () => (
    <>
      {/* Admin System Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quản Trị Hệ Thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/dashboard/system/users')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-medium">Người dùng</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">127</p>
              </div>
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <p className="text-xs text-gray-600 mt-3">→ Quản lý tài khoản</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/dashboard/system/roles')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-medium">Vai trò</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">6</p>
              </div>
              <Shield className="w-10 h-10 text-purple-400" />
            </div>
            <p className="text-xs text-gray-600 mt-3">→ Quản lý quyền hạn</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/dashboard/system/units')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-medium">Đơn vị</p>
                <p className="text-3xl font-bold text-green-600 mt-2">12</p>
              </div>
              <Building2 className="w-10 h-10 text-green-400" />
            </div>
            <p className="text-xs text-gray-600 mt-3">→ Quản lý cấu trúc</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/dashboard/system/logs')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-medium">Hoạt động</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">1.2K</p>
              </div>
              <History className="w-10 h-10 text-orange-400" />
            </div>
            <p className="text-xs text-gray-600 mt-3">→ Xem lịch sử</p>
          </div>
        </div>
      </div>

      {/* Regular Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thống Kê Hồ Sơ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng số hồ sơ"
            value={data?.summary.tong_ho_so || 0}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Chờ duyệt"
            value={data?.summary.ho_so_cho_duyet || 0}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            title="Đã duyệt"
            value={data?.summary.ho_so_da_duyet || 0}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Bị từ chối"
            value={data?.summary.ho_so_bi_tu_choi || 0}
            icon={XCircle}
            color="red"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="mb-8">
        <TrendChart
          data={data?.trend || []}
          title="Xu hướng hồ sơ theo tháng"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ProfilesChart
          data={data?.byDonVi || []}
          type="bar"
          title="Hồ sơ theo đơn vị"
        />
        <ProfilesChart
          data={data?.byLoai || []}
          type="pie"
          title="Phân loại hồ sơ"
        />
      </div>

      <RecentProfilesTable data={data?.recent || []} />
    </>
  );

  const renderUserDashboard = () => (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng số hồ sơ"
          value={data?.summary.tong_ho_so || 0}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Chờ duyệt"
          value={data?.summary.ho_so_cho_duyet || 0}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Đã duyệt"
          value={data?.summary.ho_so_da_duyet || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Bị từ chối"
          value={data?.summary.ho_so_bi_tu_choi || 0}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Trend Chart */}
      <div className="mb-8">
        <TrendChart
          data={data?.trend || []}
          title="Xu hướng hồ sơ theo tháng"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ProfilesChart
          data={data?.byDonVi || []}
          type="bar"
          title="Hồ sơ theo đơn vị"
        />
        <ProfilesChart
          data={data?.byLoai || []}
          type="pie"
          title="Phân loại hồ sơ"
        />
      </div>

      {/* Recent Profiles Table */}
      <RecentProfilesTable data={data?.recent || []} />
    </>
  );

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Quay lại trang đăng nhập
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <DashboardLayout title={isAdmin ? "Dashboard Quản Trị" : "Dashboard"}>
      {isAdmin ? renderAdminDashboard() : renderUserDashboard()}
    </DashboardLayout>
  );
}
