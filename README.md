# GLB-NFT Minting

## Overview

GLB-NFT Minting is a project aimed at creating and minting NFTs (Non-Fungible Tokens) representing 3D models stored as GLB files on IPFS. The project consists of a Vite + React client for the front end and a Node.js + Truffle Ganache server for the backend.

## Setup Steps

### Client (Vite + React)

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Navigate to the client directory:
   ```bash
   cd client
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file in the `client` directory and refer to `example.env.local` for the required environment variables.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:3000` in your browser.

### Server (Node.js + Truffle Ganache)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory and refer to `example.env` for the required environment variables.

4. Start Ganache:
   ```bash
   npx ganache-cli
   ```

5. Compile and migrate the smart contracts:
   ```bash
   truffle compile
   truffle migrate
   ```

6. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

- **Client (React):** Refer to `example.env.local` for environment variables related to the client-side application.
- **Server (Node.js):** Refer to `example.env` for environment variables related to the server-side application.

## Tech Stack

- **Frontend:** Vite, React, React Three Fiber
- **Backend:** Node.js, Truffle, Solidity
- **Blockchain:** Ganache
- **IPFS:** Pinata API
- **Wallet:** MetaMask

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

---
