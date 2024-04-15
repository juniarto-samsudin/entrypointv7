const hre = require("hardhat");
//import { ethers } from "hardhat";
//const ethers = require("ethers");
const EP_ADDR = "0xb7bBe14B0a8d44e3b99fF6fe2e495f4A47De22E7";
const SMART_ACCOUNT_ADDR = "";
const PM_ADDRESS = "0xfF68EAe37A5533F39718e362CC6812912B693039";

/* const Web3 = require('web3');
const web3 = new Web3('https://testnet-rpc.helachain.com');
const contractABI = require('../artifacts/@account-abstraction/contracts/core/EntryPoint.sol/EntryPoint.json').abi;
const contractAccountFactoryABI = require('../artifacts/contracts/Account.sol/AccountFactory.json').abi;
const contractAccountABI = require('../artifacts/contracts/Account.sol/Account.json').abi;
const PRIVATE_KEY = "a640f768c7470120d74d0b995cd064b3395e9b4c4f6d91c4e8accf4ef5c220fb";

const FACTORY_NONCE = 1; */

async function main() {
    
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);
    
    await entryPoint.depositTo(PM_ADDRESS,{
        value: hre.ethers.parseEther("100"),
    }) 

    //await entryPoint.depositTo(SMART_ACCOUNT_ADDR,{
    //    value: hre.ethers.parseEther("123"),
    //}) 

    //console.log("account balance on EP", await entryPoint.balanceOf(SMART_ACCOUNT_ADDR));
    console.log("paymaster balance on EP", await entryPoint.balanceOf(PM_ADDRESS));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });