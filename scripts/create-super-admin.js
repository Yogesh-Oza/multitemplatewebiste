const { createSuperAdmin } = require('../src/lib/create-super-admin.ts');

async function main() {
  try {
    console.log('Creating super admin user...');
    const superAdmin = await createSuperAdmin();
    console.log('Super admin created successfully!');
    console.log('Login credentials:');
    console.log('Username: superadmin');
    console.log('Password: admin123');
    console.log('Email: admin@mahagp.in');
    console.log('Role: super_admin');
    console.log('\nYou can now login at: http://localhost:3000/super-admin-login');
  } catch (error) {
    console.error('Failed to create super admin:', error);
    process.exit(1);
  }
}

main();
