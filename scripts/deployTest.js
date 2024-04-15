const hre = require("hardhat");
async function main() {
    const [signer0] = await hre.ethers.getSigners();
    const signature = await signer0.signMessage(
        hre.ethers.getBytes(hre.ethers.id("wee"))
    );
    
const test = await hre.ethers.deployContract("Test", [signature],{
    gasPrice: hre.ethers.parseUnits("0.000001", "ether"),
    gasLimit: 500000
});

  await test.waitForDeployment();

  console.log(`Test deployed to ${test.target}`);

  const ownerAddress = await test.getOwner();
    console.log('ownerAddress:', ownerAddress);  


}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});