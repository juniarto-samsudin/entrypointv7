const hre = require("hardhat");

const FACTORY_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PM_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const FACTORY_NONCE = 1;

async function main() {
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);


  //create  [sender smart account address] using [account factory address + nonce]
  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });
  
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  //ONETIME
  //const initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);
  const initCode = "0x";

  console.log('Sender Addres:')
    console.log(sender);
  //prefund: deposit to [sender smart account address]

  //ONLY ONE TIME
  /* await entryPoint.depositTo(sender,{
    value: hre.ethers.parseEther("100"),
  }) */
 /*  await entryPoint.depositTo(PM_ADDRESS,{
    value: hre.ethers.parseEther("100"),
  }) */

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp = {
   sender,  // smart account address
   nonce: await entryPoint.getNonce(sender, 0),   // from entryPoint
   initCode,  // for AccountFactory
   callData: Account.interface.encodeFunctionData("execute"),   //function in smart account
   callGasLimit: 200_000,
   verificationGasLimit: 200_000,
   preVerificationGas: 50_000,
   maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
   maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
   paymasterAndData: PM_ADDRESS,
   signature:"0x"
 }

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