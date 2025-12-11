import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Permission definitions
const permissions = [
  // System permissions
  { tenQuyen: 'Quản lý người dùng', maQuyenKey: 'manage_users', nhomQuyen: 'system', moTa: 'Thêm, sửa, xóa người dùng trong hệ thống' },
  { tenQuyen: 'Quản lý vai trò', maQuyenKey: 'manage_roles', nhomQuyen: 'system', moTa: 'Quản lý vai trò và phân quyền' },
  { tenQuyen: 'Quản lý đơn vị', maQuyenKey: 'manage_units', nhomQuyen: 'system', moTa: 'Quản lý cơ cấu tổ chức đơn vị' },
  { tenQuyen: 'Xem nhật ký hệ thống', maQuyenKey: 'view_system_logs', nhomQuyen: 'system', moTa: 'Xem lịch sử hoạt động hệ thống' },
  
  // Profile permissions
  { tenQuyen: 'Tạo hồ sơ', maQuyenKey: 'create_profile', nhomQuyen: 'profile', moTa: 'Tạo hồ sơ đi nước ngoài mới' },
  { tenQuyen: 'Xem hồ sơ', maQuyenKey: 'view_profile', nhomQuyen: 'profile', moTa: 'Xem chi tiết hồ sơ' },
  { tenQuyen: 'Chỉnh sửa hồ sơ', maQuyenKey: 'edit_profile', nhomQuyen: 'profile', moTa: 'Cập nhật thông tin hồ sơ' },
  { tenQuyen: 'Xóa hồ sơ', maQuyenKey: 'delete_profile', nhomQuyen: 'profile', moTa: 'Xóa hồ sơ khỏi hệ thống' },
  { tenQuyen: 'Xem hồ sơ đơn vị', maQuyenKey: 'view_unit_profiles', nhomQuyen: 'profile', moTa: 'Xem tất cả hồ sơ trong đơn vị' },
  { tenQuyen: 'Xem tất cả hồ sơ', maQuyenKey: 'view_all_profiles', nhomQuyen: 'profile', moTa: 'Xem hồ sơ toàn trường' },
  
  // Approval permissions
  { tenQuyen: 'Thẩm định hồ sơ', maQuyenKey: 'review_profile', nhomQuyen: 'approval', moTa: 'Thẩm định và góp ý hồ sơ' },
  { tenQuyen: 'Phê duyệt cấp phòng', maQuyenKey: 'approve_department', nhomQuyen: 'approval', moTa: 'Phê duyệt hồ sơ cấp phòng ban' },
  { tenQuyen: 'Phê duyệt cấp trưởng đơn vị', maQuyenKey: 'approve_head', nhomQuyen: 'approval', moTa: 'Phê duyệt hồ sơ cấp trưởng đơn vị' },
  { tenQuyen: 'Phê duyệt cấp hiệu trưởng', maQuyenKey: 'approve_rector', nhomQuyen: 'approval', moTa: 'Phê duyệt cuối cùng' },
  
  // Report permissions
  { tenQuyen: 'Xem báo cáo', maQuyenKey: 'view_reports', nhomQuyen: 'report', moTa: 'Xem báo cáo thống kê' },
  { tenQuyen: 'Xuất báo cáo', maQuyenKey: 'export_reports', nhomQuyen: 'report', moTa: 'Xuất file báo cáo Excel, PDF' },
  { tenQuyen: 'Nộp báo cáo sau chuyến đi', maQuyenKey: 'submit_trip_report', nhomQuyen: 'report', moTa: 'Nộp báo cáo kết thúc chuyến đi' },
  { tenQuyen: 'Xác nhận báo cáo', maQuyenKey: 'confirm_trip_report', nhomQuyen: 'report', moTa: 'Xác nhận báo cáo sau chuyến đi' },
];

// Role-Permission mappings
const rolePermissions = {
  ADMIN: ['*'], // All permissions
  TRUONG_DON_VI: [
    'view_profile', 'view_unit_profiles', 'edit_profile',
    'review_profile', 'approve_head',
    'view_reports', 'export_reports', 'confirm_trip_report'
  ],
  PHO_TRUONG_DON_VI: [
    'view_profile', 'view_unit_profiles', 'edit_profile',
    'review_profile', 'approve_department',
    'view_reports', 'export_reports'
  ],
  CAN_BO_PHONG_BAN: [
    'view_profile', 'view_unit_profiles', 'edit_profile',
    'review_profile', 'approve_department',
    'view_reports'
  ],
  GIANG_VIEN: [
    'create_profile', 'view_profile', 'edit_profile',
    'submit_trip_report', 'view_reports'
  ],
  VIEWER: ['view_profile', 'view_reports']
};

