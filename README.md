# 🦎 ChamAIleon - AI-Powered Banking Honeypot

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Hoodi_Testnet-3C3C3D?style=for-the-badge&logo=ethereum)](https://hoodi.ethpandaops.io/)

> **Advanced AI-powered honeypot system with real-time threat detection, ML-based attack classification, and blockchain-anchored forensic logs**

<div align="center">

![ChamAIleon security](https://8upload.com/image/dc457a56b028886f/Screenshot__13_.png)


</div>

---

## 🔗 Live Demo

| Application | URL | Description |
|------------|-----|-------------|
| 🏦 **Main Application** | https://cham-a-ileon.vercel.app | User-facing honeypot banking interface |
| 🛡️ **Admin Dashboard** | https://cham-a-ileon-i9cw.vercel.app | Real-time security monitoring & forensics |
| 🤖 **ML Backend API** | [chameleon-api-umen.onrender.com](https://chameleon-api-umen.onrender.com) | Machine learning classification engine |



## 🎯 Overview

**ChamAIleon** is an advanced honeypot disguised as a banking app. It uses ML classification to detect SQL injection, XSS, and brute-force attacks. Blockchain integration secures the immutable logs, creating a complete, real-time defense and forensic analyze cyber attacks in real-time.

### 🎪 The Concept

The system presents attackers with a convincing fake banking interface while:
- 🕵️ Monitoring all user interactions
- 🤖 Classifying attacks using ML (SQL Injection, XSS, etc.)
- 🧠 Analyzing attacker intent with Google Gemini AI
- ⛓️ Anchoring evidence to blockchain for tamper-proof forensics
- 📊 Providing real-time security insights to administrators

---


### 🔄 Data Flow

```
User Input → Main App → ML Backend → Classification
                ↓
         Log Attack Event
                ↓
         Gemini AI Analysis
                ↓
         Firebase Storage
                ↓
    Blockchain Anchoring (Batch)
                ↓
         Admin Dashboard
```


---

## 🚀 Tech Stack

<!-- Frontend -->
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?logo=firebase)

<!-- Backend -->
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3-F7931E?logo=scikit-learn)
![pandas](https://img.shields.io/badge/pandas-2.x-150458?logo=pandas)

<!-- Blockchain -->
![Ethereum](https://img.shields.io/badge/Ethereum-Hoodi_Testnet-3C3C3D?logo=ethereum)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?logo=solidity)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.x-2535A0?logo=ethereum)
![Hardhat](https://img.shields.io/badge/Hardhat-2.x-FFF100?logo=hardhat)

<!-- AI/ML -->
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?logo=google)
![Random Forest](https://img.shields.io/badge/Random_Forest-Classifier-00C853)
![LIME](https://img.shields.io/badge/LIME-Explainability-FF6F00)

<!-- Deployment -->
![Vercel](https://img.shields.io/badge/Vercel-Production-000000?logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render)
![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)

---

## 📦 Installation

### **Prerequisites**

- Node.js 18+ and npm
- Python 3.11+
- Git
- Firebase account
- Google Gemini API key
- Ethereum wallet (for blockchain features)

### **1. Clone Repository**

```bash
git clone https://github.com/flexykrn/Chameleon_The_Outliers_SPIT_REDACT.git
cd Chameleon_The_Outliers_SPIT_REDACT
```

### **2. Setup Main Application**

```bash
cd chameleon
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your Firebase and Gemini credentials
```

### **3. Setup Admin Dashboard**

```bash
cd ../chameleon_admin
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
```

### **4. Setup ML Backend**

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### **5. Setup Blockchain (Optional)**

```bash
cd ../blockchain
npm install

# Create .env file with your private key
echo "PRIVATE_KEY=your_private_key_here" > .env
```


## 🔬 Technical Details

### **Machine Learning Model**

- **Algorithm:** Random Forest Classifier
- **Training Data:** 40,000+ labeled attack samples
- **Features:** TF-IDF vectorization (10,000 features)
- **Classes:** 5 (SQLi, XSS, CMDI, Path Traversal, Benign)
- **Performance:**
  - Accuracy: 97.2%
  - Precision: 96.8%
  - Recall: 96.5%
  - F1-Score: 96.6%

### **Blockchain Integration**

- **Network:** Hoodi Testnet (Ethereum-compatible)
- **Contract:** LogAnchor.sol
- **Address:** `0xecEFBA4B95fcD63C88f05Bd653c3eD5B2c574008`
- **Features:**
  - Batch anchoring with Merkle trees
  - Gas-optimized storage
  - Tamper-proof verification

### **AI Analysis**

- **Model:** Google Gemini 2.0 Flash
- **Purpose:** Generate human-readable attack explanations
- **Features:**
  - Attack intent analysis
  - OWASP reference linking
  - Severity assessment

---

## 🛡️ Security Considerations

### **What This System Does:**

✅ Detects and classifies cyber attacks  
✅ Provides forensic evidence via blockchain  
✅ Analyzes attacker behavior with AI  
✅ Isolates attacks in controlled honeypot environment  

### **What This System Does NOT Do:**

❌ Replace production security measures  
❌ Protect real banking systems  
❌ Store actual financial data  
❌ Prevent attacks (it observes them)  

> **Disclaimer:** This is a research/educational honeypot system. Do not use with real user data or as primary security infrastructure.



## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Firebase** - Authentication & Database
- **Google Gemini** - AI-powered analysis
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Hoodi Testnet** - Blockchain infrastructure
- **OWASP** - Security reference documentation
- **scikit-learn** - ML framework

---
