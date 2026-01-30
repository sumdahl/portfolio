import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'sumirandahal46@gmail.com';
  const password = process.argv[2] || 'admin123';

  console.log('Creating admin user in Supabase...');
  console.log('Email:', email);

  // Create Supabase admin client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Sumiran Dahal',
      },
    });

    if (error) {
      console.error('❌ Error creating admin user:', error.message);
      process.exit(1);
    }

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', data.user.id);
    console.log('\n⚠️  Please change the password after first login!');
    console.log('\n📝 Note: If using anon key, the user can also be created by:');
    console.log('   1. Signing up at /login');
    console.log('   2. Manually setting role=admin in Supabase Dashboard > Authentication > Users');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdminUser();
