# 🚨 ReliefMesh: Decentralized Disaster Response Platform

> **"Unstoppable Aid for an Unpredictable World"**
>
> 🏆 **Submission for Hackathon 2026**
>
> TRACK 3: Digital Resilience


## 💡 Inspiration
In the wake of natural disasters, communication infrastructure often fails. Centralized servers go down, and traditional banking systems become inaccessible. **ReliefMesh** was born to answer one critical question: **"How can we coordinate rescue and funding when the internet is broken?"**

## 🚀 What is ReliefMesh?
ReliefMesh is an **offline-first, peer-to-peer (P2P) disaster management platform**. It allows victims to broadcast SOS signals that hop between devices without needing a central server. Simultaneously, it integrates **Ethereum Smart Contracts** to enable direct, transparent, and fee-free financial aid from donors to victims.

## ✨ Key Features
* **📡 Unstoppable P2P Mesh:** Powered by **Gun.js**, allowing devices to sync emergency data directly.
* **💸 Direct Crypto Aid:** Donations via **MetaMask** on **Sepolia Testnet** (Zero fees, Instant transfer).
* **🗺️ Live Command Center:** Real-time map visualization of SOS clusters.
* **📱 Cross-Device Sync:** Works seamlessly between Mobile and Desktop via Relay.

---

## 🛠️ Tech Stack
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
* **P2P Database:** Gun.js
* **Blockchain:** Ethers.js, Sepolia Testnet
* **Maps:** Leaflet, OpenStreetMap
* **Tunneling:** Ngrok (For public demo)

---

## 🚀 Getting Started (Run the Demo)

To see the full capabilities (P2P Sync & Cross-device), please follow these steps strictly:

### Prerequisites
* Node.js (v18+)
* MetaMask Extension (Browser or Mobile)
* Ngrok Account (Free tier is fine)

### Step 1: Clone & Install
```bash
git clone [https://github.com/your-username/relief-mesh.git](https://github.com/your-username/relief-mesh.git)
cd relief-mesh
npm install
```
### Step 2: Start the Relay Server (Terminal 1)

This acts as a "superpeer" to help sync data between devices during the demo.

```Bash

node relay.cjs
# Output: ✅ Local Relay started on port 8765
```
### Step 3: Expose Relay to Internet (Terminal 2)

Required for mobile devices to connect to your local computer.

```Bash
npx ngrok http 8765
```
> ⚠️ Important: Copy the https://....ngrok-free.app URL from this terminal and update src/hooks/useRelief.ts with this new link.
> 

### Step 4: Run the Frontend (Terminal 3)

```Bash

npm run dev
```
---

## 🧪 Demo Guide: How to Test on PC & Mobile

Since this system works cross-device, it is crucial to distinguish between the **"Code Link"** (Backend) and the **"Browser Link"** (Frontend).

### 🖥️ 1. Testing on Computer (PC / Notebook)

For the host machine, you can simply use Localhost.

1. Open Browser: **`http://localhost:5173`**
2. **Important:** The browser will ask for Location Access. Click **Allow** to see your pin on the map.

### 📱 2. Testing on Mobile

Mobile devices cannot access `localhost` directly. You need to create a separate tunnel for the frontend.

1. Open a **New Terminal (Terminal 4)**.
2. Run the command to expose the frontend:Bash
    
    `npx ngrok http 5173`
    
3. Copy the **Forwarding URL** (e.g., `https://xxxx-xxxx.ngrok-free.app`).
4. **Open this link on your Mobile.**
5. **Important:** Open the link inside the **MetaMask Browser** app to test the Donation feature.

### 🚨 Summary: Which Link is Which?

| **Port / Command** | **Usage** |
| --- | --- |
| **8765** (`ngrok http 8765`) | ❌ **DO NOT OPEN IN BROWSER.** Use this URL only inside `useRelief.ts` code (Backend P2P Tunnel). |
| **5173** (`ngrok http 5173`) | ✅ **OPEN THIS LINK.** Use this to view the app UI on mobile or share with judges. |

---

## 🧪 How to Test (Scenarios)

### 1. P2P Sync Demo

- Open the app on **Desktop** and **Mobile**.
- On Mobile, click the **SOS Button** and submit a request.
- Watch the **Desktop Map** update instantly without refreshing!

### 2. Donation Demo (Sepolia)

- Click on any SOS Pin on the map.
- Click **"Connect Wallet"** (Supports MetaMask).
- The app will automatically switch you to **Sepolia Testnet**.
- Click **"Donate 0.001 ETH"** to simulate a transaction.
