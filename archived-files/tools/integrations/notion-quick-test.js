#!/usr/bin/env node

// 🧪 NOTION INTEGRATION QUICK TEST
// Verifies all Notion features are working correctly

require('dotenv').config();
const { EnhancedNotionManager } = require('./notion-enhanced-integration');

class NotionQuickTest {
  constructor() {
    this.notionManager = new EnhancedNotionManager();
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  async runAllTests() {
    console.log('🧪 NOTION INTEGRATION QUICK TEST');
    console.log('=================================\n');

    const tests = [
      { name: 'Environment Variables', test: () => this.testEnvironmentVariables() },
      { name: 'Notion Connection', test: () => this.testNotionConnection() },
      { name: 'Task Creation', test: () => this.testTaskCreation() },
      { name: 'Voice Task Processing', test: () => this.testVoiceTaskProcessing() },
      { name: 'Project Creation', test: () => this.testProjectCreation() },
      { name: 'Client Management', test: () => this.testClientManagement() },
      { name: 'Metrics Recording', test: () => this.testMetricsRecording() },
      { name: 'Dashboard Summary', test: () => this.testDashboardSummary() },
      { name: 'Intent Detection', test: () => this.testIntentDetection() },
      { name: 'Advanced Parsing', test: () => this.testAdvancedParsing() }
    ];

    for (const { name, test } of tests) {
      await this.runTest(name, test);
    }

    this.printResults();
  }

  async runTest(name, testFn) {
    this.testResults.total++;
    
    try {
      console.log(`🔍 Testing ${name}...`);
      await testFn();
      console.log(`✅ ${name} - PASSED\n`);
      this.testResults.passed++;
    } catch (error) {
      console.log(`❌ ${name} - FAILED: ${error.message}\n`);
      this.testResults.failed++;
    }
  }

  async testEnvironmentVariables() {
    const requiredVars = [
      'NOTION_API_KEY',
      'NOTION_TASKS_DB_ID',
      'NOTION_PROJECTS_DB_ID',
      'NOTION_CLIENTS_DB_ID',
      'NOTION_METRICS_DB_ID'
    ];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`Missing environment variable: ${varName}`);
      }
    }

    // Validate API key format
    if (!process.env.NOTION_API_KEY.startsWith('secret_')) {
      throw new Error('Invalid Notion API key format');
    }

    console.log('   ✓ All environment variables present');
    console.log('   ✓ API key format valid');
  }

  async testNotionConnection() {
    const health = await this.notionManager.notionService.healthCheck();
    
    if (health.status !== 'healthy') {
      throw new Error(`Notion health check failed: ${health.status}`);
    }

    const allDatabasesHealthy = Object.values(health.databases).every(db => db === true);
    if (!allDatabasesHealthy) {
      throw new Error('Some databases are not accessible');
    }

    console.log('   ✓ Notion API connection successful');
    console.log('   ✓ All databases accessible');
  }

  async testTaskCreation() {
    const testMessage = 'Add task: Test task creation with high priority due tomorrow';
    
    const result = await this.notionManager.createTaskFromText(testMessage, 'test_chat');
    
    if (result.type !== 'notion_task_created') {
      throw new Error('Task creation failed');
    }

    if (!result.task.id || !result.task.title) {
      throw new Error('Invalid task object returned');
    }

    if (result.task.priority !== 'High') {
      throw new Error('Priority detection failed');
    }

    console.log('   ✓ Task created successfully');
    console.log(`   ✓ Task ID: ${result.task.id}`);
    console.log(`   ✓ Priority detected: ${result.task.priority}`);
    
    // Clean up
    await this.notionManager.notionService.deleteTask(result.task.id);
  }

  async testVoiceTaskProcessing() {
    const testTranscription = 'Create urgent task for client project ABC due next week';
    
    const result = await this.notionManager.createTaskFromVoice(testTranscription, 'test_chat', 'test_msg');
    
    if (result.type !== 'notion_task_created') {
      throw new Error('Voice task creation failed');
    }

    if (result.task.source !== 'Voice') {
      throw new Error('Voice source not set correctly');
    }

    if (result.task.priority !== 'Urgent') {
      throw new Error('Urgent priority not detected from voice');
    }

    console.log('   ✓ Voice task created successfully');
    console.log(`   ✓ Source: ${result.task.source}`);
    console.log(`   ✓ Priority: ${result.task.priority}`);
    
    // Clean up
    await this.notionManager.notionService.deleteTask(result.task.id);
  }

  async testProjectCreation() {
    const testMessage = 'Create project: Test Website for ABC Company budget $10000';
    
    const result = await this.notionManager.createProjectFromMessage(testMessage, 'test_chat');
    
    if (result.type !== 'notion_project_created') {
      throw new Error('Project creation failed');
    }

    if (!result.project.id || !result.project.name) {
      throw new Error('Invalid project object returned');
    }

    if (result.project.budget !== 10000) {
      throw new Error('Budget parsing failed');
    }

    if (!result.tasks || result.tasks.length === 0) {
      throw new Error('Initial tasks not generated');
    }

    console.log('   ✓ Project created successfully');
    console.log(`   ✓ Project ID: ${result.project.id}`);
    console.log(`   ✓ Budget parsed: $${result.project.budget}`);
    console.log(`   ✓ Initial tasks generated: ${result.tasks.length}`);
    
    // Clean up tasks
    for (const task of result.tasks) {
      try {
        await this.notionManager.notionService.deleteTask(task.id);
      } catch (error) {
        console.log(`   ⚠️ Failed to clean up task: ${task.id}`);
      }
    }
  }

  async testClientManagement() {
    const clientData = {
      name: 'Test Client ABC',
      email: 'test@abc.com',
      company: 'ABC Corp',
      notes: 'Test client created during integration test'
    };
    
    const client = await this.notionManager.notionService.createClient(clientData);
    
    if (!client.id || !client.name) {
      throw new Error('Client creation failed');
    }

    if (client.status !== 'Lead') {
      throw new Error('Default client status not set correctly');
    }

    console.log('   ✓ Client created successfully');
    console.log(`   ✓ Client ID: ${client.id}`);
    console.log(`   ✓ Default status: ${client.status}`);
  }

  async testMetricsRecording() {
    const testMessage = 'Record revenue $5000 from client payment for project ABC';
    
    const result = await this.notionManager.recordBusinessMetric(testMessage, 'test_chat');
    
    if (result.type !== 'notion_metric_recorded') {
      throw new Error('Metric recording failed');
    }

    if (result.metric.value !== 5000) {
      throw new Error('Amount parsing failed');
    }

    if (result.metric.type !== 'Revenue') {
      throw new Error('Metric type detection failed');
    }

    console.log('   ✓ Metric recorded successfully');
    console.log(`   ✓ Amount: $${result.metric.value}`);
    console.log(`   ✓ Type: ${result.metric.type}`);
  }

  async testDashboardSummary() {
    const summary = await this.notionManager.generateDashboardSummary();
    
    if (!summary) {
      throw new Error('Dashboard summary generation failed');
    }

    if (typeof summary.tasks !== 'object' || typeof summary.projects !== 'object') {
      throw new Error('Invalid summary structure');
    }

    const formattedSummary = this.notionManager.formatDashboardSummary(summary);
    
    if (!formattedSummary.includes('SISO Dashboard Summary')) {
      throw new Error('Summary formatting failed');
    }

    console.log('   ✓ Dashboard summary generated');
    console.log(`   ✓ Total tasks: ${summary.tasks.total}`);
    console.log(`   ✓ Total projects: ${summary.projects.total}`);
  }

  async testIntentDetection() {
    const testCases = [
      { message: 'add task fix the bug', expectedType: 'task' },
      { message: 'create project for new client', expectedType: 'project' },
      { message: 'record revenue $1000', expectedType: 'metric' },
      { message: 'show my tasks', expectedType: 'query' },
      { message: 'hello how are you', expectedType: 'unknown' }
    ];

    for (const { message, expectedType } of testCases) {
      const intent = this.notionManager.detectEnhancedIntent(message);
      
      if (intent.type !== expectedType) {
        throw new Error(`Intent detection failed for "${message}". Expected: ${expectedType}, Got: ${intent.type}`);
      }
    }

    console.log('   ✓ All intent detection tests passed');
    console.log(`   ✓ Tested ${testCases.length} different intent types`);
  }

  async testAdvancedParsing() {
    const testCases = [
      {
        text: 'urgent task: fix login bug due tomorrow for client project',
        expectedPriority: 'Urgent',
        expectedDueDate: true
      },
      {
        text: 'low priority reminder to update documentation when possible',
        expectedPriority: 'Low',
        expectedDueDate: false
      },
      {
        text: 'task for ABC project: implement new feature',
        expectedProject: 'ABC',
        expectedPriority: 'Medium'
      }
    ];

    for (const testCase of testCases) {
      const parsed = await this.notionManager.parseAdvancedTaskFromText(testCase.text);
      
      if (testCase.expectedPriority && parsed.priority !== testCase.expectedPriority) {
        throw new Error(`Priority parsing failed. Expected: ${testCase.expectedPriority}, Got: ${parsed.priority}`);
      }

      if (testCase.expectedDueDate && !parsed.dueDate) {
        throw new Error('Due date parsing failed when expected');
      }

      if (testCase.expectedProject && !parsed.project?.includes(testCase.expectedProject)) {
        throw new Error(`Project parsing failed. Expected to contain: ${testCase.expectedProject}`);
      }
    }

    console.log('   ✓ Advanced parsing tests passed');
    console.log('   ✓ Priority detection working');
    console.log('   ✓ Due date extraction working');
    console.log('   ✓ Project inference working');
  }

  printResults() {
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('========================\n');

    const passRate = (this.testResults.passed / this.testResults.total * 100).toFixed(1);

    console.log(`✅ Passed: ${this.testResults.passed}/${this.testResults.total} (${passRate}%)`);
    console.log(`❌ Failed: ${this.testResults.failed}/${this.testResults.total}`);

    if (this.testResults.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Your Notion integration is working perfectly!');
      console.log('\n🚀 Next Steps:');
      console.log('1. Start your Telegram bot: npm run start');
      console.log('2. Test with real voice messages');
      console.log('3. Check your Notion workspace for created items');
      console.log('4. Access dashboard at http://localhost:8081/dashboard');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the errors above and:');
      console.log('1. Verify your Notion API key and database IDs');
      console.log('2. Ensure databases are shared with your integration');
      console.log('3. Check your internet connection');
      console.log('4. Review the setup documentation');
    }

    console.log('\n📖 For help: Check NOTION_SETUP_SUMMARY.md');
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new NotionQuickTest();
  tester.runAllTests().catch(error => {
    console.error('\n💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { NotionQuickTest }; 