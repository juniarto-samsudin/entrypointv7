require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const ethers = require('ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  solidity:{
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      evmVersion: "london"
    }
  },
  networks: {
    hela: {
      url: "https://testnet-rpc.helachain.com",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      //gasPrice: parseInt(ethers.parseUnits("9000000000", "gwei").toString())
    },
    mumbai: {
      url: "https://polygon-mainnet.infura.io/v3/5ee46a8f621f436fa4ff1abae634d296",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    }
  }
};
