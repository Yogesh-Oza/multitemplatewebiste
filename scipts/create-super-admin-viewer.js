const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Get user details from command line arguments or environment variables
  const username = process.argv[2] || process.env.VIEWER_USERNAME || 'superadmin_viewer';
  const email = process.argv[3] || process.env.VIEWER_EMAIL || 'viewer@mahagp.in';
  const password = process.argv[4] || process.env.VIEWER_PASSWORD || 'viewer123';

  console.log('Creating super admin viewer user...');
  console.log('Username:', username);
  console.log('Email:', email);

  // Check if user already exists
  const existingUser = await prisma.adminUser.findUnique({
    where: { username }
  });

  if (existingUser) {
    console.log('User with username already exists:', {
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role
    });
    
    // Check if email is different
    if (existingUser.email !== email) {
      const existingEmail = await prisma.adminUser.findUnique({
        where: { email }
      });
      
      if (existingEmail) {
        console.error('User with email already exists:', {
          id: existingEmail.id,
          username: existingEmail.username,
          email: existingEmail.email,
          role: existingEmail.role
        });
        process.exit(1);
      }
    }
    
    // Update existing user to super_admin_viewer role
    const updatedUser = await prisma.adminUser.update({
      where: { username },
      data: {
        email,
        password: await bcrypt.hash(password, 12),
        role: 'super_admin_viewer',
        isActive: true
      }
    });
    
    console.log('User updated to super_admin_viewer:', {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role
    });
    return;
  }

  // Check if email already exists
  const existingEmail = await prisma.adminUser.findUnique({
    where: { email }
  });

  if (existingEmail) {
    console.error('User with email already exists:', {
      id: existingEmail.id,
      username: existingEmail.username,
      email: existingEmail.email,
      role: existingEmail.role
    });
    process.exit(1);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create super admin viewer user
  const user = await prisma.adminUser.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: 'super_admin_viewer',
      isActive: true
    }
  });

  console.log('Super admin viewer user created successfully!');
  console.log({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  });
  console.log('\nPassword:', password);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error creating super admin viewer:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