async function seed() {
  console.log('🌱 Starting RBAC seed...');

  try {
    // Insert permissions
    console.log('📝 Creating permissions...');
    for (const perm of permissions) {
      await prisma.quyen.upsert({
        where: { maQuyenKey: perm.maQuyenKey },
        update: {},
        create: perm
      });
    }
    console.log(`✅ Created ${permissions.length} permissions`);

    // Get all roles
    /**
     * Retrieves all roles from the database.
     * @returns {Promise<VaiTro[]>} A promise that resolves to an array of all roles
     */
    const roles = await prisma.vaiTro.findMany();
    console.log(`📋 Found ${roles.length} roles`);

    // Get all permissions
    const allPermissions = await prisma.quyen.findMany();

    // Map permissions to roles
    console.log('🔗 Mapping permissions to roles...');
    for (const role of roles) {
      const roleKey = role.maVaiTroKey;
      const permKeys = rolePermissions[roleKey as keyof typeof rolePermissions];

      if (!permKeys) continue;

      // If role has all permissions (*)
      const permsToAssign = permKeys[0] === '*'
        ? allPermissions
        : allPermissions.filter(p => permKeys.includes(p.maQuyenKey));

      for (const perm of permsToAssign) {
        await prisma.vaiTroQuyen.upsert({
          where: {
            maVaiTro_maQuyen: {
              maVaiTro: role.maVaiTro,
              maQuyen: perm.maQuyen
            }
          },
          update: {},
          create: {
            maVaiTro: role.maVaiTro,
            maQuyen: perm.maQuyen
          }
        });
      }

      console.log(`  ✓ ${role.tenVaiTro}: ${permsToAssign.length} permissions`);
    }

    // Assign roles to existing users
    console.log('👤 Assigning roles to users...');
    
    // Admin user
    const adminUser = await prisma.nguoiDung.findUnique({ where: { email: 'admin@tvu.edu.vn' } });
    const adminRole = await prisma.vaiTro.findUnique({ where: { maVaiTroKey: 'ADMIN' } });
    
    if (adminUser && adminRole) {
      await prisma.nguoiDungVaiTro.upsert({
        where: {
          maNguoiDung_maVaiTro: {
            maNguoiDung: adminUser.maNguoiDung,
            maVaiTro: adminRole.maVaiTro
          }
        },
        update: {},
        create: {
          maNguoiDung: adminUser.maNguoiDung,
          maVaiTro: adminRole.maVaiTro
        }
      });
      console.log('  ✓ admin@tvu.edu.vn assigned ADMIN role');
    }

    // Lecturer user
    const lecturerUser = await prisma.nguoiDung.findUnique({ where: { email: 'giangvien@tvu.edu.vn' } });
    const lecturerRole = await prisma.vaiTro.findUnique({ where: { maVaiTroKey: 'GIANG_VIEN' } });
    
    if (lecturerUser && lecturerRole) {
      await prisma.nguoiDungVaiTro.upsert({
        where: {
          maNguoiDung_maVaiTro: {
            maNguoiDung: lecturerUser.maNguoiDung,
            maVaiTro: lecturerRole.maVaiTro
          }
        },
        update: {},
        create: {
          maNguoiDung: lecturerUser.maNguoiDung,
          maVaiTro: lecturerRole.maVaiTro
        }
      });
      console.log('  ✓ giangvien@tvu.edu.vn assigned LECTURER role');
    }

    // Final stats
    const stats = {
      roles: await prisma.vaiTro.count(),
      permissions: await prisma.quyen.count(),
      rolePermissions: await prisma.vaiTroQuyen.count(),
      userRoles: await prisma.nguoiDungVaiTro.count()
    };

    console.log('\n📊 Final Stats:');
    console.log(`  Roles: ${stats.roles}`);
    console.log(`  Permissions: ${stats.permissions}`);
    console.log(`  Role-Permission Mappings: ${stats.rolePermissions}`);
    console.log(`  User-Role Assignments: ${stats.userRoles}`);
    console.log('\n✨ RBAC seed completed successfully!');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
