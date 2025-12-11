import { NextRequest, NextResponse } from 'next/server';
import { withAuthorization } from '@/middleware/authorize';
import {
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  setRolePermissions
} from '@/services/rbacService';

/**
 * GET /api/roles
 * Get all roles
 */
export const GET = withAuthorization({ permissions: ['manage_roles', 'view_all_profiles'] }, async () => {
  try {
    const roles = await getAllRoles();

    return NextResponse.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Get roles error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi lấy danh sách vai trò'
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/roles
 * Create new role
 */
export const POST = withAuthorization({ permissions: ['manage_roles'] }, async (request) => {
  try {
    const body = await request.json();

    // Validate
    if (!body.tenVaiTro || !body.maVaiTroKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tên vai trò và mã vai trò là bắt buộc'
        },
        { status: 400 }
      );
    }

    const role = await createRole({
      tenVaiTro: body.tenVaiTro,
      maVaiTroKey: body.maVaiTroKey,
      moTa: body.moTa
    });

    // Assign permissions if provided
    if (body.permissionIds && Array.isArray(body.permissionIds)) {
      await setRolePermissions(role.maVaiTro, body.permissionIds);
    }

    const created = await getRoleById(role.maVaiTro);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'Tạo vai trò thành công'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create role error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          message: 'Mã vai trò đã tồn tại'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi tạo vai trò'
      },
      { status: 500 }
    );
  }
});
