const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugPrompts() {
    console.log('🔍 Debugging Prompts in Database...\n');
    
    // Check all prompts for Ubahcrypt project
    const { data: allPrompts, error: allError } = await supabase
        .from('project_prompts')
        .select('id, prompt, is_done, prompt_cycle_number, project')
        .eq('project', 'Ubahcrypt')
        .order('id', { ascending: true });

    if (allError) {
        console.error('❌ Error fetching all prompts:', allError.message);
        return;
    }

    console.log(`📊 Total prompts for 'Ubahcrypt': ${allPrompts.length}`);
    console.log(`✅ Completed prompts: ${allPrompts.filter(p => p.is_done).length}`);
    console.log(`⏳ Pending prompts: ${allPrompts.filter(p => !p.is_done).length}\n`);

    // Show details of each prompt
    allPrompts.forEach((prompt, index) => {
        const status = prompt.is_done ? '✅ DONE' : '⏳ PENDING';
        const preview = prompt.prompt.substring(0, 100) + '...';
        console.log(`${index + 1}. ID: ${prompt.id} | ${status} | Cycle: ${prompt.prompt_cycle_number}`);
        console.log(`   Preview: ${preview}\n`);
    });

    // Check for case-sensitive issues
    const { data: caseCheck, error: caseError } = await supabase
        .from('project_prompts')
        .select('project')
        .neq('project', 'Ubahcrypt');

    if (!caseError && caseCheck.length > 0) {
        console.log('⚠️  Found prompts with different project names:');
        const uniqueProjects = [...new Set(caseCheck.map(p => p.project))];
        uniqueProjects.forEach(project => {
            console.log(`   - "${project}"`);
        });
    }
}

debugPrompts().catch(err => {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
}); 