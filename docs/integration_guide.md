# Corporate Merge Tycoon Agent - Integration Guide 🏢⚡

Guide complet pentru integrarea Corporate Merge Tycoon Agent în sistemele existente, platformele de gaming și aplicațiile blockchain.

## 📋 Cuprins

- [Prezentare Generală](#prezentare-generală)
- [Cerințe de Sistem](#cerințe-de-sistem)
- [Instalare Rapidă](#instalare-rapidă)
- [Configurare MultiversX](#configurare-multiversx)
- [Integrare cu Platforme Gaming](#integrare-cu-platforme-gaming)
- [API Reference](#api-reference)
- [Exemple de Implementare](#exemple-de-implementare)
- [Securitate și Best Practices](#securitate-și-best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Prezentare Generală

Corporate Merge Tycoon Agent este un sistem integrat care oferă funcționalități complete pentru:

- **Blockchain Operations**: Operații native pe MultiversX
- **M&A Simulations**: Simulări realiste de fuziuni și achiziții
- **DAO Governance**: Guvernanță descentralizată completă
- **Corporate Management**: Management complet al corporațiilor virtuale
- **Market Analytics**: Analiză avansată de piață și performanță

### Arhitectura Sistemului

```
┌─────────────────────────────────────────────┐
│                 Client App                  │
│  (Gaming Platform / Web App / Mobile)      │
└─────────────────┬───────────────────────────┘
                  │ REST API / WebSocket
┌─────────────────▼───────────────────────────┐
│           Agent Orchestrator                │
│  ┌─────────────┬────────────┬──────────────┐│
│  │ TaskExecutor│ Blockchain │ DAO Manager  ││
│  │             │   Client   │              ││
│  └─────────────┴────────────┴──────────────┘│
└─────────────────┬───────────────────────────┘
                  │ MultiversX SDK
┌─────────────────▼───────────────────────────┐
│            MultiversX Blockchain           │
│     (Mainnet / Testnet / Devnet)          │
└─────────────────────────────────────────────┘
```

## 🛠️ Cerințe de Sistem

### Cerințe Minime

- **Node.js**: ≥ 18.0.0
- **NPM**: ≥ 8.0.0
- **RAM**: ≥ 4GB
- **Storage**: ≥ 1GB spațiu liber
- **Network**: Conexiune internet stabilă

### Cerințe Recomandate

- **Node.js**: ≥ 20.0.0 LTS
- **RAM**: ≥ 8GB
- **CPU**: Multi-core pentru procesare paralelă
- **Storage**: ≥ 10GB pentru logging și cache
- **Network**: Bandwidth ≥ 100 Mbps

### Dependințe MultiversX

```json
{
  "@multiversx/sdk-core": "^13.0.0",
  "@multiversx/sdk-network-providers": "^3.0.0",
  "@multiversx/sdk-wallet": "^4.0.0",
  "@multiversx/sdk-dapp": "^2.0.0"
}
```

## 🚀 Instalare Rapidă

### 1. Clonare Repository

```bash
# Clonează repository-ul
git clone https://github.com/Gzeu/corporate-merge-tycoon-agent.git
cd corporate-merge-tycoon-agent

# Instalează dependințele
npm install

# Verifică instalarea
npm run test
```

### 2. Configurare Environment

```bash
# Copiază template-ul de configurare
cp .env.example .env

# Editează configurările
nano .env
```

**Exemplu .env:**

```bash
# MultiversX Configuration
MVX_NETWORK=testnet
MVX_GATEWAY_URL=https://testnet-gateway.multiversx.com
MVX_API_URL=https://testnet-api.multiversx.com
MVX_CHAIN_ID=T

# Wallet Configuration  
MVX_PRIVATE_KEY=your_private_key_here
MVX_MNEMONIC=your_mnemonic_phrase_here

# Contract Addresses
COMPANY_MANAGER_CONTRACT=erd1qqqqqqqqqqqqqpgq...
MERGER_ENGINE_CONTRACT=erd1qqqqqqqqqqqqqpgq...
DAO_GOVERNANCE_CONTRACT=erd1qqqqqqqqqqqqqpgq...

# API Configuration
API_PORT=3000
API_HOST=localhost
API_RATE_LIMIT=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/

# Security
JWT_SECRET=your_jwt_secret_here
API_KEY=your_api_key_here
```

### 3. Inițializare Rapidă

```javascript
import { CorporateMergeTycoonAgent } from './src/agent.js';

// Configurare básică
const config = {
  network: 'testnet',
  endpoints: ['https://testnet-gateway.multiversx.com'],
};

// Inițializare agent
const agent = new CorporateMergeTycoonAgent(config);

// Test de funcționalitate
const result = await agent.executeTask('BLK001', {});
console.log('Network Status:', result);
```

## ⚙️ Configurare MultiversX

### Configurare Rețea

```javascript
// Configurare pentru diferite rețele
const networkConfigs = {
  mainnet: {
    gatewayUrl: 'https://gateway.multiversx.com',
    apiUrl: 'https://api.multiversx.com',
    chainId: '1',
    gasPrice: 1000000000,
    gasLimit: 10000000
  },
  testnet: {
    gatewayUrl: 'https://testnet-gateway.multiversx.com',
    apiUrl: 'https://testnet-api.multiversx.com', 
    chainId: 'T',
    gasPrice: 1000000000,
    gasLimit: 10000000
  },
  devnet: {
    gatewayUrl: 'https://devnet-gateway.multiversx.com',
    apiUrl: 'https://devnet-api.multiversx.com',
    chainId: 'D',
    gasPrice: 1000000000,
    gasLimit: 10000000
  }
};
```

### Configurare Wallet

```javascript
import { MultiversXClient } from './src/blockchain/multiversx-client.js';

// Creare wallet din mnemonic
const wallet = MultiversXClient.createWalletFromMnemonic(
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
);

// Creare wallet din private key
const walletFromPK = MultiversXClient.createWalletFromPrivateKey(
  '1a927e2af5306a9bb2ea777f73e06ecc0ac9aaa72fb4ea5e0d765ac8c77fe2e0'
);

// Inițializare client cu wallet
const client = new MultiversXClient({
  network: 'testnet',
  wallet: wallet
});
```

### Deploy Smart Contracts

```javascript
// Deploy contract pentru Company Manager
const deployResult = await client.deploySmartContract({
  contractCode: companyManagerBytecode,
  codeMetadata: ['0100'], // Upgradeable
  constructorArgs: [],
  gasLimit: 100000000
}, wallet);

console.log('Contract deployed:', deployResult.contractAddress);
```

## 🎮 Integrare cu Platforme Gaming

### Unity Integration

```csharp
// Unity C# wrapper pentru Corporate Merge Tycoon Agent
using System;
using System.Net.Http;
using UnityEngine;

public class CorporateMergeTycoonSDK : MonoBehaviour
{
    private const string API_BASE_URL = "http://localhost:3000/api";
    private HttpClient httpClient;
    
    void Start()
    {
        httpClient = new HttpClient();
        InitializeAgent();
    }
    
    async void InitializeAgent()
    {
        var response = await httpClient.GetAsync($"{API_BASE_URL}/status");
        var status = await response.Content.ReadAsStringAsync();
        Debug.Log($"Agent Status: {status}");
    }
    
    // Creare companie în joc
    public async void CreateCompany(string name, string ticker)
    {
        var payload = new {
            company_name = name,
            ticker = ticker,
            supply = 1000000,
            decimals = 18
        };
        
        var json = JsonUtility.ToJson(payload);
        var content = new StringContent(json);
        
        var response = await httpClient.PostAsync(
            $"{API_BASE_URL}/tasks/BLK002/execute", 
            content
        );
        
        Debug.Log($"Company created: {await response.Content.ReadAsStringAsync()}");
    }
}
```

### Unreal Engine Integration

```cpp
// Unreal Engine C++ integration
#include "CoreMinimal.h"
#include "Http.h"
#include "Json.h"

UCLASS()
class YOURGAME_API UCorporateMergeTycoonComponent : public UActorComponent
{
    GENERATED_BODY()
    
public:
    UCorporateMergeTycoonComponent();
    
    UFUNCTION(BlueprintCallable, Category = "Corporate Merge Tycoon")
    void ExecuteTask(const FString& TaskId, const FString& Parameters);
    
    UFUNCTION(BlueprintCallable, Category = "Corporate Merge Tycoon")
    void CreateCompanyToken(const FString& CompanyName, const FString& Ticker);
    
private:
    FString ApiBaseUrl = "http://localhost:3000/api";
    
    void OnTaskExecuted(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful);
};
```

### Web Integration (React)

```jsx
// React component pentru integrare web
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CorporateMergeTycoon = () => {
  const [agent, setAgent] = useState(null);
  const [companies, setCompanies] = useState([]);
  
  useEffect(() => {
    initializeAgent();
  }, []);
  
  const initializeAgent = async () => {
    try {
      const response = await axios.get('/api/agent/status');
      setAgent(response.data);
    } catch (error) {
      console.error('Failed to initialize agent:', error);
    }
  };
  
  const createCompany = async (companyData) => {
    try {
      const response = await axios.post('/api/tasks/BLK002/execute', {
        company_name: companyData.name,
        ticker: companyData.ticker,
        supply: companyData.supply,
        decimals: 18
      });
      
      setCompanies(prev => [...prev, response.data.result]);
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };
  
  return (
    <div className="corporate-merge-tycoon">
      <h1>Corporate Merge Tycoon</h1>
      
      {agent && (
        <div className="agent-status">
          <p>Agent Status: {agent.status}</p>
          <p>Network: {agent.network}</p>
        </div>
      )}
      
      <CompanyCreator onCreateCompany={createCompany} />
      <CompanyList companies={companies} />
    </div>
  );
};

export default CorporateMergeTycoon;
```

## 📡 API Reference

### REST API Endpoints

#### Agent Management

```http
# Get agent status
GET /api/agent/status

# Get available tasks
GET /api/agent/tasks

# Get agent metrics
GET /api/agent/metrics
```

#### Task Execution

```http
# Execute specific task
POST /api/tasks/{taskId}/execute
Content-Type: application/json

{
  "parameters": {
    "company_name": "TechCorp",
    "ticker": "TECH",
    "supply": 1000000
  }
}
```

#### Company Operations

```http
# Register new company
POST /api/companies/register

# Get company performance
GET /api/companies/{companyId}/performance

# Optimize distribution
POST /api/companies/{companyId}/optimize-distribution
```

#### DAO Governance

```http
# Create proposal
POST /api/dao/proposals

# Submit vote
POST /api/dao/proposals/{proposalId}/vote

# Execute proposal
POST /api/dao/proposals/{proposalId}/execute
```

### WebSocket Events

```javascript
// Conexiune WebSocket pentru evenimente real-time
const ws = new WebSocket('ws://localhost:3000/ws');

// Ascultare evenimente
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'taskCompleted':
      console.log('Task completed:', data.payload);
      break;
      
    case 'proposalCreated':
      console.log('New proposal:', data.payload);
      break;
      
    case 'tokenCreated':
      console.log('Token created:', data.payload);
      break;
  }
};

// Trimitere comenzi
ws.send(JSON.stringify({
  type: 'executeTask',
  payload: {
    taskId: 'BLK002',
    parameters: { /* task params */ }
  }
}));
```

## 🔐 Securitate și Best Practices

### Configurare Securitate

```javascript
// Configurare securitate pentru producție
const securityConfig = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
  },
  
  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com']
      : '*',
    credentials: true
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h',
    issuer: 'corporate-merge-tycoon'
  },
  
  // API Key validation
  apiKey: {
    required: process.env.NODE_ENV === 'production',
    headerName: 'x-api-key'
  }
};
```

### Wallet Security

```javascript
// Securizare wallet și chei private
import { encrypt, decrypt } from 'crypto-js/aes';

class SecureWalletManager {
  constructor(encryptionKey) {
    this.encryptionKey = encryptionKey;
  }
  
  // Stocare sigură a cheii private
  storePrivateKey(privateKey, userId) {
    const encrypted = encrypt(privateKey, this.encryptionKey).toString();
    // Store encrypted key in secure database
    return this.database.store(`wallet_${userId}`, encrypted);
  }
  
  // Recuperare sigură a cheii private
  retrievePrivateKey(userId) {
    const encrypted = this.database.get(`wallet_${userId}`);
    const decrypted = decrypt(encrypted, this.encryptionKey).toString();
    return decrypted;
  }
  
  // Multi-signature pentru operațiuni critice
  async requireMultiSig(operation, signers) {
    const signatures = [];
    
    for (const signer of signers) {
      const signature = await signer.sign(operation);
      signatures.push(signature);
    }
    
    return this.validateMultiSig(operation, signatures);
  }
}
```

### Transaction Validation

```javascript
// Validare și verificare tranzacții
class TransactionValidator {
  // Validare parametri tranzacție
  validateTransaction(transaction) {
    const errors = [];
    
    if (!transaction.sender || !this.isValidAddress(transaction.sender)) {
      errors.push('Invalid sender address');
    }
    
    if (!transaction.receiver || !this.isValidAddress(transaction.receiver)) {
      errors.push('Invalid receiver address');
    }
    
    if (transaction.value < 0) {
      errors.push('Invalid transaction value');
    }
    
    if (transaction.gasLimit < 50000) {
      errors.push('Gas limit too low');
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  // Verificare balanță înainte de tranzacție
  async checkBalance(address, amount) {
    const balance = await this.blockchain.getBalance(address);
    return balance.isGreaterThanOrEqualTo(amount);
  }
  
  // Simulare tranzacție înainte de execuție
  async simulateTransaction(transaction) {
    try {
      const result = await this.blockchain.simulate(transaction);
      return { success: true, gasUsed: result.gasUsed, result: result.returnData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## 🐛 Troubleshooting

### Probleme Comune și Soluții

#### 1. Erori de Conexiune la MultiversX

```javascript
// Retry mechanism pentru conexiuni
class ConnectionManager {
  async connectWithRetry(endpoint, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.connect(endpoint);
      } catch (error) {
        console.log(`Connection attempt ${i + 1} failed:`, error.message);
        
        if (i === maxRetries - 1) throw error;
        
        // Exponential backoff
        await this.delay(Math.pow(2, i) * 1000);
      }
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

#### 2. Erori de Gas și Tranzacții

```javascript
// Gas estimation și optimizare
class GasOptimizer {
  async estimateOptimalGas(transaction) {
    // Estimare gas din rețea
    const networkEstimate = await this.networkProvider.estimateGas(transaction);
    
    // Adăugare buffer de siguranță (20%)
    const bufferedGas = Math.ceil(networkEstimate * 1.2);
    
    // Cap maxim pentru siguranță
    const maxGas = 100000000;
    
    return Math.min(bufferedGas, maxGas);
  }
  
  // Retry cu gas crescut în caz de eșec
  async executeWithGasRetry(transaction) {
    let gasLimit = await this.estimateOptimalGas(transaction);
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        transaction.gasLimit = gasLimit;
        return await this.networkProvider.sendTransaction(transaction);
      } catch (error) {
        if (error.message.includes('out of gas')) {
          gasLimit = Math.ceil(gasLimit * 1.5);
          console.log(`Retrying with increased gas: ${gasLimit}`);
          continue;
        }
        throw error;
      }
    }
    
    throw new Error('Transaction failed after gas optimization attempts');
  }
}
```

#### 3. Debugging și Logging

```javascript
// Sistema avansată de logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'corporate-merge-tycoon' },
  transports: [
    // Errors în fișier separat
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    
    // Toate log-urile în combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
    
    // Console output pentru development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Usage în cod
logger.info('Task execution started', { taskId: 'BLK002', params });
logger.error('Transaction failed', { error: error.message, stack: error.stack });
logger.debug('Network response', { response: networkData });
```

### Performance Monitoring

```javascript
// Monitoring performanță și metrici
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      taskExecutions: 0,
      averageExecutionTime: 0,
      errorRate: 0,
      networkLatency: 0
    };
  }
  
  // Măsurare timp execuție task
  async measureTaskExecution(taskFn) {
    const startTime = Date.now();
    
    try {
      const result = await taskFn();
      const executionTime = Date.now() - startTime;
      
      this.updateMetrics('success', executionTime);
      
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      this.updateMetrics('error', executionTime);
      
      throw error;
    }
  }
  
  updateMetrics(status, executionTime) {
    this.metrics.taskExecutions++;
    
    // Update average execution time
    this.metrics.averageExecutionTime = 
      (this.metrics.averageExecutionTime * (this.metrics.taskExecutions - 1) + executionTime) / 
      this.metrics.taskExecutions;
    
    // Update error rate
    if (status === 'error') {
      this.metrics.errorRate = 
        (this.metrics.errorRate * (this.metrics.taskExecutions - 1) + 1) / 
        this.metrics.taskExecutions;
    }
  }
  
  getHealthStatus() {
    return {
      healthy: this.metrics.errorRate < 0.05, // <5% error rate
      metrics: this.metrics
    };
  }
}
```

---

## 📞 Support și Resurse

### Comunitate și Support

- **GitHub Issues**: [Report bugs și feature requests](https://github.com/Gzeu/corporate-merge-tycoon-agent/issues)
- **Email Support**: pricopgeorge@gmail.com
- **Documentation**: [Comprehensive docs](./docs/)
- **Examples**: [Implementation examples](./examples/)

### Resurse Utile

- **MultiversX Documentation**: [docs.multiversx.com](https://docs.multiversx.com)
- **ESDT Token Guide**: [ESDT Documentation](https://docs.multiversx.com/developers/esdt-tokens/)
- **Smart Contracts**: [Smart Contract Guide](https://docs.multiversx.com/developers/smart-contracts/)
- **xPortal Wallet**: [Wallet Integration](https://xportal.com)

---

<div align="center">

**🚀 Ready for Integration | ⚡ Powered by MultiversX | 🏢 Built for Enterprise**

*Corporate Merge Tycoon Agent - Bringing real M&A mechanics to blockchain gaming*

</div>