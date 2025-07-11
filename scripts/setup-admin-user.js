#!/usr/bin/env node

/**
 * Setup script to ensure there's an admin user for LifeLock migration
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Need VITE_SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrCreateAdminUser() {
  console.log('🔍 Checking for existing admin users...');
  
  // Check if we have any admin users
  const { data: adminUsers, error: adminError } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin')
    .limit(1);

  if (adminError) {
    console.error('❌ Error checking admin users:', adminError);
    process.exit(1);
  }

  if (adminUsers && adminUsers.length > 0) {
    console.log('✅ Found existing admin user:', adminUsers[0].user_id);
    return adminUsers[0].user_id;
  }

  console.log('⚠️  No admin users found. Checking profiles table...');
  
  // Check if we have any users in profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);
  
  if (profilesError) {
    console.error('❌ Error fetching profiles:', profilesError);
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    console.log('⚠️  No users found in the system. Please sign up first through the app.');
    console.log('');
    console.log('📝 To create an admin user:');
    console.log('   1. Visit your app and sign up with an account');
    console.log('   2. Run this script again to promote that user to admin');
    process.exit(1);
  }

  // Use the first user and make them admin
  const firstUser = profiles[0];
  console.log(`👤 Found user: ${firstUser.id}`);
  console.log('🔧 Promoting to admin...');

  // Add to user_roles table
  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({
      user_id: firstUser.id,
      role: 'admin'
    });

  if (roleError) {
    console.error('❌ Error creating admin role:', roleError);
    process.exit(1);
  }

  // Update profile to admin
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      role: 'admin',
      onboarding_completed: true
    })
    .eq('id', firstUser.id);

  if (profileError) {
    console.error('❌ Error updating profile:', profileError);
    // Don't exit, role was created
  }

  console.log('✅ User promoted to admin successfully!');
  return firstUser.id;
}

async function main() {
  try {
    const adminUserId = await checkOrCreateAdminUser();
    console.log('🎉 Admin user ready:', adminUserId);
    console.log('');
    console.log('▶️  You can now run: npm run migrate:lifelock');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);