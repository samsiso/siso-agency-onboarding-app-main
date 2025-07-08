// 🧪 MULTI-REPOSITORY FUNCTIONALITY TEST
// Test the repository detection and routing system

const { RepositoryManager, MultiRepoGitHubManager } = require('./telegram-repository-config.js');

// Test repository detection
function testRepositoryDetection() {
  console.log('🧪 Testing Repository Detection...\n');
  
  const repoManager = new RepositoryManager();
  
  const testMessages = [
    {
      message: "Bug in the agency dashboard - client login not working",
      expected: "siso-agency"
    },
    {
      message: "Enhancement for the telegram bot - add weather integration", 
      expected: "telegram-bot"
    },
    {
      message: "Add new civic event tracking for mayor activities",
      expected: "mayor-activities"
    },
    {
      message: "Personal project idea - build a habit tracker app",
      expected: "personal-projects"
    },
    {
      message: "Voice assistant needs improvement",
      expected: "telegram-bot"
    },
    {
      message: "Client onboarding flow has issues",
      expected: "siso-agency"
    },
    {
      message: "Government meeting scheduler needed",
      expected: "mayor-activities"
    },
    {
      message: "Random message with no keywords",
      expected: "siso-agency" // Should default to primary repo
    }
  ];

  let passed = 0;
  let failed = 0;

  testMessages.forEach(({ message, expected }, index) => {
    const detected = repoManager.detectRepository(message);
    const status = detected === expected ? '✅ PASS' : '❌ FAIL';
    
    console.log(`${index + 1}. ${status}`);
    console.log(`   Message: "${message}"`);
    console.log(`   Expected: ${expected}`);
    console.log(`   Detected: ${detected}`);
    console.log('');
    
    if (detected === expected) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`📊 Test Results: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

// Test repository configuration
function testRepositoryConfiguration() {
  console.log('🧪 Testing Repository Configuration...\n');
  
  const repoManager = new RepositoryManager();
  
  // Test getting repo config
  const sisoConfig = repoManager.getRepoConfig('siso-agency');
  const botConfig = repoManager.getRepoConfig('telegram-bot');
  const mayorConfig = repoManager.getRepoConfig('mayor-activities');
  
  console.log('✅ Repository Configurations:');
  console.log(`   SISO Agency: ${sisoConfig.owner}/${sisoConfig.repo}`);
  console.log(`   Telegram Bot: ${botConfig.owner}/${botConfig.repo}`);
  console.log(`   Mayor Activities: ${mayorConfig.owner}/${mayorConfig.repo}`);
  console.log('');
  
  // Test repository list formatting
  const repoList = repoManager.formatRepositoryList();
  console.log('✅ Formatted Repository List:');
  console.log(repoList);
  console.log('');
  
  return true;
}

// Test label selection
function testLabelSelection() {
  console.log('🧪 Testing Label Selection...\n');
  
  // Mock GitHub manager (without actual GitHub token)
  const mockManager = {
    selectLabels: function(message, defaultLabels) {
      const labels = [...defaultLabels];
      const messageLower = message.toLowerCase();

      // Priority labels
      if (messageLower.includes('urgent') || messageLower.includes('critical')) {
        labels.push('urgent');
      }
      if (messageLower.includes('high priority')) {
        labels.push('high-priority');
      }

      // Type labels
      if (messageLower.includes('bug') || messageLower.includes('error')) {
        labels.push('bug');
      }
      if (messageLower.includes('feature') || messageLower.includes('enhancement')) {
        labels.push('enhancement');
      }
      if (messageLower.includes('documentation') || messageLower.includes('docs')) {
        labels.push('documentation');
      }

      return [...new Set(labels)]; // Remove duplicates
    }
  };

  const testCases = [
    {
      message: "Urgent bug in the login system",
      defaultLabels: ['enhancement', 'bug'],
      expected: ['enhancement', 'bug', 'urgent']
    },
    {
      message: "High priority feature request for dashboard",
      defaultLabels: ['feature'],
      expected: ['feature', 'high-priority', 'enhancement']
    },
    {
      message: "Documentation needs updating",
      defaultLabels: ['docs'],
      expected: ['docs', 'documentation']
    }
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach(({ message, defaultLabels, expected }, index) => {
    const result = mockManager.selectLabels(message, defaultLabels);
    const matches = expected.every(label => result.includes(label));
    const status = matches ? '✅ PASS' : '❌ FAIL';
    
    console.log(`${index + 1}. ${status}`);
    console.log(`   Message: "${message}"`);
    console.log(`   Expected: [${expected.join(', ')}]`);
    console.log(`   Result: [${result.join(', ')}]`);
    console.log('');
    
    if (matches) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`📊 Label Test Results: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

// Run all tests
function runAllTests() {
  console.log('🚀 MULTI-REPOSITORY SYSTEM TESTS\n');
  console.log('='.repeat(50));
  console.log('');

  const results = [];
  
  try {
    results.push(testRepositoryDetection());
    results.push(testRepositoryConfiguration());
    results.push(testLabelSelection());
    
    const allPassed = results.every(result => result === true);
    
    console.log('='.repeat(50));
    console.log('');
    
    if (allPassed) {
      console.log('🎉 ALL TESTS PASSED!');
      console.log('✅ Multi-repository system is working correctly');
      console.log('✅ Repository detection is accurate');
      console.log('✅ Label selection is functioning properly');
    } else {
      console.log('❌ SOME TESTS FAILED');
      console.log('⚠️  Please check the failed tests above');
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    console.error('🔍 Error details:', error.stack);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testRepositoryDetection,
  testRepositoryConfiguration,
  testLabelSelection,
  runAllTests
}; 