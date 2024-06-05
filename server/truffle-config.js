require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const ploygonTestNetURI = process.env.NETWORK_URI;
const mnemonic = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    polygon_testnet: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic,
          },
          providerOrUrl: ploygonTestNetURI,
          pollingInterval: 12000, 
        });
      },
      network_id: 80002,
      gas: 8000000,
      gasPrice: 1000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
      enabled: false,
      runs: 200,
    },
  },
};
