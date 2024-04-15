const hre = require("hardhat");
//import { ethers } from "hardhat";
//const ethers = require("ethers");
const EP_ADDR = "0xc9569A87e533b29A06e758874f0533Ab5EAC5113";
const EP_ADDR_HELA = "0xA93a94f983A2E79d861E55124f96454A4E6411eA";
const SMART_ACCOUNT_ADDR = "0x20a27EA707D92a8f494668BfB09C605Eb2BD1D14";
const PM_ADDRESS = "0xf8e99BB0e456A26E17A01f71b285E7eeA2a03651";
const AF_ADDR = "0xbcAf4EC94379639b868B3E326389bbee4B627C50";

const Web3 = require('web3');
const web3 = new Web3('https://testnet-rpc.helachain.com');
const contractABI = require('../../artifacts/@account-abstraction/contracts/core/EntryPoint.sol/EntryPoint.json').abi;
const contractAccountFactoryABI = require('../../artifacts/contracts/Account.sol/AccountFactory.json').abi;
const contractAccountABI = require('../../artifacts/contracts/Account.sol/Account.json').abi;
const PRIVATE_KEY = "a640f768c7470120d74d0b995cd064b3395e9b4c4f6d91c4e8accf4ef5c220fb";

const FACTORY_NONCE = 1;

async function main() {
    
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);
    
    await entryPoint.depositTo(PM_ADDRESS,{
        value: hre.ethers.parseEther("100"),
    }) 

    console.log("account balance on EP", await entryPoint.balanceOf(SMART_ACCOUNT_ADDR));
    console.log("paymaster balance on EP", await entryPoint.balanceOf(PM_ADDRESS));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });