import { prisma } from '@/lib/prisma';

export interface UserRoles {
  roles: string[]; // Role keys
  permissions: string[]; // Permission keys
}

/**
 * Get user's roles and permissions
 */
export async function getUserRolesAndPermissions(maNguoiDung: number): Promise<UserRoles> {
  // Get user's roles with their permissions
  const userRoles = await prisma.nguoiDungVaiTro.findMany({
    where: { maNguoiDung },
    include: {
      vaiTro: {
        include: {
          vaiTroQuyen: {
            include: {
              quyen: true
            }
          }
        }
      }
    }
  });

  const roles: string[] = [];
  const permissionsSet = new Set<string>();

  for (const userRole of userRoles) {
    roles.push(userRole.vaiTro.maVaiTroKey);
    
    // Collect all permissions from this role
    for (const vaiTroQuyen of userRole.vaiTro.vaiTroQuyen) {
      permissionsSet.add(vaiTroQuyen.quyen.maQuyenKey);
    }
  }

  return {
    roles,
    permissions: Array.from(permissionsSet)
  };
}

/**
 * Check if user has a specific role
 */
export async function userHasRole(maNguoiDung: number, roleKey: string): Promise<boolean> {
  const count = await prisma.nguoiDungVaiTro.count({
    where: {
      maNguoiDung,
      vaiTro: {
        maVaiTroKey: roleKey
      }
    }
  });

  return count > 0;
}

/**
 * Check if user has a specific permission
 */
export async function userHasPermission(maNguoiDung: number, permissionKey: string): Promise<boolean> {
  const { permissions } = await getUserRolesAndPermissions(maNguoiDung);
  return permissions.includes(permissionKey);
}

/**
 * Check if user has ANY of the specified permissions
 */
export async function userHasAnyPermission(maNguoiDung: number, permissionKeys: string[]): Promise<boolean> {
  const { permissions } = await getUserRolesAndPermissions(maNguoiDung);
  return permissionKeys.some(key => permissions.includes(key));
}

/**
 * Check if user has ALL of the specified permissions
 */
export async function userHasAllPermissions(maNguoiDung: number, permissionKeys: string[]): Promise<boolean> {
  const { permissions } = await getUserRolesAndPermissions(maNguoiDung);
  return permissionKeys.every(key => permissions.includes(key));
}

/**
 * Assign role to user
 */
export async function assignRoleToUser(maNguoiDung: number, maVaiTro: number) {
  return await prisma.nguoiDungVaiTro.create({
    data: {
      maNguoiDung,
      maVaiTro
    }
  });
}

/**
 * Remove role from user
 */
export async function removeRoleFromUser(maNguoiDung: number, maVaiTro: number) {
  return await prisma.nguoiDungVaiTro.deleteMany({
    where: {
      maNguoiDung,
      maVaiTro
    }
  });
}

/**
 * Get all roles
 */
export async function getAllRoles() {
  return await prisma.vaiTro.findMany({
    include: {
      _count: {
        select: {
          nguoiDungVaiTro: true,
          vaiTroQuyen: true
        }
      }
    },
    orderBy: {
      tenVaiTro: 'asc'
    }
  });
}

/**
 * Get role by ID with permissions
 */
export async function getRoleById(maVaiTro: number) {
  return await prisma.vaiTro.findUnique({
    where: { maVaiTro },
    include: {
      vaiTroQuyen: {
        include: {
          quyen: true
        }
      },
      nguoiDungVaiTro: {
        include: {
          nguoiDung: {
            select: {
              maNguoiDung: true,
              hoTen: true,
              email: true
            }
          }
        }
      }
    }
  });
}

/**
 * Create new role
 */
export async function createRole(data: {
  tenVaiTro: string;
  maVaiTroKey: string;
  moTa?: string;
}) {
  return await prisma.vaiTro.create({
    data
  });
}

/**
 * Update role
 */
export async function updateRole(maVaiTro: number, data: {
  tenVaiTro?: string;
  moTa?: string;
}) {
  return await prisma.vaiTro.update({
    where: { maVaiTro },
    data
  });
}

/**
 * Delete role
 */
export async function deleteRole(maVaiTro: number) {
  return await prisma.vaiTro.delete({
    where: { maVaiTro }
  });
}

/**
 * Get all permissions
 */
export async function getAllPermissions() {
  return await prisma.quyen.findMany({
    orderBy: [
      { nhomQuyen: 'asc' },
      { tenQuyen: 'asc' }
    ]
  });
}

/**
 * Assign permission to role
 */
export async function assignPermissionToRole(maVaiTro: number, maQuyen: number) {
  return await prisma.vaiTroQuyen.create({
    data: {
      maVaiTro,
      maQuyen
    }
  });
}

/**
 * Remove permission from role
 */
export async function removePermissionFromRole(maVaiTro: number, maQuyen: number) {
  return await prisma.vaiTroQuyen.deleteMany({
    where: {
      maVaiTro,
      maQuyen
    }
  });
}

/**
 * Set role permissions (replace all)
 */
export async function setRolePermissions(maVaiTro: number, permissionIds: number[]) {
  await prisma.$transaction(async (tx) => {
    // Delete existing permissions
    await tx.vaiTroQuyen.deleteMany({
      where: { maVaiTro }
    });

    // Add new permissions
    if (permissionIds.length > 0) {
      await tx.vaiTroQuyen.createMany({
        data: permissionIds.map(maQuyen => ({
          maVaiTro,
          maQuyen
        }))
      });
    }
  });
}

/**
 * Get users with their roles
 */
export async function getUsersWithRoles(filters?: {
  search?: string;
  roleKey?: string;
  trangThai?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.search) {
    where.OR = [
      { hoTen: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { tenDangNhap: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  if (filters?.trangThai) {
    where.trangThai = filters.trangThai;
  }

  if (filters?.roleKey) {
    where.nguoiDungVaiTro = {
      some: {
        vaiTro: {
          maVaiTroKey: filters.roleKey
        }
      }
    };
  }

  const [users, total] = await Promise.all([
    prisma.nguoiDung.findMany({
      where,
      include: {
        nguoiDungVaiTro: {
          include: {
            vaiTro: true
          }
        },
        vienChuc: {
          include: {
            donVi: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        hoTen: 'asc'
      }
    }),
    prisma.nguoiDung.count({ where })
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
