import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from './auth';
import { getUserRolesAndPermissions } from '@/services/rbacService';

export interface AuthorizedUser {
  ma_nguoi_dung: number;
  email: string;
  roles: string[];
  permissions: string[];
}

/**
 * Middleware to check if user has required role(s)
 * Usage: const authResult = await requireRole(request, ['ADMIN', 'TRUONG_DON_VI']);
 */
export async function requireRole(
  request: NextRequest,
  roleKeys: string | string[]
): Promise<{ user: AuthorizedUser } | { error: NextResponse }> {
  // First authenticate the user
  const authResult = await requireAuth(request);
  if ('error' in authResult) {
    return { error: authResult.error! };
  }

  const { user } = authResult;

  // Get user's roles and permissions
  const rbac = await getUserRolesAndPermissions(user.ma_nguoi_dung);

  // Check if user has required role
  const requiredRoles = Array.isArray(roleKeys) ? roleKeys : [roleKeys];
  const hasRole = requiredRoles.some(role => rbac.roles.includes(role));

  if (!hasRole) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: 'FORBIDDEN',
          message: `Bạn không có quyền truy cập. Yêu cầu vai trò: ${requiredRoles.join(' hoặc ')}`
        },
        { status: 403 }
      )
    };
  }

  return {
    user: {
      ...user,
      roles: rbac.roles,
      permissions: rbac.permissions
    }
  };
}

/**
 * Middleware to check if user has required permission(s)
 * Usage: const authResult = await requirePermission(request, ['manage_users', 'view_users']);
 */
export async function requirePermission(
  request: NextRequest,
  permissionKeys: string | string[],
  requireAll: boolean = false // If true, user must have ALL permissions; if false, ANY permission
): Promise<{ user: AuthorizedUser } | { error: NextResponse }> {
  // First authenticate the user
  const authResult = await requireAuth(request);
  if ('error' in authResult) {
    return { error: authResult.error! };
  }

  const { user } = authResult;

  // Get user's roles and permissions
  const rbac = await getUserRolesAndPermissions(user.ma_nguoi_dung);

  // Check permissions
  const requiredPermissions = Array.isArray(permissionKeys) ? permissionKeys : [permissionKeys];
  
  const hasPermission = requireAll
    ? requiredPermissions.every(perm => rbac.permissions.includes(perm))
    : requiredPermissions.some(perm => rbac.permissions.includes(perm));

  if (!hasPermission) {
    const requirement = requireAll ? 'tất cả quyền' : 'một trong các quyền';
    return {
      error: NextResponse.json(
        {
          success: false,
          error: 'FORBIDDEN',
          message: `Bạn không có ${requirement}: ${requiredPermissions.join(', ')}`
        },
        { status: 403 }
      )
    };
  }

  return {
    user: {
      ...user,
      roles: rbac.roles,
      permissions: rbac.permissions
    }
  };
}

/**
 * Check if authenticated user is admin
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: AuthorizedUser } | { error: NextResponse }> {
  return requireRole(request, 'ADMIN');
}

/**
 * Get authenticated user with their roles and permissions
 * No authorization check, just adds RBAC info to user
 */
export async function getAuthenticatedUserWithRBAC(
  request: NextRequest
): Promise<{ user: AuthorizedUser } | { error: NextResponse }> {
  const authResult = await requireAuth(request);
  if ('error' in authResult) {
    return { error: authResult.error! };
  }

  const { user } = authResult;
  const rbac = await getUserRolesAndPermissions(user.ma_nguoi_dung);

  return {
    user: {
      ...user,
      roles: rbac.roles,
      permissions: rbac.permissions
    }
  };
}

/**
 * Higher-order function to wrap API routes with authorization
 * Example:
 * export const GET = withAuthorization(['ADMIN'], async (request, user) => {
 *   // Your route logic here
 *   return NextResponse.json({ data: 'protected' });
 * });
 */
export function withAuthorization(
  options: {
    roles?: string[];
    permissions?: string[];
    requireAllPermissions?: boolean;
  },
  handler: (request: NextRequest, user: AuthorizedUser) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      let authResult;

      if (options.roles && options.roles.length > 0) {
        authResult = await requireRole(request, options.roles);
      } else if (options.permissions && options.permissions.length > 0) {
        authResult = await requirePermission(
          request,
          options.permissions,
          options.requireAllPermissions || false
        );
      } else {
        // Just require authentication
        authResult = await getAuthenticatedUserWithRBAC(request);
      }

      if ('error' in authResult) {
        return authResult.error;
      }

      return await handler(request, authResult.user);
    } catch (error) {
      console.error('Authorization error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'INTERNAL_ERROR',
          message: 'Lỗi kiểm tra quyền truy cập'
        },
        { status: 500 }
      );
    }
  };
}
