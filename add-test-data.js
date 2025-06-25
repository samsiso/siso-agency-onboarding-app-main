// Test script to add sample data to portfolio_items table
import { createClient } from '@supabase/supabase-js'

// Note: Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

const testData = [
  {
    title: 'Gritness',
    client_name: 'Gym',
    live_url: 'https://gritnessgym.vercel.app',
    client_source: 'Personal Network',
    project_status: 'not_contacted',
    user_id: '00000000-0000-0000-0000-000000000001',
    description: 'Gym niche website for fitness enthusiasts',
    technologies: ['React', 'Next.js', 'Tailwind CSS']
  },
  {
    title: 'NM Construction',
    client_name: 'Construction',
    live_url: 'https://nm-construction.vercel.app',
    client_source: 'Personal Network',
    project_status: 'contacted',
    user_id: '00000000-0000-0000-0000-000000000002',
    description: 'Construction company website showcasing projects and services',
    technologies: ['React', 'Next.js', 'Tailwind CSS']
  },
  {
    title: 'UbahCryp',
    client_name: 'Web3 Trading',
    live_url: 'https://ubahcrypcom.vercel.app',
    client_source: 'Snapchat',
    project_status: 'feedback_app',
    user_id: '00000000-0000-0000-0000-000000000003',
    description: 'Web3 trading platform for cryptocurrency enthusiasts',
    technologies: ['React', 'Web3.js', 'Tailwind CSS']
  }
]

async function addTestData() {
  try {
    console.log('Adding test data to portfolio_items table...')
    
    // Check if data already exists
    const { data: existingData, error: checkError } = await supabase
      .from('portfolio_items')
      .select('title')
      .in('title', testData.map(item => item.title))
    
    if (checkError) {
      console.error('Error checking existing data:', checkError)
      return
    }
    
    if (existingData && existingData.length > 0) {
      console.log('Test data already exists:', existingData.map(item => item.title))
      return
    }
    
    // Insert test data
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert(testData)
      .select()
    
    if (error) {
      console.error('Error inserting test data:', error)
      return
    }
    
    console.log('Successfully added test data:', data)
    console.log('✅ Test data has been added to the portfolio_items table')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the function
addTestData()