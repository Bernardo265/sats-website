#!/usr/bin/env node

/**
 * Admin Setup Script for SafeSats
 * This script helps you set up the first admin user for the blog and subscription system
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupAdmin() {
  console.log('\n🚀 SafeSats Admin Setup');
  console.log('========================\n');
  
  console.log('This script will help you set up your first admin user.');
  console.log('You need to have already:');
  console.log('1. ✅ Created your Supabase project');
  console.log('2. ✅ Run the database setup SQL script');
  console.log('3. ✅ Set up your environment variables\n');

  const proceed = await question('Do you want to continue? (y/n): ');
  
  if (proceed.toLowerCase() !== 'y') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  console.log('\n📋 Please provide the following information:\n');

  const email = await question('Admin email address: ');
  const fullName = await question('Full name: ');
  const password = await question('Password (min 6 characters): ');

  console.log('\n🔧 Setup Instructions:');
  console.log('======================\n');

  console.log('1. First, register this user through your normal registration process:');
  console.log(`   - Go to your website's registration page`);
  console.log(`   - Register with email: ${email}`);
  console.log(`   - Use the password you provided`);
  console.log(`   - Complete email verification if required\n`);

  console.log('2. Then, update the user role in Supabase:');
  console.log('   - Go to your Supabase dashboard');
  console.log('   - Navigate to Table Editor > profiles');
  console.log(`   - Find the user with email: ${email}`);
  console.log('   - Update the "role" column to: super_admin');
  console.log('   - Update the "full_name" column to:', fullName);
  console.log('   - Save the changes\n');

  console.log('3. Alternative: Run this SQL in your Supabase SQL Editor:');
  console.log('   ```sql');
  console.log('   UPDATE profiles SET');
  console.log('     role = \'super_admin\',');
  console.log(`     full_name = '${fullName}'`);
  console.log(`   WHERE email = '${email}';`);
  console.log('   ```\n');

  console.log('4. Test admin access:');
  console.log('   - Go to /login on your website');
  console.log(`   - Login with: ${email}`);
  console.log('   - After login, navigate to /admin');
  console.log('   - You should see the admin dashboard\n');

  console.log('🎉 Setup complete!');
  console.log('\nYour admin system includes:');
  console.log('- 📝 Blog management with rich text editor');
  console.log('- 📧 Email subscription management');
  console.log('- 👥 User role management');
  console.log('- 📊 Analytics dashboard');
  console.log('- 🔒 Role-based access control\n');

  console.log('Need help? Check the SETUP_GUIDE.md file for detailed instructions.\n');

  rl.close();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Error:', error.message);
  rl.close();
  process.exit(1);
});

// Run setup
setupAdmin().catch(console.error);