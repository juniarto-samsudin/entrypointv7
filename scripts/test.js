const hre = require("hardhat");
const EP_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const SMART_ACCOUNT_ADDR = "0x3189aaca3fab58322ea67175ea407740cb70a220";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  const code = await hre.ethers.provider.getCode(EP_ADDR);
  
  const account = await hre.ethers.getContractAt("Account", SMART_ACCOUNT_ADDR);
  const count = await account.count();
  console.log(count.toString());
 
  const smartAccountBalance = await hre.ethers.provider.getBalance(SMART_ACCOUNT_ADDR);
  console.log(smartAccountBalance);

  const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);
  console.log("account balance on EP", await ep.balanceOf(SMART_ACCOUNT_ADDR));
  console.log("paymaster balance on EP", await ep.balanceOf(PM_ADDRESS));

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