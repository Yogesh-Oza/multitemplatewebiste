const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const {
  seedGovernanceForSubdomain,
  seedGovernanceDemoForSubdomain,
} = require('../scripts/governance-default-seed.cjs');

const prisma = new PrismaClient();

async function main() {
  const isProd = process.env.NODE_ENV === 'production';
  let username = process.env.ADMIN_USERNAME;
  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    if (isProd) {
      console.error(
        'Set ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD in the environment before seeding in production.'
      );
      process.exit(1);
    }
    username = username || 'admin';
    email = email || 'admin@localhost';
    password = password || 'admin123';
    console.warn(
      'ADMIN_* not set; using local dev defaults (admin / admin@localhost / admin123). Add ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD to .env to override.'
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.upsert({
    where: { username },
    update: {
      username,
      password: hashed,
      isActive: true,
      role: 'admin',
      email,
    },
    create: {
      username,
      email,
      password: hashed,
      isActive: true,
      role: 'admin',
    },
  });

  console.log('Seeded AdminUser:', { id: user.id, username: user.username, email: user.email });

  // Create test subdomains
  const testSubdomains = [
    {
      subdomain: 'pune',
      villageName: 'पुणे',
      villageNameEn: 'Pune',
      contactPerson: 'पुणे प्रशासक',
      email: 'pune@example.com',
      phone: '1234567890',
      address: 'पुणे, महाराष्ट्र',
      description: 'पुणे ग्रामपंचायत',
      adminUsername: 'pune_admin',
      adminPassword: 'pune123',
      status: 'active',
      isActive: true
    },
    {
      subdomain: 'nagpur',
      villageName: 'नागपूर',
      villageNameEn: 'Nagpur',
      contactPerson: 'नागपूर प्रशासक',
      email: 'nagpur@example.com',
      phone: '1234567891',
      address: 'नागपूर, महाराष्ट्र',
      description: 'नागपूर ग्रामपंचायत',
      adminUsername: 'nagpur_admin',
      adminPassword: 'nagpur123',
      status: 'active',
      isActive: true
    }
  ];

  for (const subdomainData of testSubdomains) {
    const existingSubdomain = await prisma.subdomain.findUnique({
      where: { subdomain: subdomainData.subdomain }
    });

    if (!existingSubdomain) {
      const subdomain = await prisma.subdomain.create({
        data: subdomainData
      });

      // Create admin user for this subdomain
      const adminHashed = await bcrypt.hash(subdomainData.adminPassword, 10);
      await prisma.adminUser.create({
        data: {
          username: subdomainData.adminUsername,
          email: subdomainData.email,
          password: adminHashed,
          role: 'admin',
          subdomainId: subdomain.id,
          isActive: true
        }
      });

      console.log(`Created subdomain: ${subdomainData.subdomain} with admin: ${subdomainData.adminUsername}`);
    } else {
      console.log(`Subdomain ${subdomainData.subdomain} already exists`);
    }
  }

  await seedGovernance(prisma);
  await seedGovernanceDemoContent(prisma);
}

/** Same default “template” copy per village; village admins edit via admin panel. */
async function seedGovernance(prisma) {
  const subs = await prisma.subdomain.findMany();
  for (const s of subs) {
    await seedGovernanceForSubdomain(prisma, s);
  }
  console.log('Governance seed: RTI clauses + citizen services (if empty) for all subdomains.');
}

/** Demo rows per subdomain (idempotent); skipped where data already exists. */
async function seedGovernanceDemoContent(prisma) {
  const subs = await prisma.subdomain.findMany();
  for (const s of subs) {
    await seedGovernanceDemoForSubdomain(prisma, s);
  }
  console.log('Demo content seed finished (governance pages).');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
