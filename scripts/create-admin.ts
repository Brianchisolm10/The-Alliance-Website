import 'dotenv/config';
import { prisma } from '../lib/db/prisma';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    const email = 'afya@theafya.org';
    const password = 'Mememe23!';
    const name = 'AFYA Admin';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('❌ User with this email already exists');
      console.log('User ID:', existingUser.id);
      console.log('Email:', existingUser.email);
      console.log('Role:', existingUser.role);
      
      // Update to admin if not already
      if (existingUser.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'ADMIN' },
        });
        console.log('✅ Updated user role to ADMIN');
      }
      
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        status: 'ACTIVE', // Set status to active
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('');
    console.log('User details:');
    console.log('ID:', user.id);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
    console.log('');
    console.log('You can now login at: http://localhost:3000/login');
    console.log('Admin panel: http://localhost:3000/admin/dashboard');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
