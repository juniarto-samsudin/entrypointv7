const hre = require("hardhat");
const { createPimlicoPaymasterClient } = require("permissionless/clients/pimlico");
//import { ethers } from "hardhat";
//const ethers = require("ethers");

const EP_ADDR_HELA = "0x66D84A625A7d435D39DC549F91B5a64b534438Dc";
const SMART_ACCOUNT_ADDR = "0xB00C677B24477468aDA942c94b632b767e98f4CC";
const PM_ADDRESS = "0x622025aE54448189192a9E0E8bb67dfb4B11E9fe";
const AF_ADDR = "0xCDC384a4D4fE79527E56c8222d3ef2b2679F0f82";


/* const EP_ADDR_HELA = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const SMART_ACCOUNT_ADDR = "";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const AF_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; */

/* const Web3 = require('web3');
const web3 = new Web3('https://testnet-rpc.helachain.com');
const contractABI = require('../../../artifacts/@account-abstraction/contracts/core/EntryPoint.sol/EntryPoint.json').abi;
const contractAccountFactoryABI = require('../../../artifacts/contracts/Account.sol/AccountFactory.json').abi;
const contractAccountABI = require('../../../artifacts/contracts/Account.sol/Account.json').abi;
const PRIVATE_KEY = "a640f768c7470120d74d0b995cd064b3395e9b4c4f6d91c4e8accf4ef5c220fb"; */

const FACTORY_NONCE = 7;

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
    const initCode = AF_ADDR + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);
    //const initCode = '0x'
    const Account = await hre.ethers.getContractFactory("Account");
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR_HELA);

    //let sender2;
    //try{
        //await entryPoint.getSenderAddress(initCode, {
        //    gasPrice: hre.ethers.parseUnits("0.0001", "ether"), //0.001 is working
        //    gasLimit: 300000 // Specify the desired gas limit here
        //});
        /* sender = await entryPoint.getSenderAddress(initCode,{
            gasPrice: hre.ethers.parseUnits("0.0001", "ether"), //0.001 is working
            gasLimit: 5000000 // Specify the desired gas limit here
        }); */
        //console.log('myAddress:', myAddress.data);
        //console.log('sender.data.slice(-40):', sender.data.slice(-40));   
    //} catch (ex) {
    //    console.log('ex:', ex.data);
    //    sender2 = "0x" + ex.data.data.slice(-40);
    //    console.log('sender2:', sender2);
        //console.log('ex.data:', ex.data);
        //console.log('ex.data.slice(-40):', ex.data.slice(-40));
        //sender = "0x" + ex.data.slice(-40)
    //}

    console.log('entryPoint Nonce:', await entryPoint.getNonce(sender, 0));
    //console.log('sender2:', sender2);
    const userOp = {
        sender,  // smart account address
        nonce: await entryPoint.getNonce(sender, 0),   // from entryPoint
        initCode,  // for AccountFactory
        callData: Account.interface.encodeFunctionData("execute"),   //function in smart account
        callGasLimit: 500_000,
        verificationGasLimit: 500_000,
        preVerificationGas: 500_000,
        maxFeePerGas: hre.ethers.parseUnits("100", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("100", "gwei"),
        paymasterAndData: PM_ADDRESS,
        signature: await signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("wee")))
    }

    const tx = await entryPoint.handleOps([userOp], address0, { 
        gasPrice: hre.ethers.parseUnits("0.00001", "ether"), //0.001 is working
        gasLimit: 2800000 // Specify the desired gas limit here
    }); ///normally is bundler, but now is address0

    //const tx = await entryPoint.handleOps([userOp], address0); 
    const receipt = await tx.wait();
    console.log('Receipt: ', receipt);


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });