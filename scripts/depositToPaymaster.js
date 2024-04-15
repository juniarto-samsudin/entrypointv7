const hre = require("hardhat");
//import { ethers } from "hardhat";
//const ethers = require("ethers");
const EP_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const SMART_ACCOUNT_ADDR = "0x20a27EA707D92a8f494668BfB09C605Eb2BD1D14";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const AF_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const Web3 = require('web3');
const web3 = new Web3('https://testnet-rpc.helachain.com');
const contractABI = require('../artifacts/@account-abstraction/contracts/core/EntryPoint.sol/EntryPoint.json').abi;
const contractAccountFactoryABI = require('../artifacts/contracts/Account.sol/AccountFactory.json').abi;
const contractAccountABI = require('../artifacts/contracts/Account.sol/Account.json').abi;
const PRIVATE_KEY = "a640f768c7470120d74d0b995cd064b3395e9b4c4f6d91c4e8accf4ef5c220fb";

const FACTORY_NONCE = 1;

async function main() {
    
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);
    
    await entryPoint.depositTo(PM_ADDRESS,{
        value: hre.ethers.parseEther("100"),
    }) 

    //console.log("account balance on EP", await entryPoint.balanceOf(SMART_ACCOUNT_ADDR));
    console.log("paymaster balance on EP", await entryPoint.balanceOf(PM_ADDRESS));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });