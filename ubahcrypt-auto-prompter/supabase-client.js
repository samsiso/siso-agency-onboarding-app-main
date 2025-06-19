const { createClient } = require('@supabase/supabase-js');

// ⚠️  IMPORTANT: Update these with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';  // e.g., 'https://your-project.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';  // Your anon/public key from Supabase dashboard
const supabase = createClient(supabaseUrl, supabaseKey);

// ⚠️  IMPORTANT: Update this with your actual project name
const PROJECT_NAME = 'YOUR_PROJECT_NAME';  // e.g., 'Ubahcrypt', 'MyProject', etc.

// Function to get the next pending prompt (filter by project and lowest ID only)
async function getNextPrompt() {
    const { data, error } = await supabase
        .from('project_prompts')
        .select('id, prompt, prompt_cycle_number')
        .eq('is_done', false)
        .eq('project', PROJECT_NAME)
        .order('id', { ascending: true })
        .limit(1)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows found
            return null;
        }
        console.error('Error fetching prompt:', error.message);
        process.exit(1);
    }

    return data;
}

// Function to mark a prompt as done
async function markPromptAsDone(promptId) {
    const { data: current, error: fetchError } = await supabase
        .from('project_prompts')
        .select('times_used')
        .eq('id', promptId)
        .single();

    if (fetchError) {
        console.error('Error fetching times_used:', fetchError.message);
        process.exit(1);
    }

    const newTimesUsed = (current.times_used || 0) + 1;
    const currentTimestamp = new Date().toISOString();

    const { error } = await supabase
        .from('project_prompts')
        .update({ 
            is_done: true,
            times_used: newTimesUsed,
            last_used: currentTimestamp
        })
        .eq('id', promptId);

    if (error) {
        console.error('Error marking prompt as done:', error.message);
        process.exit(1);
    }
}

// Function to check prompt status and usage
async function checkPromptStatus() {
    const { data: prompts, error } = await supabase
        .from('project_prompts')
        .select('id, prompt_cycle_number, is_done, times_used, last_used, created_at')
        .eq('project', PROJECT_NAME)
        .order('id', { ascending: true })
        .limit(50);  // Get last 50 prompts

    if (error) {
        console.error('Error fetching prompts:', error.message);
        process.exit(1);
    }

    console.log(`📊 ${PROJECT_NAME} Prompt Status & Usage:\n`);
    
    let doneCount = 0;
    let totalUsage = 0;
    
    prompts.forEach(prompt => {
        const usedTimes = prompt.times_used || 0;
        const lastUsed = prompt.last_used ? new Date(prompt.last_used).toLocaleString() : 'Never';
        const status = prompt.is_done ? '✅ Done' : '⏳ Pending';
        
        console.log(`ID: ${prompt.id} | Cycle: ${prompt.prompt_cycle_number || 'N/A'} | ${status}`);
        console.log(`  Times Used: ${usedTimes} | Last Used: ${lastUsed}`);
        console.log('  ---');
        
        if (prompt.is_done) doneCount++;
        totalUsage += usedTimes;
    });
    
    console.log('\n📈 SUMMARY:');
    console.log(`  Total Prompts: ${prompts.length}`);
    console.log(`  Completed: ${doneCount}`);
    console.log(`  Pending: ${prompts.length - doneCount}`);
    console.log(`  Total Usage Count: ${totalUsage}`);
}

// Function to reset all prompts for testing
async function resetAllPrompts() {
    console.log(`🔄 Resetting all ${PROJECT_NAME} prompts...`);
    
    // First, get count of prompts that will be reset
    const { data: countData, error: countError } = await supabase
        .from('project_prompts')
        .select('id')
        .eq('project', PROJECT_NAME);

    if (countError) {
        console.error('Error counting prompts:', countError.message);
        process.exit(1);
    }

    const totalCount = countData.length;
    console.log(`📊 Found ${totalCount} ${PROJECT_NAME} prompts to reset`);

    // Reset all prompts for this project
    const { data, error } = await supabase
        .from('project_prompts')
        .update({ 
            is_done: false,
            times_used: 0,
            last_used: null
        })
        .eq('project', PROJECT_NAME);

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

// Main function to handle command-line arguments
async function main() {
    const action = process.argv[2];

    if (action === 'get') {
        const prompt = await getNextPrompt();
        if (prompt) {
            console.log(JSON.stringify(prompt));
        } else {
            console.log('{}'); // No pending prompts
        }
    } else if (action === 'mark-done') {
        const promptId = parseInt(process.argv[3], 10);
        await markPromptAsDone(promptId);
        console.log('Prompt marked as done');
    } else if (action === 'status') {
        await checkPromptStatus();
    } else if (action === 'reset') {
        await resetAllPrompts();
    } else {
        console.error('Invalid action. Use "get", "mark-done", "status", or "reset".');
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Unexpected error:', err.message);
    process.exit(1);
}); 