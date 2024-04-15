const hre = require("hardhat");
const EP_ADDR_HELA = "0xDc7b5413dDfcb15C5DB98ef384fCdBDa85A6f25F";
const SMART_ACCOUNT_ADDR = "";
const PM_ADDRESS = "0x799524a9aaeb447bFb5BE5f42BBb2802b52Ac249";

async function main() {
  //const code = await hre.ethers.provider.getCode(EP_ADDR_HELA);
  
  //const account = await hre.ethers.getContractAt("Account", SMART_ACCOUNT_ADDR);
  //const count = await account.count();
  //console.log(count.toString());
 
  //const smartAccountBalance = await hre.ethers.provider.getBalance(SMART_ACCOUNT_ADDR);
  //console.log(smartAccountBalance);

  const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDR_HELA);
  //console.log("account balance on EP", await ep.balanceOf(SMART_ACCOUNT_ADDR));
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