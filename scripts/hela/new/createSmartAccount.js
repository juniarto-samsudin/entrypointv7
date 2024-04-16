const hre = require("hardhat");
const { createPimlicoPaymasterClient } = require("permissionless/clients/pimlico");
//import { ethers } from "hardhat";
//const ethers = require("ethers");
const EP_ADDR_HELA="0xC6373015eC6C590586C31d4133f8Cee3DA8b5265";
const SMART_ACCOUNT_ADDR = "";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const AF_ADDR = "0x29F082eaB3e6F00f1E97F1AeDF5b29E5A720E9B6"; 

/* const EP_ADDR_HELA="0xDc7b5413dDfcb15C5DB98ef384fCdBDa85A6f25F";
const SMART_ACCOUNT_ADDR = "";
const PM_ADDRESS = "0x799524a9aaeb447bFb5BE5f42BBb2802b52Ac249";
const AF_ADDR = "0x7f3ebA79f2597468Bb4613bfEE3f0caB7Db6CfA7"; */

const Web3 = require('web3');
//const web3 = new Web3('https://testnet-rpc.helachain.com');
const web3 = new Web3('https://sepolia.infura.io/v3/16b6f7b8cc374111b27a9d8a9c85dfe9')
const contractABI = require('../../../artifacts/@account-abstraction/contracts/core/EntryPoint.sol/EntryPoint.json').abi;
const contractAccountFactoryABI = require('../../../artifacts/contracts/Account.sol/AccountFactory.json').abi;
const contractAccountABI = require('../../../artifacts/contracts/Account.sol/Account.json').abi;
const PRIVATE_KEY = "a640f768c7470120d74d0b995cd064b3395e9b4c4f6d91c4e8accf4ef5c220fb";

const FACTORY_NONCE = 1;
web3.eth.accounts.wallet.add(PRIVATE_KEY);
const web3EpContract = new web3.eth.Contract(contractABI, EP_ADDR_HELA);

async function main() {
     //create  [sender smart account address] using [account factory address + nonce]
    /* const sender = await hre.ethers.getCreateAddress({
        from: AF_ADDR,
        nonce: FACTORY_NONCE,
    }); */
    //console.log('Sender Addres:', sender); //0x20a27EA707D92a8f494668BfB09C605Eb2BD1D14

    const [signer0] = await hre.ethers.getSigners();
    const address0 = await signer0.getAddress();
    console.log('address0:', address0); //0xc0eebf09175808ced41df8d80a5cdaafd629c160

    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    const initCode = AF_ADDR + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);
    //const initCode = '0x'
    const Account = await hre.ethers.getContractFactory("Account");
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR_HELA);


        web3EpContract.methods.getSenderAddress(initCode).send({
            from: address0,
            gas: 2300000,
            //gasPrice: 9000000000
        }).then((result) => {
            console.log('Result:', result);
        }).catch((error) => {
            console.log('Error:', error.message);
        });

    
    //let sender;
    //try{
        //await entryPoint.getSenderAddress(initCode, {
                //gasPrice: hre.ethers.parseUnits("0.000001", "ether"), //0.001 is working
                //gasLimit: 1800000, // Specify the desired gas limit here
                //value: hre.ethers.parseUnits("0.000000001", "ether")
            //});
        /* sender = await entryPoint.getSenderAddress(initCode,{
            gasPrice: hre.ethers.parseUnits("0.0001", "ether"), //0.001 is working
            gasLimit: 5000000 // Specify the desired gas limit here
        }); */
        //console.log('myAddress:', x);
        //console.log('sender.data.slice(-40):', sender.data.slice(-40));
        //sender = "0x" + myAddress.data.slice(-40);   
    //} catch (ex) {
        //console.log('ex:', ex);
        //console.log('ex.data:', ex.data);
        //console.log('ex.data.slice(-40):', ex.data.slice(-40));
        //sender = "0x" + ex.data.slice(-40)
    //}
    //console.log('Sender Addres:', sender); //0xd41df8d80a5cdaafd629c1600000000000000000
    //console.log('entryPoint Nonce:', await entryPoint.getNonce(sender, 0));

    /* const code = await hre.ethers.provider.getCode(sender);
    if (code !== "0x") {
        console.log("Smart account already exists");
        initCode = "0x";
    }

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

    const userOpHash = await entryPoint.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));
    
    const tx = await entryPoint.handleOps([userOp], address0, { 
        gasPrice: hre.ethers.parseUnits("0.0001", "ether"), //0.001 is working
        gasLimit: 5000000 // Specify the desired gas limit here
    }); ///normally is bundler, but now is address0

    const receipt = await tx.wait();
    console.log(receipt); */


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });