const hre = require("hardhat");
//import { ethers } from "hardhat";
//const ethers = require("ethers");
const EP_ADDR = "0xDc7b5413dDfcb15C5DB98ef384fCdBDa85A6f25F";
const SMART_ACCOUNT_ADDR = "";
const PM_ADDRESS = "0x799524a9aaeb447bFb5BE5f42BBb2802b52Ac249";
const AF_ADDR = "0x7f3ebA79f2597468Bb4613bfEE3f0caB7Db6CfA7";

/* const Web3 = require('web3');
const web3 = new Web3('https://testnet-rpc.helachain.com');
const contractABI = require('../../../artifacts/@account-abstraction/contracts/core/EntryPoint.sol/EntryPoint.json').abi;
const contractAccountFactoryABI = require('../../../artifacts/contracts/Account.sol/AccountFactory.json').abi;
const contractAccountABI = require('../../../artifacts/contracts/Account.sol/Account.json').abi;
const PRIVATE_KEY = "a640f768c7470120d74d0b995cd064b3395e9b4c4f6d91c4e8accf4ef5c220fb";

const FACTORY_NONCE = 1; */

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