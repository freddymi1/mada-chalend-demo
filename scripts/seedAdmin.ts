const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@madachaland.org' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@madachaland.org',
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Admin user created successfully:');
    console.log({
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    });
  } catch (error) {
    console.error('❌ Error creating admin user:');
    console.error(error);
  }
}

main()
  .catch((e) => {
    console.error('❌ Script failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });