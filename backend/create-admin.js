const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      // Reset password to a known value for access and ensure active
      const newPassword = await bcrypt.hash('admin123456', 10);
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { password: newPassword, isActive: true }
      });
      console.log('🔁 Admin password reset to default (please change after login).');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@ra7ba.com',
        password: hashedPassword,
        name: 'Ra7ba Admin',
        phone: '+213555000000',
        role: 'SUPER_ADMIN',
        isActive: true,
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@ra7ba.com');
    console.log('🔑 Password: admin123456');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
