const hre = require("hardhat");
const { createPimlicoPaymasterClient } = require("permissionless/clients/pimlico");
//import { ethers } from "hardhat";
//const ethers = require("ethers");
const EP_ADDR = "0xc9569A87e533b29A06e758874f0533Ab5EAC5113";
const EP_ADDR_HELA = "0xA93a94f983A2E79d861E55124f96454A4E6411eA";
const SMART_ACCOUNT_ADDR = "";
const PM_ADDRESS = "0xf8e99BB0e456A26E17A01f71b285E7eeA2a03651";
//const AF_ADDR = "0xbcAf4EC94379639b868B3E326389bbee4B627C50";
const AF_ADDR = "0x5C2e3639aF4c34c561588a7049BCDc4ff3324ef4";

const Web3 = require('web3');
const web3 = new Web3('https://testnet-rpc.helachain.com');
const contractABI = require('../../../artifacts/@account-abstraction/contracts/core/EntryPoint.sol/EntryPoint.json').abi;
const contractAccountFactoryABI = require('../../../artifacts/contracts/Account.sol/AccountFactory.json').abi;
const contractAccountABI = require('../../../artifacts/contracts/Account.sol/Account.json').abi;
const PRIVATE_KEY = "a640f768c7470120d74d0b995cd064b3395e9b4c4f6d91c4e8accf4ef5c220fb";

const FACTORY_NONCE = 1;

async function main() {
     //create  [sender smart account address] using [account factory address + nonce]
    const sender = await hre.ethers.getCreateAddress({
        from: AF_ADDR,
        nonce: FACTORY_NONCE,
    });
    console.log('Sender Addres:', sender); //0x20a27EA707D92a8f494668BfB09C605Eb2BD1D14

    const [signer0] = await hre.ethers.getSigners();
    const address0 = await signer0.getAddress();
    console.log('address0:', address0); //0xc0eebf09175808ced41df8d80a5cdaafd629c160

    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    //const initCode = AF_ADDR + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);
    const initCode = '0x'
    const Account = await hre.ethers.getContractFactory("Account");
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR_HELA);

    /* await entryPoint.depositTo(PM_ADDRESS,{
        value: hre.ethers.parseEther("100"),
    })  */
    
    console.log('entryPoint Nonce:', await entryPoint.getNonce(sender, 0));

    const userOp = {
        sender,  // smart account address
        nonce: await entryPoint.getNonce(sender, 0),   // from entryPoint
        initCode,  // for AccountFactory
        callData: Account.interface.encodeFunctionData("execute"),   //function in smart account
        callGasLimit: 500_000,
        verificationGasLimit: 500_000,
        preVerificationGas: 100_000,
        maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
        paymasterAndData: PM_ADDRESS,
        signature:"0x"
    }

    const tx = await entryPoint.handleOps([userOp], address0, { 
        gasPrice: hre.ethers.parseUnits("0.0001", "ether"), //0.001 is working
        gasLimit: 5000000 // Specify the desired gas limit here
    }); ///normally is bundler, but now is address0

    //const tx = await entryPoint.handleOps([userOp], address0); 
    const receipt = await tx.wait();
    console.log(receipt);


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });