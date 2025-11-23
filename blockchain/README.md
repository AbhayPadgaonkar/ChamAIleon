# Chameleon Blockchain Integration

## 🔐 Overview

This directory contains the blockchain integration for anchoring Chameleon security logs to the Ethereum Hoodi Testnet using Hardhat.

**Purpose**: Store cryptographic proofs (Merkle roots) of security logs on the blockchain to ensure immutability and enable tamper-proof verification.

---

## 📁 Project Structure

```
blockchain/
├── contracts/
│   └── LogAnchor.sol           # Smart contract for storing Merkle roots
├── scripts/
│   ├── deploy.js               # Deploy contract to Hoodi testnet
│   ├── manual_anchor.js        # Test anchoring with fake data
│   ├── anchor_logs.js          # Anchor real logs from backend
│   └── verify_log.js           # Verify individual log authenticity
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Node.js dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install dotenv
```

### 2. Setup Environment

```bash
# Copy the example env file
copy .env.example .env

# Edit .env and add your private key
# PRIVATE_KEY=your_wallet_private_key_without_0x
```

### 3. Get Test ETH

Visit: https://faucet.hoodi.ethpandaops.io
- Enter your wallet address
- Request test ETH (needed for gas fees)

### 4. Deploy Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network hoodi
```

Copy the deployed contract address and add it to `.env`:
```
CONTRACT_ADDRESS=0x...
```

### 5. Test the Contract

```bash
npx hardhat run scripts/manual_anchor.js --network hoodi
```

---

## 📝 Usage

### Anchor Security Logs

After your FastAPI backend generates logs in `backend/security_logs/`:

```bash
npx hardhat run scripts/anchor_logs.js --network hoodi
```

**What it does:**
1. Reads latest log file from `backend/security_logs/`
2. Builds a Merkle tree from log entries
3. Anchors the root hash to blockchain
4. Saves metadata and proofs for verification

**Output files:**
- `batch_TIMESTAMP_anchor.json` - Metadata (tx hash, block number, etc.)
- `batch_TIMESTAMP_proofs.json` - Merkle proofs for each log

### Verify a Log

To verify a specific log hasn't been tampered:

```bash
npx hardhat run scripts/verify_log.js --network hoodi evt_1732368896123456
```

**What it does:**
1. Finds the log in proof files
2. Retrieves on-chain Merkle root
3. Recomputes root from log + proof
4. Compares computed vs on-chain root
5. Reports if log is authentic or tampered

---

## 🔗 Network Details

- **Network Name**: Hoodi Testnet
- **Chain ID**: 560048
- **RPC URL**: https://rpc.hoodi.ethpandaops.io
- **Explorer**: https://hoodi.etherscan.io
- **Faucet**: https://faucet.hoodi.ethpandaops.io

---

## 📊 How It Works

### Data Flow

```
FastAPI Backend → JSONL Logs → Merkle Tree → Blockchain Root → Immutable Proof
```

### Architecture

1. **Backend** (`test_api.py`): Saves security logs to `security_logs/logs_DATE.jsonl`
2. **Merkle Tree**: Hashes all logs and builds a binary tree
3. **Smart Contract**: Stores only the root hash (32 bytes) on-chain
4. **Verification**: Uses saved proofs to verify any log against on-chain root

### Why Merkle Trees?

- **Efficient**: Only 1 hash stored on-chain (cheap gas)
- **Scalable**: Can batch 1000s of logs
- **Verifiable**: Can prove any log was in the batch
- **Standard**: Used by Bitcoin, Ethereum, Git

---

## 📜 Smart Contract Functions

### `anchorRoot(string batchId, bytes32 merkleRoot)`

Stores a Merkle root on the blockchain.

**Parameters:**
- `batchId`: Unique identifier (e.g., `batch_1732368896000`)
- `merkleRoot`: 32-byte hash of the Merkle tree root

**Emits:** `LogBatchAnchored` event

### `verifyBatch(string batchId)`

Retrieves stored batch information.

**Returns:**
- `merkleRoot`: The stored root hash
- `timestamp`: When it was anchored
- `committer`: Who anchored it

---

## 💡 Best Practices

### Anchoring Frequency

- **Hourly**: For high-traffic systems
- **Daily**: For medium traffic
- **Weekly**: For low traffic

**Setup automation:**
```bash
# Windows Task Scheduler
# Run: npx hardhat run scripts/anchor_logs.js --network hoodi
# Schedule: Every 6 hours
```

### Gas Optimization

Each anchor costs ~45,000 gas (~$0.01 on testnet).

**Tips:**
- Batch more logs per anchor (cheaper per log)
- Anchor during low network congestion
- Use testnet for development

### Security

- **Never commit** `.env` file (contains private key)
- Use separate wallet for testnet
- Regularly backup proof files
- Keep metadata files safe

---

## 🧪 Testing

### Generate Test Logs

```bash
# Start backend
cd ../backend
python test_api.py

# Send test requests
curl -X POST http://localhost:8000/analyze -H "Content-Type: application/json" -d '{"payload":"<script>alert(1)</script>","ip_address":"192.168.1.1"}'
```

### Test Tamper Detection

```bash
# 1. Anchor logs
npx hardhat run scripts/anchor_logs.js --network hoodi

# 2. Get an event_id from logs
# 3. Verify it (should pass)
npx hardhat run scripts/verify_log.js --network hoodi evt_123456

# 4. Manually edit the log file
# 5. Verify again (should fail - tamper detected!)
npx hardhat run scripts/verify_log.js --network hoodi evt_123456
```

---

## 🛠️ Troubleshooting

### "Insufficient funds"
- Get test ETH from faucet
- Check wallet balance

### "Batch already anchored"
- Each batchId can only be used once
- Generate new logs to create a new batch

### "Contract not found"
- Ensure CONTRACT_ADDRESS is set in `.env`
- Verify contract is deployed on Hoodi

### "No logs found"
- Run FastAPI backend first
- Send test requests to generate logs

---

## 🔍 Verification Example

```bash
$ npx hardhat run scripts/verify_log.js --network hoodi evt_1732368896123456

🔍 Log Verification System
=====================================
Event ID: evt_1732368896123456

✅ Found in batch: batch_1732368896000

📄 Log Details:
-------------------------------------
   Event ID: evt_1732368896123456
   Timestamp: 2025-11-23T12:34:56Z
   Client IP: 192.168.1.100
   Verdict: xss
   Confidence: 98.5%

⛓️  On-Chain Data:
-------------------------------------
   Batch ID: batch_1732368896000
   Merkle Root: 0xabc123...
   Block Time: 2025-11-23T12:35:10Z
   Committer: 0x742d35Cc...

✅ VERIFICATION SUCCESSFUL
=====================================
✓ This log is cryptographically proven
✓ Part of the anchored batch
✓ NOT tampered since anchoring
```

---

## 📚 Additional Resources

- **Hardhat Docs**: https://hardhat.org/docs
- **Merkle Trees**: https://en.wikipedia.org/wiki/Merkle_tree
- **Hoodi Testnet**: https://hoodi.ethpandaops.io
- **Ethers.js v6**: https://docs.ethers.org/v6/

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Hardhat documentation
3. Verify network connectivity
4. Ensure all dependencies are installed

---

## 📄 License

MIT License - See project root for details
