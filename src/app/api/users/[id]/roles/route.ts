import { NextRequest, NextResponse } from 'next/server';
import { withAuthorization } from '@/middleware/authorize';
import {
  getUsersWithRoles,
  assignRoleToUser,
  removeRoleFromUser
} from '@/services/rbacService';

/**
 * GET /api/users
 * Get users with filters and pagination
 */
export const GET = withAuthorization({ permissions: ['manage_users', 'view_all_profiles'] }, async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      search: searchParams.get('search') || undefined,
      roleKey: searchParams.get('role') || undefined,
      trangThai: searchParams.get('status') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    };

    const result = await getUsersWithRoles(filters);

    return NextResponse.json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi khi lấy danh sách người dùng'
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/users/[id]/roles
 * Assign role to user
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuthorization(
    { permissions: ['manage_users'] },
    async () => {
      const userId = parseInt(params.id);

      if (isNaN(userId)) {
        return NextResponse.json(
          {
            success: false,
            message: 'ID người dùng không hợp lệ'
          },
          { status: 400 }
        );
      }

      try {
        const body = await request.json();

        if (!body.roleId) {
          return NextResponse.json(
            {
              success: false,
              message: 'ID vai trò là bắt buộc'
            },
            { status: 400 }
          );
        }

        await assignRoleToUser(userId, body.roleId);

        return NextResponse.json({
          success: true,
          message: 'Gán vai trò thành công'
        });
      } catch (error: any) {
        console.error('Assign role error:', error);

        if (error.code === 'P2003') {
          return NextResponse.json(
            {
              success: false,
              message: 'Người dùng hoặc vai trò không tồn tại'
            },
            { status: 404 }
          );
        }

        if (error.code === 'P2002') {
          return NextResponse.json(
            {
              success: false,
              message: 'Người dùng đã có vai trò này'
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            message: 'Lỗi khi gán vai trò'
          },
          { status: 500 }
        );
      }
    }
  )(request);

  return authResult;
}

/**
 * DELETE /api/users/[id]/roles/[roleId]
 * Remove role from user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; roleId: string } }
) {
  const authResult = await withAuthorization(
    { permissions: ['manage_users'] },
    async () => {
      const userId = parseInt(params.id);
      const roleId = parseInt(params.roleId);

      if (isNaN(userId) || isNaN(roleId)) {
        return NextResponse.json(
          {
            success: false,
            message: 'ID không hợp lệ'
          },
          { status: 400 }
        );
      }

      try {
        await removeRoleFromUser(userId, roleId);

        return NextResponse.json({
          success: true,
          message: 'Gỡ vai trò thành công'
        });
      } catch (error) {
        console.error('Remove role error:', error);
        return NextResponse.json(
          {
            success: false,
            message: 'Lỗi khi gỡ vai trò'
          },
          { status: 500 }
        );
      }
    }
  )(request);

  return authResult;
}
