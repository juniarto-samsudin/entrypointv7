const hre = require("hardhat");

async function main() {
  const af = await hre.ethers.deployContract("AccountFactory");

  await af.waitForDeployment();

  console.log(`AF deployed to ${af.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
//HELA 0xbcAf4EC94379639b868B3E326389bbee4B627C50
//HELA 0xCF15038abC09cf463e16B0e7De2deF8fF846f749
//HELA 0xF19109640f8B1Ba06639fbFa72703A93DE5Fc529