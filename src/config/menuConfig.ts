/**
 * Dashboard menu configuration
 * Defines menu structure with role-based access control
 */

import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  FolderPlus,
  User,
  Building2,
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  FileBarChart,
  Download,
  Upload,
  CheckSquare,
  Settings,
  Users,
  Shield,
  Building,
  History,
  UserCircle,
  Lock,
  LogOut
} from 'lucide-react';
import { MenuGroup } from '@/types/navigation';

export const menuConfig: MenuGroup[] = [
  // Dashboard Overview
  {
    id: 'overview',
    label: 'Tổng quan',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      }
    ]
  },

  // Profile Management
  {
    id: 'profiles',
    label: 'Quản lý hồ sơ',
    items: [
      {
        id: 'profiles-list',
        label: 'Danh sách hồ sơ',
        href: '/dashboard/profiles',
        icon: FileText,
        permissions: ['view_profile', 'view_all_profiles'],
      },
      {
        id: 'profiles-create',
        label: 'Tạo hồ sơ mới',
        href: '/dashboard/profiles/create',
        icon: FolderPlus,
        permissions: ['create_profile'],
      },
      {
        id: 'profiles-my',
        label: 'Hồ sơ của tôi',
        href: '/dashboard/profiles/my-profiles',
        icon: User,
        roles: ['GIANG_VIEN'],
      },
      {
        id: 'profiles-unit',
        label: 'Hồ sơ đơn vị',
        href: '/dashboard/profiles/unit',
        icon: Building2,
        permissions: ['view_unit_profiles'],
        roles: ['TRUONG_DON_VI', 'PHO_TRUONG_DON_VI', 'CAN_BO_PHONG_BAN'],
      }
    ]
  },

  // Approval Management
  {
    id: 'approvals',
    label: 'Duyệt hồ sơ',
    roles: ['ADMIN', 'TRUONG_DON_VI', 'PHO_TRUONG_DON_VI', 'CAN_BO_PHONG_BAN'],
    items: [
      {
        id: 'approvals-pending',
        label: 'Chờ duyệt',
        href: '/dashboard/approvals/pending',
        icon: Clock,
        permissions: ['review_profile'],
      },
      {
        id: 'approvals-department',
        label: 'Duyệt phòng ban',
        href: '/dashboard/approvals/department',
        icon: CheckCircle,
        permissions: ['approve_department'],
      },
      {
        id: 'approvals-head',
        label: 'Duyệt trưởng đơn vị',
        href: '/dashboard/approvals/head',
        icon: Award,
        permissions: ['approve_head'],
      },
      {
        id: 'approvals-rector',
        label: 'Duyệt hiệu trưởng',
        href: '/dashboard/approvals/rector',
        icon: Award,
        permissions: ['approve_rector'],
        roles: ['ADMIN', 'TRUONG_DON_VI'],
      }
    ]
  },

  // Reports
  {
    id: 'reports',
    label: 'Báo cáo',
    items: [
      {
        id: 'reports-view',
        label: 'Xem báo cáo',
        href: '/dashboard/reports',
        icon: BarChart3,
        permissions: ['view_reports'],
      },
      {
        id: 'reports-export',
        label: 'Xuất báo cáo',
        href: '/dashboard/reports/export',
        icon: Download,
        permissions: ['export_reports'],
      },
      {
        id: 'reports-submit',
        label: 'Nộp báo cáo chuyến đi',
        href: '/dashboard/reports/submit',
        icon: Upload,
        permissions: ['submit_trip_report'],
      },
      {
        id: 'reports-confirm',
        label: 'Xác nhận báo cáo',
        href: '/dashboard/reports/confirm',
        icon: CheckSquare,
        permissions: ['confirm_trip_report'],
        roles: ['ADMIN', 'TRUONG_DON_VI', 'PHO_TRUONG_DON_VI'],
      }
    ]
  },

  // System Management (Admin only)
  {
    id: 'system',
    label: 'Quản trị hệ thống',
    roles: ['ADMIN'],
    items: [
      {
        id: 'system-users',
        label: 'Quản lý người dùng',
        href: '/dashboard/system/users',
        icon: Users,
        permissions: ['manage_users'],
      },
      {
        id: 'system-roles',
        label: 'Vai trò & Quyền',
        href: '/dashboard/system/roles',
        icon: Shield,
        permissions: ['manage_roles'],
      },
      {
        id: 'system-units',
        label: 'Quản lý đơn vị',
        href: '/dashboard/system/units',
        icon: Building,
        permissions: ['manage_units'],
      },
      {
        id: 'system-logs',
        label: 'Lịch sử hệ thống',
        href: '/dashboard/system/logs',
        icon: History,
        permissions: ['view_system_logs'],
      }
    ]
  },

  // User Profile & Settings
  {
    id: 'user',
    label: 'Cá nhân',
    items: [
      {
        id: 'profile',
        label: 'Thông tin cá nhân',
        href: '/dashboard/profile',
        icon: UserCircle,
      },
      {
        id: 'change-password',
        label: 'Đổi mật khẩu',
        href: '/change-password',
        icon: Lock,
      }
    ]
  }
];

/**
 * Check if user has permission to access a menu item
 */
export function hasMenuAccess(
  item: { permissions?: string[]; roles?: string[] },
  userRoles: string[] = [],
  userPermissions: string[] = []
): boolean {
  // Ensure arrays are not undefined
  const roles = userRoles || [];
  const permissions = userPermissions || [];

  // If no restrictions, allow access
  if (!item.permissions && !item.roles) {
    return true;
  }

  // Check role access
  if (item.roles && item.roles.length > 0) {
    const hasRole = item.roles.some(role => roles.includes(role));
    if (!hasRole) return false;
  }

  // Check permission access
  if (item.permissions && item.permissions.length > 0) {
    const hasPermission = item.permissions.some(permission => 
      permissions.includes(permission)
    );
    if (!hasPermission) return false;
  }

  return true;
}

/**
 * Filter menu items based on user permissions and roles
 */
export function getFilteredMenu(
  menuGroups: MenuGroup[],
  userRoles: string[] = [],
  userPermissions: string[] = []
): MenuGroup[] {
  // Ensure arrays are not undefined
  const roles = userRoles || [];
  const permissions = userPermissions || [];

  return menuGroups
    .filter(group => {
      // Filter group by role if specified
      if (group.roles && group.roles.length > 0) {
        return group.roles.some(role => roles.includes(role));
      }
      return true;
    })
    .map(group => ({
      ...group,
      items: group.items.filter(item => 
        hasMenuAccess(item, roles, permissions)
      )
    }))
    .filter(group => group.items.length > 0); // Remove empty groups
}
