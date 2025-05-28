const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPromptStatus() {
    try {
        console.log('📊 Checking Ubahcrypt prompt status and usage...\n')
        
        // Get recent prompts with their usage stats
        const { data: prompts, error } = await supabase
            .from('project_prompts')
            .select('id, prompt_cycle_number, is_done, times_used, last_used, created_at')
            .eq('project', 'Ubahcrypt')
            .order('id', { ascending: true })
            .limit(50)  // Get last 50 prompts
        
        if (error) {
            console.error('❌ Error:', error)
            return
        }
        
        console.log(`Found ${prompts.length} Ubahcrypt prompts:\n`)
        
        let doneCount = 0
        let totalUsage = 0
        
        prompts.forEach(prompt => {
            const usedTimes = prompt.times_used || 0
            const lastUsed = prompt.last_used ? new Date(prompt.last_used).toLocaleString() : 'Never'
            const status = prompt.is_done ? '✅ Done' : '⏳ Pending'
            
            console.log(`ID: ${prompt.id} | Cycle: ${prompt.prompt_cycle_number || 'N/A'} | ${status}`)
            console.log(`  Times Used: ${usedTimes} | Last Used: ${lastUsed}`)
            console.log(`  Created: ${new Date(prompt.created_at).toLocaleString()}`)
            console.log('  ---')
            
            if (prompt.is_done) doneCount++
            totalUsage += usedTimes
        })
        
        console.log('\n📈 SUMMARY:')
        console.log(`  Total Prompts: ${prompts.length}`)
        console.log(`  Completed: ${doneCount}`)
        console.log(`  Pending: ${prompts.length - doneCount}`)
        console.log(`  Total Usage Count: ${totalUsage}`)
        
        // Show most recently used
        const recentlyUsed = prompts
            .filter(p => p.last_used)
            .sort((a, b) => new Date(b.last_used) - new Date(a.last_used))
            .slice(0, 5)
        
        if (recentlyUsed.length > 0) {
            console.log('\n🕒 Most Recently Used:')
            recentlyUsed.forEach(prompt => {
                console.log(`  ID: ${prompt.id} | Used: ${new Date(prompt.last_used).toLocaleString()} | Times: ${prompt.times_used}`)
            })
        }
        
    } catch (error) {
        console.error('❌ Unexpected Error:', error)
    }
}

checkPromptStatus() 