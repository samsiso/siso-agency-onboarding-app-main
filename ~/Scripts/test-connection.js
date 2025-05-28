const { createClient } = require("@supabase/supabase-js");

async function testConnection() {
    const supabaseUrl = "https://avdgyrepwrvsvwgxrccr.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU";
    
    console.log("Testing Supabase connection...");
    console.log("URL:", supabaseUrl);
    console.log("Key length:", supabaseKey.length);
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
        // Test 1: Simple table query
        console.log("\n1. Testing basic table access...");
        const { data, error, count } = await supabase
            .from("project_prompts")
            .select("*", { count: "exact" })
            .limit(5);
            
        if (error) {
            console.log("Error:", error.message);
            console.log("Error code:", error.code);
            console.log("Error details:", error.details);
            console.log("Error hint:", error.hint);
        } else {
            console.log("Success! Found", count, "total records");
            console.log("Sample data:", data);
        }
        
        // Test 2: Test Ubahcrypt filter
        console.log("\n2. Testing Ubahcrypt filter...");
        const { data: ubahData, error: ubahError } = await supabase
            .from("project_prompts")
            .select("*")
            .eq("project", "Ubahcrypt")
            .limit(5);
            
        if (ubahError) {
            console.log("Ubahcrypt Error:", ubahError.message);
        } else {
            console.log("Ubahcrypt records found:", ubahData.length);
            console.log("Ubahcrypt data:", ubahData);
        }
        
    } catch (err) {
        console.log("Caught error:", err.message);
    }
}

testConnection(); 