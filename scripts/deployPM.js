const hre = require("hardhat");

async function main() {
  const af = await hre.ethers.deployContract("Paymaster");

  await af.waitForDeployment();

  console.log(`PM deployed to ${af.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
//HELA 0xf8e99BB0e456A26E17A01f71b285E7eeA2a03651
//HELA 0xfa6f043CA6bF4c788832d40f43457D9319A9bcDB