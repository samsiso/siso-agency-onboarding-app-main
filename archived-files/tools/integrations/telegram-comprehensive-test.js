// 🧪 COMPREHENSIVE TELEGRAM BOT TESTING SYSTEM
const { RepositoryManager, MultiRepoGitHubManager } = require('./telegram-repository-config.js');

// Test scenarios for comprehensive testing
const testScenarios = [
  {
    message: "Bug in the agency dashboard - client login not working",
    expectedRepo: "siso-agency",
    category: "Agency Bug"
  },
  {
    message: "Need to add new client onboarding flow feature", 
    expectedRepo: "siso-agency",
    category: "Agency Feature"
  },
  {
    message: "Telegram bot voice response is not working properly",
    expectedRepo: "telegram-bot",
    category: "Bot Bug"
  },
  {
    message: "Add weather integration to the telegram assistant",
    expectedRepo: "telegram-bot", 
    category: "Bot Feature"
  },
  {
    message: "Schedule civic meeting for next week",
    expectedRepo: "mayor-activities",
    category: "Mayor Activity"
  },
  {
    message: "Idea for a habit tracking mobile app",
    expectedRepo: "personal-projects",
    category: "Personal Idea"
  },
  {
    message: "Random message with no clear context",
    expectedRepo: "siso-agency",
    category: "Default Routing"
  }
];

class ComprehensiveTester {
  constructor() {
    this.repoManager = new RepositoryManager();
    this.testResults = {
      passed: 0,
      failed: 0,
      details: []
    };
  }

  async runAllTests() {
    console.log('🚀 COMPREHENSIVE TELEGRAM BOT TESTING SYSTEM');
    console.log('=' .repeat(60));
    
    await this.runBasicTests();
    await this.runConfigurationTests();
    await this.runPerformanceTests();
    
    this.printFinalResults();
  }

  async runBasicTests() {
    console.log('\n🧪 BASIC REPOSITORY DETECTION TESTS');
    console.log('-'.repeat(40));
    
    for (const scenario of testScenarios) {
      const detectedRepo = this.repoManager.detectRepository(scenario.message);
      const passed = detectedRepo === scenario.expectedRepo;
      
      if (passed) {
        console.log(`✅ PASS: ${scenario.category}`);
        console.log(`   Message: "${scenario.message.substring(0, 50)}..."`);
        console.log(`   Expected: ${scenario.expectedRepo}, Got: ${detectedRepo}`);
        this.testResults.passed++;
      } else {
        console.log(`❌ FAIL: ${scenario.category}`);
        console.log(`   Message: "${scenario.message.substring(0, 50)}..."`);
        console.log(`   Expected: ${scenario.expectedRepo}, Got: ${detectedRepo}`);
        this.testResults.failed++;
      }
      
      this.testResults.details.push({
        scenario: scenario.category,
        message: scenario.message,
        expected: scenario.expectedRepo,
        actual: detectedRepo,
        passed: passed
      });
    }
  }

  async runConfigurationTests() {
    console.log('\n🔧 CONFIGURATION TESTS');
    console.log('-'.repeat(40));
    
    // Test repository configuration
    const allRepos = this.repoManager.getAllRepos();
    console.log(`✅ Found ${allRepos.length} configured repositories:`);
    
    allRepos.forEach(repo => {
      console.log(`   📁 ${repo.key}: ${repo.owner}/${repo.repo}`);
      console.log(`      Keywords: ${repo.keywords.join(', ')}`);
      console.log(`      Labels: ${repo.defaultLabels.join(', ')}`);
      console.log('');
    });
    
    // Test repository list formatting
    console.log('📋 Formatted Repository List:');
    console.log(this.repoManager.formatRepositoryList());
  }

  async runPerformanceTests() {
    console.log('\n⚡ PERFORMANCE TESTS');
    console.log('-'.repeat(40));
    
    const performanceMessages = [
      "Dashboard loading is slow",
      "Bot response time needs improvement", 
      "Mayor activities tracker is laggy",
      "Personal project manager crashes",
      "Agency onboarding flow timeout"
    ];
    
    const startTime = Date.now();
    
    for (const message of performanceMessages) {
      this.repoManager.detectRepository(message);
    }
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    console.log(`✅ Processed ${performanceMessages.length} messages in ${processingTime}ms`);
    console.log(`📈 Average: ${(processingTime / performanceMessages.length).toFixed(2)}ms per message`);
    
    if (processingTime < 100) {
      console.log('🚀 Performance: EXCELLENT');
    } else if (processingTime < 500) {
      console.log('✅ Performance: GOOD');
    } else {
      console.log('⚠️  Performance: NEEDS IMPROVEMENT');
    }
  }

  printFinalResults() {
    console.log('\n🎯 FINAL TEST RESULTS');
    console.log('=' .repeat(60));
    console.log(`✅ Tests Passed: ${this.testResults.passed}`);
    console.log(`❌ Tests Failed: ${this.testResults.failed}`);
    
    const total = this.testResults.passed + this.testResults.failed;
    if (total > 0) {
      console.log(`📊 Success Rate: ${((this.testResults.passed / total) * 100).toFixed(1)}%`);
    }
    
    if (this.testResults.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults.details
        .filter(detail => !detail.passed)
        .forEach(detail => {
          console.log(`   ${detail.scenario}: Expected ${detail.expected}, got ${detail.actual}`);
        });
    }
    
    console.log('\n🚀 TESTING COMPLETE!');
    
    if (this.testResults.failed === 0) {
      console.log('✅ All tests passed! System is ready for deployment.');
    } else {
      console.log('⚠️  Some tests failed. Review configurations before deployment.');
    }
  }
}

// Export for use in other modules
module.exports = {
  ComprehensiveTester,
  testScenarios
};

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ComprehensiveTester();
  tester.runAllTests().catch(console.error);
}
