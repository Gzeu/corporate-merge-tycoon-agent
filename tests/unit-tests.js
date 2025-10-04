/**
 * Corporate Merge Tycoon Agent - Unit Tests
 * Comprehensive test suite for all agent components
 * 
 * @author George Pricop (@Gzeu)
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { CorporateMergeTycoonAgent } from '../src/agent.js';
import { TaskExecutor } from '../src/task-executor.js';
import { MultiversXClient } from '../src/blockchain/multiversx-client.js';
import { DAOManager } from '../src/governance/dao-manager.js';

describe('Corporate Merge Tycoon Agent', () => {
  let agent;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      network: 'testnet',
      endpoints: ['https://testnet-gateway.multiversx.com'],
      contracts: {
        companyManager: 'erd1qqqqqqqqqqqqqpgqtest123',
        mergerEngine: 'erd1qqqqqqqqqqqqqpgqtest456',
        daoGovernance: 'erd1qqqqqqqqqqqqqpgqtest789'
      },
      monitoring: {
        alerts_enabled: false // Disable alerts for testing
      }
    };
    
    agent = new CorporateMergeTycoonAgent(mockConfig);
  });

  afterEach(() => {
    agent = null;
  });

  describe('Agent Initialization', () => {
    test('should initialize with default config', () => {
      const defaultAgent = new CorporateMergeTycoonAgent();
      expect(defaultAgent.config.network).toBe('mainnet');
      expect(defaultAgent.config.endpoints).toContain('https://gateway.multiversx.com');
    });

    test('should initialize with custom config', () => {
      expect(agent.config.network).toBe('testnet');
      expect(agent.config.endpoints).toContain('https://testnet-gateway.multiversx.com');
    });

    test('should load task catalog successfully', () => {
      expect(agent.taskCatalog).toBeDefined();
      expect(agent.taskCatalog.agent_info).toBeDefined();
      expect(agent.taskCatalog.task_categories).toBeDefined();
    });

    test('should initialize metrics', () => {
      const metrics = agent.getMetrics();
      expect(metrics.tasks_executed).toBe(0);
      expect(metrics.successful_executions).toBe(0);
      expect(metrics.failed_executions).toBe(0);
    });
  });

  describe('Task Management', () => {
    test('should find task by ID', () => {
      const task = agent.findTaskById('BLK002');
      expect(task).toBeDefined();
      expect(task.task_id).toBe('BLK002');
      expect(task.name).toContain('ESDT');
    });

    test('should return null for non-existent task', () => {
      const task = agent.findTaskById('INVALID');
      expect(task).toBeNull();
    });

    test('should get available tasks sorted by priority', () => {
      const tasks = agent.getAvailableTasks();
      expect(tasks.length).toBeGreaterThan(0);
      
      // Check that critical tasks come first
      const firstTask = tasks[0];
      expect(['Critical', 'High'].includes(firstTask.priority)).toBeTruthy();
    });

    test('should validate task parameters correctly', () => {
      const mockTask = {
        parameters: ['company_name', 'ticker', 'supply']
      };
      
      const validParams = {
        company_name: 'TestCorp',
        ticker: 'TEST',
        supply: 1000000
      };
      
      expect(() => {
        agent.validateTaskParameters(mockTask, validParams);
      }).not.toThrow();
      
      const invalidParams = {
        company_name: 'TestCorp'
        // Missing ticker and supply
      };
      
      expect(() => {
        agent.validateTaskParameters(mockTask, invalidParams);
      }).toThrow('Missing required parameters');
    });
  });

  describe('Task Execution', () => {
    test('should execute blockchain task successfully', async () => {
      const params = {
        company_name: 'TestCorp',
        ticker: 'TEST',
        supply: 1000000,
        decimals: 18
      };
      
      const result = await agent.executeTask('BLK002', params);
      
      expect(result.success).toBeTruthy();
      expect(result.taskId).toBe('BLK002');
      expect(result.result).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    test('should handle task execution failure', async () => {
      const result = await agent.executeTask('INVALID_TASK', {});
      
      expect(result.success).toBeFalsy();
      expect(result.error).toContain('not found');
    });

    test('should update metrics after task execution', async () => {
      const initialMetrics = agent.getMetrics();
      
      await agent.executeTask('BLK001', {});
      
      const updatedMetrics = agent.getMetrics();
      expect(updatedMetrics.tasks_executed).toBe(initialMetrics.tasks_executed + 1);
      expect(updatedMetrics.successful_executions).toBe(initialMetrics.successful_executions + 1);
    });
  });
});

describe('Task Executor', () => {
  let executor;

  beforeEach(() => {
    executor = new TaskExecutor({
      network: 'testnet'
    });
  });

  describe('Blockchain Operations', () => {
    test('should monitor network successfully', async () => {
      const mockTask = {
        task_id: 'BLK001',
        category: 'blockchain_operations'
      };
      
      const result = await executor.execute(mockTask, {});
      
      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
      expect(result.data.block_height).toBeDefined();
      expect(result.data.transactions_per_second).toBeDefined();
    });

    test('should create ESDT token successfully', async () => {
      const mockTask = {
        task_id: 'BLK002',
        category: 'blockchain_operations'
      };
      
      const params = {
        company_name: 'TestCorp',
        ticker: 'TEST',
        supply: 1000000,
        decimals: 18
      };
      
      const result = await executor.execute(mockTask, params);
      
      expect(result.status).toBe('success');
      expect(result.token_id).toContain('TEST-');
      expect(result.company_name).toBe('TestCorp');
      expect(result.transaction_hash).toMatch(/^0x[a-f0-9]{64}$/);
    });
  });

  describe('Merger & Acquisition', () => {
    test('should perform due diligence successfully', async () => {
      const mockTask = {
        task_id: 'MRG001',
        category: 'merger_acquisition'
      };
      
      const params = {
        target_company: 'TargetCorp',
        analysis_depth: 'comprehensive'
      };
      
      const result = await executor.execute(mockTask, params);
      
      expect(result.status).toBe('success');
      expect(result.target_company).toBe('TargetCorp');
      expect(result.analysis).toBeDefined();
      expect(result.analysis.financial_health).toBeGreaterThanOrEqual(0);
      expect(result.analysis.financial_health).toBeLessThanOrEqual(100);
      expect(result.confidence_score).toBeGreaterThanOrEqual(60);
    });
  });

  describe('DAO Governance', () => {
    test('should create proposal successfully', async () => {
      const mockTask = {
        task_id: 'GOV001',
        category: 'dao_governance'
      };
      
      const params = {
        title: 'Test Proposal',
        description: 'This is a test governance proposal',
        quorum: 30,
        threshold: 60
      };
      
      const result = await executor.execute(mockTask, params);
      
      expect(result.status).toBe('success');
      expect(result.proposal_id).toBeDefined();
      expect(result.title).toBe('Test Proposal');
      expect(result.quorum_required).toBe(30);
      expect(result.threshold_required).toBe(60);
    });
  });

  describe('Error Handling', () => {
    test('should handle unknown task category', async () => {
      const mockTask = {
        task_id: 'UNKNOWN001',
        category: 'unknown_category'
      };
      
      await expect(executor.execute(mockTask, {})).rejects.toThrow('Unknown task category');
    });

    test('should handle unknown task ID', async () => {
      const mockTask = {
        task_id: 'BLK999',
        category: 'blockchain_operations'
      };
      
      await expect(executor.execute(mockTask, {})).rejects.toThrow('Unknown blockchain task');
    });
  });
});

describe('MultiversX Client', () => {
  let client;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      network: 'testnet',
      gatewayUrl: 'https://testnet-gateway.multiversx.com',
      apiUrl: 'https://testnet-api.multiversx.com',
      chainId: 'T'
    };
    
    client = new MultiversXClient(mockConfig);
  });

  describe('Initialization', () => {
    test('should initialize with testnet config', () => {
      expect(client.config.network).toBe('testnet');
      expect(client.config.chainId).toBe('T');
      expect(client.networkProvider).toBeDefined();
    });

    test('should initialize with mainnet defaults', () => {
      const mainnetClient = new MultiversXClient();
      expect(mainnetClient.config.network).toBe('mainnet');
      expect(mainnetClient.config.chainId).toBe('1');
    });
  });

  describe('Wallet Operations', () => {
    test('should create wallet from mnemonic', () => {
      const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const wallet = MultiversXClient.createWalletFromMnemonic(mnemonic);
      
      expect(wallet).toBeDefined();
      expect(wallet.address).toBeDefined();
      expect(wallet.secretKey).toBeDefined();
    });

    test('should create wallet from private key', () => {
      const privateKey = '1a927e2af5306a9bb2ea777f73e06ecc0ac9aaa72fb4ea5e0d765ac8c77fe2e0';
      const wallet = MultiversXClient.createWalletFromPrivateKey(privateKey);
      
      expect(wallet).toBeDefined();
      expect(wallet.address).toBeDefined();
      expect(wallet.secretKey).toBeDefined();
    });
  });
});

describe('DAO Manager', () => {
  let daoManager;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      votingPeriodDays: 3, // Shorter for testing
      quorumThreshold: 25,
      approvalThreshold: 55,
      proposalDeposit: 500
    };
    
    daoManager = new DAOManager(mockConfig);
  });

  describe('Initialization', () => {
    test('should initialize with custom config', () => {
      expect(daoManager.config.votingPeriodDays).toBe(3);
      expect(daoManager.config.quorumThreshold).toBe(25);
      expect(daoManager.config.approvalThreshold).toBe(55);
    });

    test('should initialize storage maps', () => {
      expect(daoManager.proposals).toBeInstanceOf(Map);
      expect(daoManager.votes).toBeInstanceOf(Map);
      expect(daoManager.executedProposals).toBeInstanceOf(Set);
    });
  });

  describe('Proposal Management', () => {
    test('should create proposal successfully', async () => {
      const params = {
        title: 'Test Proposal',
        description: 'This is a test proposal for unit testing',
        proposer: 'erd1test123',
        category: 'governance'
      };
      
      const result = await daoManager.createProposal(params);
      
      expect(result.success).toBeTruthy();
      expect(result.proposal_id).toBeDefined();
      expect(result.proposal.title).toBe('Test Proposal');
      expect(result.proposal.status).toBe('active');
      expect(result.proposal.governance_params.quorum_threshold).toBe(25);
    });

    test('should generate unique proposal IDs', async () => {
      const params1 = {
        title: 'Proposal 1',
        description: 'First proposal',
        proposer: 'erd1test123'
      };
      
      const params2 = {
        title: 'Proposal 2',
        description: 'Second proposal',
        proposer: 'erd1test456'
      };
      
      const result1 = await daoManager.createProposal(params1);
      const result2 = await daoManager.createProposal(params2);
      
      expect(result1.proposal_id).not.toBe(result2.proposal_id);
    });
  });

  describe('Voting Operations', () => {
    let proposalId;
    
    beforeEach(async () => {
      const proposal = await daoManager.createProposal({
        title: 'Test Voting Proposal',
        description: 'Proposal for testing voting',
        proposer: 'erd1test123'
      });
      proposalId = proposal.proposal_id;
    });

    test('should submit vote successfully', async () => {
      const voteParams = {
        proposalId,
        voter: 'erd1voter123',
        vote: 'for',
        votingPower: 1000,
        reason: 'I support this proposal'
      };
      
      const result = await daoManager.submitVote(voteParams);
      
      expect(result.success).toBeTruthy();
      expect(result.vote_record.vote).toBe('for');
      expect(result.vote_record.voting_power).toBe(1000);
      expect(result.proposal_stats.votes_for).toBe(1);
      expect(result.proposal_stats.voting_power_for).toBe(1000);
    });

    test('should prevent double voting', async () => {
      const voteParams = {
        proposalId,
        voter: 'erd1voter123',
        vote: 'for',
        votingPower: 1000
      };
      
      await daoManager.submitVote(voteParams);
      
      await expect(daoManager.submitVote(voteParams))
        .rejects.toThrow('Voter has already voted');
    });

    test('should validate vote options', async () => {
      const invalidVoteParams = {
        proposalId,
        voter: 'erd1voter123',
        vote: 'invalid_option',
        votingPower: 1000
      };
      
      await expect(daoManager.submitVote(invalidVoteParams))
        .rejects.toThrow('Invalid vote option');
    });

    test('should reject votes for non-existent proposal', async () => {
      const voteParams = {
        proposalId: 'INVALID_PROPOSAL',
        voter: 'erd1voter123',
        vote: 'for',
        votingPower: 1000
      };
      
      await expect(daoManager.submitVote(voteParams))
        .rejects.toThrow('Proposal INVALID_PROPOSAL not found');
    });
  });

  describe('Vote Monitoring', () => {
    test('should monitor active proposals', async () => {
      // Create test proposal
      await daoManager.createProposal({
        title: 'Active Proposal',
        description: 'Test active proposal monitoring',
        proposer: 'erd1test123'
      });
      
      const result = await daoManager.monitorVotes();
      
      expect(result.success).toBeTruthy();
      expect(result.results.active_proposals).toHaveLength(1);
      expect(result.results.governance_metrics).toBeDefined();
      expect(result.results.governance_metrics.total_proposals).toBe(1);
    });
  });

  describe('Helper Methods', () => {
    test('should generate valid proposal ID', () => {
      const proposalId = daoManager.generateProposalId();
      expect(proposalId).toMatch(/^PROP_\d+_[a-z0-9]{6}$/);
    });

    test('should generate valid transaction hash', () => {
      const txHash = daoManager.generateTransactionHash();
      expect(txHash).toMatch(/^0x[a-f0-9]{64}$/);
    });

    test('should extract tags from description', () => {
      const description = 'This proposal involves finance and technical governance aspects';
      const tags = daoManager.extractTags(description);
      
      expect(tags).toContain('finance');
      expect(tags).toContain('technical');
      expect(tags).toContain('governance');
      expect(tags.length).toBeLessThanOrEqual(3);
    });

    test('should estimate proposal impact', () => {
      const impact1 = daoManager.estimateProposalImpact('merger', 'Short description');
      const impact2 = daoManager.estimateProposalImpact('merger', 'Very long detailed description that goes into extensive detail about the proposal and its many implications for the organization and stakeholders');
      
      expect(impact1).toBeGreaterThanOrEqual(1);
      expect(impact1).toBeLessThanOrEqual(10);
      expect(impact2).toBeGreaterThan(impact1); // Longer descriptions have higher impact
    });
  });
});

describe('Integration Tests', () => {
  test('should integrate agent with task executor', async () => {
    const agent = new CorporateMergeTycoonAgent({ network: 'testnet' });
    
    const result = await agent.executeTask('BLK001', {});
    
    expect(result.success).toBeTruthy();
    expect(result.result.summary).toContain('executed successfully');
  });

  test('should handle end-to-end governance flow', async () => {
    const daoManager = new DAOManager({
      votingPeriodDays: 1,
      quorumThreshold: 10,
      approvalThreshold: 51
    });
    
    // Create proposal
    const proposal = await daoManager.createProposal({
      title: 'Integration Test Proposal',
      description: 'Testing end-to-end governance flow',
      proposer: 'erd1test123'
    });
    
    expect(proposal.success).toBeTruthy();
    
    // Submit votes
    await daoManager.submitVote({
      proposalId: proposal.proposal_id,
      voter: 'erd1voter1',
      vote: 'for',
      votingPower: 6000
    });
    
    await daoManager.submitVote({
      proposalId: proposal.proposal_id,
      voter: 'erd1voter2',
      vote: 'against',
      votingPower: 4000
    });
    
    // Monitor votes
    const monitoring = await daoManager.monitorVotes({
      proposalId: proposal.proposal_id
    });
    
    expect(monitoring.success).toBeTruthy();
    expect(monitoring.results.active_proposals).toHaveLength(1);
    
    const activeProposal = monitoring.results.active_proposals[0];
    expect(activeProposal.voting_stats.votes_for).toBe(1);
    expect(activeProposal.voting_stats.votes_against).toBe(1);
    expect(activeProposal.current_result.percentage_for).toBe(60);
  });
});

// Test utilities
export function createMockWallet() {
  return {
    address: 'erd1qqqqqqqqqqqqqpgqtest123456789abcdef',
    secretKey: Buffer.from('1a927e2af5306a9bb2ea777f73e06ecc0ac9aaa72fb4ea5e0d765ac8c77fe2e0', 'hex')
  };
}

export function createMockCompany(name = 'TestCorp') {
  return {
    name,
    ticker: name.substring(0, 4).toUpperCase(),
    marketCap: Math.random() * 100000000,
    tokenSupply: 1000000,
    foundedDate: new Date().toISOString(),
    sector: 'Technology'
  };
}

export function createMockNetworkResponse() {
  return {
    ChainID: 'T',
    GasPerDataByte: 1500,
    MinGasPrice: 1000000000,
    MinGasLimit: 50000,
    CurrentRound: Math.floor(Math.random() * 1000000),
    EpochNumber: Math.floor(Math.random() * 1000),
    HighestFinalNonce: Math.floor(Math.random() * 1000000),
    RoundsPerEpoch: 14400
  };
}