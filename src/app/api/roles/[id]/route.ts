import { NextRequest, NextResponse } from 'next/server';
import { withAuthorization } from '@/middleware/authorize';
import {
  getRoleById,
  updateRole,
  deleteRole,
  setRolePermissions
} from '@/services/rbacService';

/**
 * GET /api/roles/[id]
 * Get role by ID with details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuthorization(
    { permissions: ['manage_roles', 'view_all_profiles'] },
    async () => {
      const roleId = parseInt(params.id);

      if (isNaN(roleId)) {
        return NextResponse.json(
          {
            success: false,
            message: 'ID vai trò không hợp lệ'
          },
          { status: 400 }
        );
      }

      try {
        const role = await getRoleById(roleId);

        if (!role) {
          return NextResponse.json(
            {
              success: false,
              message: 'Không tìm thấy vai trò'
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: role
        });
      } catch (error) {
        console.error('Get role error:', error);
        return NextResponse.json(
          {
            success: false,
            message: 'Lỗi khi lấy thông tin vai trò'
          },
          { status: 500 }
        );
      }
    }
  )(request);

  return authResult;
}

/**
 * PUT /api/roles/[id]
 * Update role
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuthorization(
    { permissions: ['manage_roles'] },
    async () => {
      const roleId = parseInt(params.id);

      if (isNaN(roleId)) {
        return NextResponse.json(
          {
            success: false,
            message: 'ID vai trò không hợp lệ'
          },
          { status: 400 }
        );
      }

      try {
        const body = await request.json();

        // Update basic info
        const updated = await updateRole(roleId, {
          tenVaiTro: body.tenVaiTro,
          moTa: body.moTa
        });

        // Update permissions if provided
        if (body.permissionIds && Array.isArray(body.permissionIds)) {
          await setRolePermissions(roleId, body.permissionIds);
        }

        const role = await getRoleById(roleId);

        return NextResponse.json({
          success: true,
          data: role,
          message: 'Cập nhật vai trò thành công'
        });
      } catch (error: any) {
        console.error('Update role error:', error);

        if (error.code === 'P2025') {
          return NextResponse.json(
            {
              success: false,
              message: 'Không tìm thấy vai trò'
            },
            { status: 404 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            message: 'Lỗi khi cập nhật vai trò'
          },
          { status: 500 }
        );
      }
    }
  )(request);

  return authResult;
}

/**
 * DELETE /api/roles/[id]
 * Delete role
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuthorization(
    { permissions: ['manage_roles'] },
    async () => {
      const roleId = parseInt(params.id);

      if (isNaN(roleId)) {
        return NextResponse.json(
          {
            success: false,
            message: 'ID vai trò không hợp lệ'
          },
          { status: 400 }
        );
      }

      try {
        await deleteRole(roleId);

        return NextResponse.json({
          success: true,
          message: 'Xóa vai trò thành công'
        });
      } catch (error: any) {
        console.error('Delete role error:', error);

        if (error.code === 'P2025') {
          return NextResponse.json(
            {
              success: false,
              message: 'Không tìm thấy vai trò'
            },
            { status: 404 }
          );
        }

        if (error.code === 'P2003') {
          return NextResponse.json(
            {
              success: false,
              message: 'Không thể xóa vai trò đang được sử dụng'
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            message: 'Lỗi khi xóa vai trò'
          },
          { status: 500 }
        );
      }
    }
  )(request);

  return authResult;
}
