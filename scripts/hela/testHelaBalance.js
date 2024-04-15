const hre = require("hardhat");
const EP_ADDR = "0xc9569A87e533b29A06e758874f0533Ab5EAC5113";
const EP_ADDR_HELA = "0xA93a94f983A2E79d861E55124f96454A4E6411eA";
const SMART_ACCOUNT_ADDR = "0x20a27EA707D92a8f494668BfB09C605Eb2BD1D14";
const PM_ADDRESS = "0xf8e99BB0e456A26E17A01f71b285E7eeA2a03651";

async function main() {
  const code = await hre.ethers.provider.getCode(EP_ADDR);
  
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