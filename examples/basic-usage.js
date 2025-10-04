/**
 * Basic Usage Examples
 * Demonstrates how to use the Corporate Merge Tycoon Agent
 * 
 * @author George Pricop (@Gzeu)
 * @version 1.0.0
 */

import CorporateMergeTycoonAgent from '../src/agent.js';

// Initialize agent with default configuration
const agent = new CorporateMergeTycoonAgent();

async function runExamples() {
  console.log('🏢⚡ Corporate Merge Tycoon Agent - Basic Usage Examples\n');

  // Example 1: List all available tasks
  console.log('=== 📋 Available Tasks ===');
  const tasks = agent.getAvailableTasks();
  
  console.table(tasks.map(task => ({
    ID: task.id,
    Name: task.name,
    Priority: task.priority,
    Category: task.category,
    Complexity: task.complexity
  })));

  // Example 2: Execute ESDT token creation (BLK002)
  console.log('\n=== 🪙 Creating ESDT Token ===');
  try {
    const tokenResult = await agent.executeTask('BLK002', {
      name: 'TechCorp',
      ticker: 'TECH',
      supply: 1000000,
      decimals: 18,
      founder_pct: 25,
      employees_pct: 20,
      public_pct: 30,
      treasury_pct: 25
    });
    
    console.log('✅ Token creation result:');
    console.log(JSON.stringify(tokenResult, null, 2));
  } catch (error) {
    console.error('❌ Token creation failed:', error.message);
  }

  // Example 3: Execute company performance analysis (CMP001)
  console.log('\n=== 📊 Company Performance Analysis ===');
  try {
    const analysisResult = await agent.executeTask('CMP001', {
      company_token: 'TECH-abc123',
      time_period: '30d',
      metrics_types: ['financial', 'market', 'operational']
    });
    
    console.log('✅ Analysis result:');
    console.log(JSON.stringify(analysisResult, null, 2));
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }

  // Example 4: Create DAO governance proposal (GOV001)
  console.log('\n=== 🗳️ Creating Governance Proposal ===');
  try {
    const proposalResult = await agent.executeTask('GOV001', {
      proposal_type: 'contract_upgrade',
      proposal_details: {
        title: 'Upgrade to v2.0',
        description: 'Implement new merger mechanics and enhanced governance features'
      },
      voting_parameters: {
        quorum: 30,
        threshold: 60,
        duration: 604800 // 7 days
      }
    });
    
    console.log('✅ Proposal creation result:');
    console.log(JSON.stringify(proposalResult, null, 2));
  } catch (error) {
    console.error('❌ Proposal creation failed:', error.message);
  }

  // Example 5: Execute due diligence for merger (MRG001)
  console.log('\n=== 🤝 M&A Due Diligence Analysis ===');
  try {
    const dueDiligenceResult = await agent.executeTask('MRG001', {
      target_company: {
        name: 'InnovaCorp',
        token: 'INNO-def456',
        market_cap: 5000000,
        employees: 150,
        revenue: 2500000
      },
      analysis_depth: 'comprehensive',
      risk_tolerance: 'moderate'
    });
    
    console.log('✅ Due diligence result:');
    console.log(JSON.stringify(dueDiligenceResult, null, 2));
  } catch (error) {
    console.error('❌ Due diligence failed:', error.message);
  }

  // Example 6: Network monitoring (BLK001)
  console.log('\n=== 🔍 Network Monitoring ===');
  try {
    const monitoringResult = await agent.executeTask('BLK001', {
      network_endpoint: 'https://gateway.multiversx.com',
      validator_addresses: [],
      monitoring_interval: 30,
      alert_thresholds: {
        min_tps: 100,
        max_block_time: 10
      },
      metrics_to_track: ['network_status', 'tps', 'block_time', 'validator_status'],
      dashboard_config: {
        refresh_rate: 30,
        display_charts: true
      },
      notification_channels: ['slack', 'email']
    });
    
    console.log('✅ Network monitoring result:');
    console.log(JSON.stringify(monitoringResult, null, 2));
  } catch (error) {
    console.error('❌ Network monitoring failed:', error.message);
  }

  // Example 7: Market intelligence (MKT001)
  console.log('\n=== 🌍 Market Intelligence ===');
  try {
    const marketResult = await agent.executeTask('MKT001', {
      market_segments: ['defi', 'gaming', 'enterprise'],
      competitor_list: ['Ethereum', 'Solana', 'Cardano'],
      intelligence_scope: 'global'
    });
    
    console.log('✅ Market intelligence result:');
    console.log(JSON.stringify(marketResult, null, 2));
  } catch (error) {
    console.error('❌ Market intelligence failed:', error.message);
  }

  // Example 8: User support (SUP001)
  console.log('\n=== 🎧 User Support ===');
  try {
    const supportResult = await agent.executeTask('SUP001', {
      support_channels: ['chat', 'email', 'forum']
    });
    
    console.log('✅ User support result:');
    console.log(JSON.stringify(supportResult, null, 2));
  } catch (error) {
    console.error('❌ User support failed:', error.message);
  }

  // Example 9: Get agent performance metrics
  console.log('\n=== 📈 Agent Performance Metrics ===');
  const metrics = agent.getMetrics();
  console.log('Agent performance metrics:');
  console.table({
    'Tasks Executed': metrics.tasks_executed,
    'Success Rate': `${metrics.success_rate}%`,
    'Average Execution Time': `${Math.round(metrics.average_execution_time)}ms`,
    'Uptime': `${metrics.uptime_seconds} seconds`,
    'Successful Executions': metrics.successful_executions,
    'Failed Executions': metrics.failed_executions
  });

  // Example 10: Execute tasks by priority
  console.log('\n=== ⚡ Critical Priority Tasks ===');
  const criticalTasks = tasks.filter(task => task.priority === 'Critical');
  console.log(`Found ${criticalTasks.length} critical priority tasks:`);
  criticalTasks.forEach(task => {
    console.log(`- [${task.id}] ${task.name}`);
  });

  // Example 11: Execute tasks by category
  console.log('\n=== 🔗 Blockchain Operations Category ===');
  const blockchainTasks = tasks.filter(task => task.category === 'Blockchain Operations');
  console.log(`Found ${blockchainTasks.length} blockchain operation tasks:`);
  blockchainTasks.forEach(task => {
    console.log(`- [${task.id}] ${task.name} (${task.priority})`);
  });

  console.log('\n🎉 Basic Usage Examples Complete! 🎉');
  console.log('\n📚 Next Steps:');
  console.log('1. Review the advanced-scenarios.js for complex workflows');
  console.log('2. Check the integration_guide.md for production deployment');
  console.log('3. Explore the API reference for detailed documentation');
  console.log('\n🚀 Happy Building with Corporate Merge Tycoon Agent! 🚀');
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(error => {
    console.error('Examples execution failed:', error);
    process.exit(1);
  });
}

export { runExamples };
export default { runExamples };