/**
 * Corporate Merge Tycoon Agent
 * Main agent class orchestrating 20 structured tasks across 8 functional areas
 * Built for MultiversX blockchain with M&A and DAO governance capabilities
 * 
 * @author George Pricop (@Gzeu)
 * @version 1.0.0
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Corporate Merge Tycoon Agent
 * Orchestrates blockchain-based corporate simulations on MultiversX
 */
export class CorporateMergeTycoonAgent {
  constructor(config = {}) {
    this.config = {
      network: config.network || 'mainnet',
      endpoints: config.endpoints || [
        'https://gateway.multiversx.com',
        'https://api.multiversx.com'
      ],
      contracts: config.contracts || {},
      monitoring: {
        sla_uptime: '99.9%',
        response_time_p95: '2000ms',
        alerts_enabled: true,
        ...config.monitoring
      },
      ...config
    };

    // Initialize logger
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });

    // Load task catalog
    this.taskCatalog = this.loadTaskCatalog();
    
    // Performance metrics
    this.metrics = {
      tasks_executed: 0,
      successful_executions: 0,
      failed_executions: 0,
      average_execution_time: 0,
      uptime_start: Date.now()
    };

    this.logger.info('Corporate Merge Tycoon Agent initialized', {
      network: this.config.network,
      total_tasks: this.taskCatalog.agent_info.total_tasks,
      categories: this.taskCatalog.agent_info.categories
    });
  }

  /**
   * Load task catalog from JSON file
   */
  loadTaskCatalog() {
    try {
      const catalogPath = join(__dirname, '../catalog/corporate_merge_tycoon_tasks.json');
      const catalogData = readFileSync(catalogPath, 'utf8');
      return JSON.parse(catalogData);
    } catch (error) {
      this.logger?.error('Failed to load task catalog', { error: error.message });
      throw new Error(`Failed to load task catalog: ${error.message}`);
    }
  }

  /**
   * Execute a specific task by ID
   * @param {string} taskId - Task identifier (e.g., 'BLK002')
   * @param {object} parameters - Task execution parameters
   * @returns {Promise<object>} Task execution result
   */
  async executeTask(taskId, parameters = {}) {
    const startTime = Date.now();
    
    try {
      this.logger.info('Executing task', { taskId, parameters });
      
      // Find task in catalog
      const task = this.findTaskById(taskId);
      if (!task) {
        throw new Error(`Task ${taskId} not found in catalog`);
      }

      // Validate task parameters
      this.validateTaskParameters(task, parameters);

      // Mock execution for demonstration
      const result = await this.mockTaskExecution(task, parameters);

      // Update metrics
      const executionTime = Date.now() - startTime;
      this.updateMetrics(true, executionTime);

      this.logger.info('Task executed successfully', {
        taskId,
        executionTime: `${executionTime}ms`,
        result: result.summary || 'Task completed'
      });

      return {
        success: true,
        taskId,
        executionTime,
        result,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.updateMetrics(false, executionTime);
      
      this.logger.error('Task execution failed', {
        taskId,
        error: error.message,
        executionTime: `${executionTime}ms`
      });

      return {
        success: false,
        taskId,
        error: error.message,
        executionTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Mock task execution for demonstration purposes
   */
  async mockTaskExecution(task, parameters) {
    // Simulate execution time based on complexity
    const complexityDelay = {
      'Low': 100,
      'Medium': 500,
      'High': 1000
    };
    
    const delay = complexityDelay[task.complexity] || 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    return {
      summary: `${task.name} executed successfully`,
      task_id: task.task_id,
      parameters_used: parameters,
      expected_output: task.expected_output,
      execution_details: {
        priority: task.priority,
        complexity: task.complexity,
        category: task.category
      }
    };
  }

  /**
   * Find task by ID in catalog
   */
  findTaskById(taskId) {
    for (const categoryKey of Object.keys(this.taskCatalog.task_categories)) {
      const category = this.taskCatalog.task_categories[categoryKey];
      if (category.tasks && category.tasks[taskId]) {
        return {
          ...category.tasks[taskId],
          category: categoryKey
        };
      }
    }
    return null;
  }

  /**
   * Validate task parameters
   */
  validateTaskParameters(task, parameters) {
    if (!task.parameters || !Array.isArray(task.parameters)) {
      return; // No validation required
    }

    const requiredParams = task.parameters;
    const providedParams = Object.keys(parameters);
    
    // Check for missing required parameters
    const missingParams = requiredParams.filter(param => 
      !providedParams.includes(param)
    );

    if (missingParams.length > 0) {
      throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
    }
  }

  /**
   * Get all available tasks
   */
  getAvailableTasks() {
    const tasks = [];
    
    for (const categoryKey of Object.keys(this.taskCatalog.task_categories)) {
      const category = this.taskCatalog.task_categories[categoryKey];
      
      for (const taskId of Object.keys(category.tasks || {})) {
        const task = category.tasks[taskId];
        tasks.push({
          id: taskId,
          name: task.name,
          description: task.description,
          priority: task.priority,
          category: category.name,
          complexity: task.complexity,
          frequency: task.frequency
        });
      }
    }

    return tasks.sort((a, b) => {
      const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const uptime = Date.now() - this.metrics.uptime_start;
    
    return {
      ...this.metrics,
      uptime_seconds: Math.floor(uptime / 1000),
      success_rate: this.metrics.tasks_executed > 0 
        ? (this.metrics.successful_executions / this.metrics.tasks_executed * 100).toFixed(2)
        : 0
    };
  }

  /**
   * Update performance metrics
   */
  updateMetrics(success, executionTime) {
    this.metrics.tasks_executed++;
    
    if (success) {
      this.metrics.successful_executions++;
    } else {
      this.metrics.failed_executions++;
    }

    // Calculate rolling average execution time
    const currentAvg = this.metrics.average_execution_time;
    const totalTasks = this.metrics.tasks_executed;
    this.metrics.average_execution_time = 
      ((currentAvg * (totalTasks - 1)) + executionTime) / totalTasks;
  }
}

export default CorporateMergeTycoonAgent;