// 🧪 DYNAMIC PROMPT ENGINE TEST SCRIPT
// Demonstrates how the engine analyzes messages and builds contextual prompts

const { TelegramPromptEngine } = require('./telegram-dynamic-prompt-engine.js');

// Initialize the prompt engine
const promptEngine = new TelegramPromptEngine();

// 🧪 TEST MESSAGES
const testMessages = [
  {
    message: "How much have we spent on software this year?",
    expected: "financial_query",
    description: "Financial data query"
  },
  {
    message: "How is Sarah performing this month?",
    expected: "team_performance_query", 
    description: "Team performance query"
  },
  {
    message: "What's the status of UbahCryp project?",
    expected: "project_status_query",
    description: "Project status query"
  },
  {
    message: "The login page is broken and showing errors",
    expected: "create_bug_issue",
    description: "Bug report"
  },
  {
    message: "We need to add dark mode to the dashboard",
    expected: "create_feature_request",
    description: "Feature request"
  },
  {
    message: "Can you help me with my todo list?",
    expected: "route_to_todo",
    description: "General task management"
  }
];

// 🔍 TEST FUNCTION
function runTests() {
  console.log('🚀 DYNAMIC PROMPT ENGINE TESTS\n');
  console.log('=' .repeat(60));
  
  testMessages.forEach((test, index) => {
    console.log(`\n📝 TEST ${index + 1}: ${test.description}`);
    console.log(`📨 Message: "${test.message}"`);
    
    // Analyze the message
    const analysis = promptEngine.analyzeMessage(test.message);
    
    console.log(`🎯 Analysis Result:`);
    console.log(`   Intent: ${analysis.intent}`);
    console.log(`   Suggested Action: ${analysis.suggested_action}`);
    console.log(`   Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
    console.log(`   Required Tools: ${analysis.required_tools.map(t => t.tool).join(', ')}`);
    
    // Check if matches expected
    const isCorrect = analysis.suggested_action === test.expected;
    console.log(`   ✅ Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'} (Expected: ${test.expected})`);
    
    // Build contextual prompt
    const contextualPrompt = promptEngine.buildContextualPrompt(test.message, analysis);
    console.log(`   📏 Prompt Length: ${contextualPrompt.length} characters`);
    
    // Show first 200 characters of prompt for debugging
    console.log(`   📋 Prompt Preview: "${contextualPrompt.substring(0, 200)}..."`);
    
    console.log('-'.repeat(60));
  });
  
  // Show tool inventory
  console.log('\n🔧 AVAILABLE TOOLS:');
  const inventory = promptEngine.getToolInventory();
  inventory.forEach(tool => {
    console.log(`   • ${tool.name} (${tool.type}): ${tool.capabilities.join(', ')}`);
  });
  
  console.log('\n✅ Tests completed!');
}

// 🔄 TOOL REGISTRATION TEST
function testToolRegistration() {
  console.log('\n🔧 TESTING TOOL REGISTRATION\n');
  
  // Register a new tool
  promptEngine.registerTool('email_automation', {
    name: "Email Automation",
    type: "communication",
    capabilities: ["send_email", "schedule_email", "template_management"],
    triggers: ["email", "send", "notify", "contact", "message"],
    actions: ["send_immediate", "schedule_later", "use_template"],
    example_usage: [
      "Send email to client → Triggers email automation",
      "Schedule follow-up → Creates scheduled email"
    ]
  });
  
  // Test with email-related message
  const emailMessage = "Send an email to the client about project update";
  console.log(`📨 Testing email message: "${emailMessage}"`);
  
  const analysis = promptEngine.analyzeMessage(emailMessage);
  console.log(`🎯 Analysis Result:`);
  console.log(`   Intent: ${analysis.intent}`);
  console.log(`   Required Tools: ${analysis.required_tools.map(t => t.tool).join(', ')}`);
  console.log(`   Tool Matches: ${analysis.required_tools.map(t => t.matches).flat().join(', ')}`);
  
  console.log('\n✅ Tool registration test completed!');
}

// 📊 PERFORMANCE TEST
function performanceTest() {
  console.log('\n⚡ PERFORMANCE TEST\n');
  
  const iterations = 1000;
  const testMessage = "How much revenue did we generate last month?";
  
  console.log(`🔄 Running ${iterations} iterations with message: "${testMessage}"`);
  
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    const analysis = promptEngine.analyzeMessage(testMessage);
    const prompt = promptEngine.buildContextualPrompt(testMessage, analysis);
  }
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;
  
  console.log(`⏱️ Performance Results:`);
  console.log(`   Total Time: ${totalTime}ms`);
  console.log(`   Average Time per Analysis: ${avgTime.toFixed(2)}ms`);
  console.log(`   Operations per Second: ${(1000 / avgTime).toFixed(0)}`);
  
  console.log('\n✅ Performance test completed!');
}

// 🚀 RUN ALL TESTS
if (require.main === module) {
  runTests();
  testToolRegistration();
  performanceTest();
}

module.exports = { runTests, testToolRegistration, performanceTest }; 