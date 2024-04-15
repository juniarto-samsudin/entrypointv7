const hre = require("hardhat");

const EP_ADDR_HELA = "0xb7bBe14B0a8d44e3b99fF6fe2e495f4A47De22E7";
const SMART_ACCOUNT_ADDR = "0x1c6E091d27c133235A7B212796EFE19F66f611cD";
const PM_ADDRESS = "0xfF68EAe37A5533F39718e362CC6812912B693039";

async function main() {
  const code = await hre.ethers.provider.getCode(EP_ADDR_HELA);
  
  const account = await hre.ethers.getContractAt("Account", SMART_ACCOUNT_ADDR);
  const count = await account.count();
  console.log(count.toString());
 
  const smartAccountBalance = await hre.ethers.provider.getBalance(SMART_ACCOUNT_ADDR);
  console.log(smartAccountBalance);

  const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDR_HELA);
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