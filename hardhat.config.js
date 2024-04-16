require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const ethers = require('ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  solidity:{
    compilers:[{
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000,
        },
        //evmVersion: "london"
      }
    }],
    overrides: {
      'contracts/MyEntryPoint.sol': {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000
          },
          viaIR: true
        }
      }
    }
  },
  networks: {
    hela: {
      url: "https://testnet-rpc.helachain.com",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      //gasPrice: parseInt(ethers.parseUnits("9000000000", "gwei").toString())
    },
    sepolia: {
      url:"https://sepolia.infura.io/v3/16b6f7b8cc374111b27a9d8a9c85dfe9",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    }
  }
};
