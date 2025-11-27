import 'dotenv/config';
import { prisma } from '../lib/db/prisma';
import bcrypt from 'bcryptjs';

async function testLogin() {
  try {
    const email = 'afya@theafya.org';
    const password = 'Mememe23!';

    console.log('Testing login for:', email);
    console.log('');

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  Role:', user.role);
    console.log('  Status:', user.status);
    console.log('');

    // Check password
    if (!user.password) {
      console.log('❌ User has no password set');
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (passwordMatch) {
      console.log('✅ Password matches!');
      console.log('');
      console.log('Login should work with:');
      console.log('  Email:', email);
      console.log('  Password:', password);
      console.log('');
      console.log('Try logging in at: http://localhost:3000/login');
    } else {
      console.log('❌ Password does not match');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
