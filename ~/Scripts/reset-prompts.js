const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function resetAllPrompts() {
    console.log('🔄 Resetting all Ubahcrypt prompts...');
    
    // First, get count of prompts that will be reset
    const { data: countData, error: countError } = await supabase
        .from('project_prompts')
        .select('id')
        .eq('project', 'Ubahcrypt');

    if (countError) {
        console.error('Error counting prompts:', countError.message);
        process.exit(1);
    }

    const totalCount = countData.length;
    console.log(`📊 Found ${totalCount} Ubahcrypt prompts to reset`);

    // Reset all Ubahcrypt prompts
    const { data, error } = await supabase
        .from('project_prompts')
        .update({ 
            is_done: false,
            times_used: 0,
            last_used: null
        })
        .eq('project', 'Ubahcrypt');

    if (error) {
        console.error('Error resetting prompts:', error.message);
        process.exit(1);
    }

    console.log(`✅ Successfully reset ${totalCount} prompts!`);
    console.log('   - is_done: false');
    console.log('   - times_used: 0');
    console.log('   - last_used: null');
    console.log('\n🎯 All prompts are now ready for fresh testing!');
}

resetAllPrompts().catch(err => {
    console.error('Unexpected error:', err.message);
    process.exit(1);
}); 