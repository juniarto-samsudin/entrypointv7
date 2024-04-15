const hre = require("hardhat");
//import { ethers } from "hardhat";
//const ethers = require("ethers");
const EP_ADDR = "0xc9569A87e533b29A06e758874f0533Ab5EAC5113";
const EP_ADDR_HELA = "0xA93a94f983A2E79d861E55124f96454A4E6411eA";
const SMART_ACCOUNT_ADDR = "";
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
  //create  [sender smart account address] using [account factory address + nonce]
  const sender = await hre.ethers.getCreateAddress({
    from: AF_ADDR,
    nonce: FACTORY_NONCE,
  });

  console.log('Sender Addres:')
  console.log(sender);

  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();
  console.log('address0:')
  console.log(address0);

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  //ONETIME
  //const initCode = AF_ADDR + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);
  const initCode = "0x";
  //console.log('initCode:')
  //console.log(initCode); //0xbcAf4EC94379639b868B3E326389bbee4B627C509859387b000000000000000000000000c0eebf09175808ced41df8d80a5cdaafd629c160

  const Account = await hre.ethers.getContractFactory("Account");
  
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);
  const entryPointWeb3 = new web3.eth.Contract(contractABI, EP_ADDR);

 /*  await entryPoint.depositTo(sender,{
    value: hre.ethers.parseEther("123"),
  })  */
  
  const userOp = {
   sender,  // smart account address
   nonce: await entryPoint.getNonce(sender, 0),   // from entryPoint
   initCode,  // for AccountFactory
   callData: Account.interface.encodeFunctionData("execute"),   //function in smart account
   callGasLimit: 200_000_000,
   verificationGasLimit: 200_000_000,
   preVerificationGas: 50_000_000,
   maxFeePerGas: hre.ethers.parseUnits("10000", "gwei"),
   maxPriorityFeePerGas: hre.ethers.parseUnits("5000", "gwei"),
   paymasterAndData: PM_ADDRESS,
   signature:"0x"
 }
  /* const gasPricex = ethers.parseUnits("9000000000", "gwei");
  const txx = await entryPoint.handleOps([userOp], address0, 
    {gasPrice: gasPricex,
     gasLimit: 900000000,
    });  ///normally is bundler, but now is address0
  const receipt = await txx.wait();
  console.log(receipt); */

  //USING WEB3
  /* const gasPrice = '20000000000'; // replace with your desired gas price in wei
  const options = {
    from: address0, // the address initiating the transaction
    gasPrice: gasPrice
  };

  entryPointWeb3.methods.handleOps([userOp], address0).send(options)
  .on('transactionHash', function(hash){
    console.log('transactionHash', hash);
  })
  .on('receipt', function(receipt){
    console.log('receipt', receipt);
  })
  .on('error', console.error); */

  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
console.log('account.address:', account.address);
console.log(entryPointWeb3.options.address);

const gasPrice = '9000000000000000000'; // replace with your desired gas price in wei

const data = entryPointWeb3.methods.handleOps([userOp], address0).encodeABI();
const tx = {
  from: account.address,
  to: entryPointWeb3.options.address,
  gasPrice: gasPrice,
  data: data,
  gas: 1000000000000000000,
};

web3.eth.sendTransaction(tx)
  .on('transactionHash', function(hash){
    console.log('transactionHash', hash);
  })
  .on('receipt', function(receipt){
    console.log('receipt', receipt);
  })
  .on('error', console.error);

const data2 = entryPointWeb3.methods.depositTo(sender).encodeABI();
const valueToSend = web3.utils.toWei('1', 'ether');
const tx2 = {
  from: account.address,
  to: entryPointWeb3.options.address,
  gasPrice: gasPrice,
  data: data2,
  gas: 9000000000,
  value: valueToSend
};

web3.eth.sendTransaction(tx2) 
  .on('transactionHash', function(hash){
    console.log('transactionHash', hash);
  })
  .on('receipt', function(receipt){
    console.log('receipt', receipt);
  })
  .on('error', console.error);


  /* await entryPoint.depositTo(sender,{
    value: hre.ethers.parseEther("123"),
    gasPrice: hre.ethers.parseUnits("1000000000", "gwei"),
  })  */










  //const code = await hre.ethers.provider.getCode(EP_ADDR);
  
  //const account = await hre.ethers.getContractAt("Account", SMART_ACCOUNT_ADDR);
  //const count = await account.count();
  //console.log(count.toString());
 
  //const smartAccountBalance = await hre.ethers.provider.getBalance(SMART_ACCOUNT_ADDR);
  //console.log(smartAccountBalance);

  //const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);
/*   await entryPoint.depositTo(PM_ADDRESS,{
    value: hre.ethers.parseEther("100"),
  }); */
  //const [owner] = await hre.ethers.getSigners();
  //const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDR_HELA, owner);
  //const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDR_HELA);
  //const ep = await ethers.getContractAt("EntryPoint", EP_ADDR_HELA);
  //const entrypoint = await ethers.getContractAt('EntryPoint', EP_ADDR);

  //USING WEB3
  //const ep = new web3.eth.Contract(contractABI, EP_ADDR);
  //console.log("paymaster balance on EP", await ep.methods.balanceOf(PM_ADDRESS).call());

  console.log("paymaster balance on EP", await entryPoint.balanceOf(PM_ADDRESS));
  console.log("account balance on EP", await entryPoint.balanceOf(sender));

  //console.log(code);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0x5FbDB2315678afecb367f032d93F642f64180aa3