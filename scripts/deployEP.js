const hre = require("hardhat");

async function main() {
  const af = await hre.ethers.deployContract("EntryPoint");

  await af.waitForDeployment();

  console.log(`EP deployed to ${af.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0x5FbDB2315678afecb367f032d93F642f64180aa3
//HELA 0xA93a94f983A2E79d861E55124f96454A4E6411eA
//HELA 0x2249F7d961f91253406336967F69df5AD693F9ec