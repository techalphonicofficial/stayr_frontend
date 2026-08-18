import prisma from '../config/prisma.js';

// ==========================================
// ROLES
// ==========================================

export const getRoles = async () => {
  return await prisma.accessRole.findMany({
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createRole = async (data) => {
  const { name, description, permissionIds } = data;
  
  const existingRole = await prisma.accessRole.findUnique({ where: { name } });
  if (existingRole) {
    throw new Error('A role with this name already exists.');
  }

  return await prisma.$transaction(async (tx) => {
    const role = await tx.accessRole.create({
      data: { name, description }
    });

    if (permissionIds && permissionIds.length > 0) {
      const rolePermissions = permissionIds.map(id => ({
        roleId: role.id,
        permissionId: id
      }));
      await tx.rolePermission.createMany({ data: rolePermissions });
    }

    return role;
  });
};

export const updateRole = async (id, data) => {
  const { name, description, permissionIds } = data;

  if (name) {
    const existingRole = await prisma.accessRole.findFirst({
      where: { name, id: { not: id } }
    });
    if (existingRole) {
      throw new Error('A role with this name already exists.');
    }
  }

  return await prisma.$transaction(async (tx) => {
    const role = await tx.accessRole.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description })
      }
    });

    if (permissionIds !== undefined) {
      // Clear existing
      await tx.rolePermission.deleteMany({ where: { roleId: id } });
      
      // Insert new
      if (permissionIds.length > 0) {
        const rolePermissions = permissionIds.map(permId => ({
          roleId: id,
          permissionId: permId
        }));
        await tx.rolePermission.createMany({ data: rolePermissions });
      }
    }

    return role;
  });
};

export const deleteRole = async (id) => {
  const role = await prisma.accessRole.findUnique({ where: { id } });
  if (!role) throw new Error('Role not found');
  
  if (role.name === 'Admin') {
    throw new Error('Cannot delete the system Admin role.');
  }

  await prisma.accessRole.delete({ where: { id } });
  return { id };
};

// ==========================================
// MODULES
// ==========================================

export const getModules = async () => {
  return await prisma.accessModule.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const createModule = async (data) => {
  const { name, slug } = data;
  
  const existing = await prisma.accessModule.findFirst({
    where: { OR: [{ name }, { slug }] }
  });
  if (existing) throw new Error('A module with this name or slug already exists.');

  return await prisma.accessModule.create({
    data: { name, slug }
  });
};

export const updateModule = async (id, data) => {
  const { name, slug } = data;
  
  if (name || slug) {
    const existing = await prisma.accessModule.findFirst({
      where: { 
        OR: [
          ...(name ? [{ name }] : []),
          ...(slug ? [{ slug }] : [])
        ],
        id: { not: id }
      }
    });
    if (existing) throw new Error('A module with this name or slug already exists.');
  }

  return await prisma.accessModule.update({
    where: { id },
    data
  });
};

export const deleteModule = async (id) => {
  await prisma.accessModule.delete({ where: { id } });
  return { id };
};

// ==========================================
// PERMISSIONS
// ==========================================

export const getPermissions = async () => {
  return await prisma.accessPermission.findMany({
    include: {
      module: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createPermission = async (data) => {
  const { name, moduleId } = data;
  
  const existing = await prisma.accessPermission.findUnique({ where: { name } });
  if (existing) throw new Error('A permission with this name already exists.');

  return await prisma.accessPermission.create({
    data: { name, moduleId }
  });
};

export const updatePermission = async (id, data) => {
  const { name, moduleId } = data;
  
  if (name) {
    const existing = await prisma.accessPermission.findFirst({
      where: { name, id: { not: id } }
    });
    if (existing) throw new Error('A permission with this name already exists.');
  }

  return await prisma.accessPermission.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(moduleId && { moduleId })
    }
  });
};

export const deletePermission = async (id) => {
  await prisma.accessPermission.delete({ where: { id } });
  return { id };
};

// ==========================================
// VENDOR REQUESTS
// ==========================================

export const getVendorRequests = async (query = {}) => {
  const { page = 1, limit = 10, search = '', status = 'ALL' } = query;
  const skip = (page - 1) * limit;

  let whereClause = {};

  if (status !== 'ALL') {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { businessName: { contains: search } },
      { ownerName: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const [total, requests] = await Promise.all([
    prisma.vendorRequest.count({ where: whereClause }),
    prisma.vendorRequest.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return { total, requests };
};

export const approveVendorRequest = async (id) => {
  const request = await prisma.vendorRequest.findUnique({ where: { id } });
  if (!request) throw new Error('Vendor request not found');
  if (request.status !== 'PENDING') throw new Error('Only pending requests can be approved');

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.vendorRequest.update({
      where: { id },
      data: { status: 'APPROVED' }
    });

    let user = await tx.user.findUnique({ where: { email: request.email } });
    if (!user) {
      user = await tx.user.create({
        data: {
          name: request.ownerName,
          email: request.email,
          phone: request.phone,
          password: 'VendorPassword123!', 
          role: 'Vendor',
          isVerified: true
        }
      });
    } else {
      await tx.user.update({
        where: { id: user.id },
        data: { role: 'Vendor', isVerified: true }
      });
    }

    return updated;
  });
};

export const rejectVendorRequest = async (id) => {
  const request = await prisma.vendorRequest.findUnique({ where: { id } });
  if (!request) throw new Error('Vendor request not found');
  if (request.status !== 'PENDING') throw new Error('Only pending requests can be rejected');

  return await prisma.vendorRequest.update({
    where: { id },
    data: { status: 'REJECTED' }
  });
};

export const getVendorRequestStats = async () => {
  const stats = await prisma.vendorRequest.groupBy({
    by: ['status'],
    _count: { id: true }
  });

  const total = await prisma.vendorRequest.count();
  
  const formatted = {
    pending: 0,
    approved: 0,
    rejected: 0,
    all: total
  };

  stats.forEach(stat => {
    if (stat.status === 'PENDING') formatted.pending = stat._count.id;
    if (stat.status === 'APPROVED') formatted.approved = stat._count.id;
    if (stat.status === 'REJECTED') formatted.rejected = stat._count.id;
  });

  return formatted;
};

// ==========================================
// USERS (Admin/Employee Management)
// ==========================================

export const createUser = async (data) => {
  const { name, email, phone, role, accessRoleId, password } = data;
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('A user with this email already exists.');

  return await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: password || 'Welcome123!', // Require changing later
      role: role || 'Employee',
      accessRoleId: accessRoleId || null,
      isVerified: true,
      isActive: true
    },
    select: { id: true, name: true, email: true, role: true, accessRole: { select: { name: true } } }
  });
};

export const updateUserRole = async (id, data) => {
  const { role, accessRoleId } = data;
  return await prisma.user.update({
    where: { id },
    data: { role, accessRoleId },
    select: { id: true, name: true, email: true, role: true, accessRole: { select: { name: true } } }
  });
};
