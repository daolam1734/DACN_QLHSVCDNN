/**
 * Navigation types for dashboard menu system
 */

import { LucideIcon } from 'lucide-react';

export type Role = 
  | 'ADMIN' 
  | 'TRUONG_DON_VI' 
  | 'PHO_TRUONG_DON_VI' 
  | 'CAN_BO_PHONG_BAN' 
  | 'GIANG_VIEN' 
  | 'VIEWER';

export type Permission =
  // System permissions
  | 'manage_users'
  | 'manage_roles'
  | 'manage_units'
  | 'view_system_logs'
  // Profile permissions
  | 'create_profile'
  | 'view_profile'
  | 'edit_profile'
  | 'delete_profile'
  | 'view_unit_profiles'
  | 'view_all_profiles'
  // Approval permissions
  | 'review_profile'
  | 'approve_department'
  | 'approve_head'
  | 'approve_rector'
  // Report permissions
  | 'view_reports'
  | 'export_reports'
  | 'submit_trip_report'
  | 'confirm_trip_report';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permissions?: Permission[];
  roles?: Role[];
  badge?: string | number;
  children?: MenuItem[];
}

export interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
  roles?: Role[];
}

export interface UserSession {
  maNguoiDung: number;
  tenDangNhap: string;
  hoTen: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
}
