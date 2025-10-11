import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export async function createSuperAdmin() {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.adminUser.findFirst({
      where: { role: 'super_admin' }
    });

    if (existingSuperAdmin) {
      console.log('Super admin already exists');
      return existingSuperAdmin;
    }

    // Create super admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const superAdmin = await prisma.adminUser.create({
      data: {
        username: 'superadmin',
        email: 'admin@mahagp.in',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true
      }
    });

    console.log('Super admin created successfully:', {
      username: superAdmin.username,
      email: superAdmin.email,
      role: superAdmin.role
    });

    return superAdmin;
  } catch (error) {
    console.error('Error creating super admin:', error);
    throw error;
  }
}
