const hre = require("hardhat");

const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";


async function main() {
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);


  
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  //ONETIME CREATE SMART ACCOUNT
  let initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);
  //const initCode = "0x";

  let sender;
  try{
    await entryPoint.getSenderAddress(initCode);
  } catch (ex) {
    sender = "0x" + ex.data.data.slice(-40)
  }

  const code = await hre.ethers.provider.getCode(sender);
  if (code !== "0x") {
    console.log("Smart account already exists");
    initCode = "0x";
  }

  console.log('Sender Addres:')
  console.log(sender);
  //prefund: deposit to [sender smart account address]

  //ONLY ONE TIME
  //await entryPoint.depositTo(sender,{
  //  value: hre.ethers.parseEther("100"),
  //})
 //await entryPoint.depositTo(PM_ADDRESS,{
 //   value: hre.ethers.parseEther("100"),
 //}) 

  const Account = await hre.ethers.getContractFactory("Account");

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
   //paymasterAndData: '0x',
   //signature: signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("wee")))
   signature:"0x"
 }

 const userOpHash = await entryPoint.getUserOpHash(userOp);
 userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));


  const tx = await entryPoint.handleOps([userOp], address0);  ///normally is bundler, but now is address0
  const receipt = await tx.wait();
  console.log(receipt);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0