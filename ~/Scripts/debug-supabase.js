const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://avdgyrepwrvsvwgxrccr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugSupabase() {
    try {
        console.log('🔍 Testing Supabase Connection...')
        
        // Test 1: Check if we can connect at all
        const { data: testData, error: testError } = await supabase
            .from('project_prompts')
            .select('count(*)')
            .limit(1)
        
        if (testError) {
            console.error('❌ Connection Error:', testError)
            return
        }
        
        console.log('✅ Supabase connection successful!')
        
        // Test 2: Show all projects available
        console.log('\n📊 All Projects in Database:')
        const { data: projects, error: projectsError } = await supabase
            .from('project_prompts')
            .select('project')
            .not('project', 'is', null)
        
        if (projectsError) {
            console.error('❌ Projects Error:', projectsError)
        } else {
            const uniqueProjects = [...new Set(projects.map(p => p.project))]
            uniqueProjects.forEach(project => console.log(`  - ${project}`))
        }
        
        // Test 3: Check specifically for Ubahcrypt
        console.log('\n🎯 Checking for Ubahcrypt project:')
        const { data: ubahcryptData, error: ubahcryptError } = await supabase
            .from('project_prompts')
            .select('*')
            .eq('project', 'Ubahcrypt')
            .order('id', { ascending: true })
        
        if (ubahcryptError) {
            console.error('❌ Ubahcrypt Error:', ubahcryptError)
        } else {
            console.log(`Found ${ubahcryptData.length} Ubahcrypt prompts:`)
            ubahcryptData.forEach(prompt => {
                console.log(`  ID: ${prompt.id} | Done: ${prompt.is_done} | Cycle: ${prompt.prompt_cycle_number || 'N/A'}`)
                console.log(`  Preview: ${prompt.prompt.substring(0, 100)}...`)
                console.log(`  ---`)
            })
        }
        
        // Test 4: Get next pending prompt (same as the main script)
        console.log('\n🔄 Next Pending Prompt:')
        const { data: nextPrompt, error: nextError } = await supabase
            .from('project_prompts')
            .select('*')
            .eq('project', 'Ubahcrypt')
            .eq('is_done', false)
            .order('id', { ascending: true })
            .limit(1)
            .single()
        
        if (nextError) {
            console.error('❌ Next Prompt Error:', nextError)
        } else {
            console.log('Next prompt to process:')
            console.log(`  ID: ${nextPrompt.id}`)
            console.log(`  Cycle: ${nextPrompt.prompt_cycle_number || 'N/A'}`)
            console.log(`  Done: ${nextPrompt.is_done}`)
            console.log(`  Times Used: ${nextPrompt.times_used || 0}`)
            console.log(`  Full Prompt:`)
            console.log(`${nextPrompt.prompt}`)
        }
        
    } catch (error) {
        console.error('❌ Unexpected Error:', error)
    }
}

debugSupabase() 