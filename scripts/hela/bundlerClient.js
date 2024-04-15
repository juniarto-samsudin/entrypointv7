
const { createClient, createPublicClient, http } = require('viem');
const { bundlerActions, ENTRYPOINT_ADDRESS_V07, createBundlerClient } = require('permissionless');
const { mainnet } = require('viem/chains');
const { defineChain } = require('viem');
const { pimlicoBundlerActions } = require('permissionless/actions/pimlico');

console.log('Test')

const hela = defineChain({
    id: 666888,
    name: 'Hela',
    nativeCurrency: {
        name: 'HLUSD',
        symbol: 'HLUSD',
        decimals: 18
    },
    rpcUrls:{
        default:{
            http: ['https://testnet-rpc.helachain.com']
        }
    },
});

const client = createPublicClient({
    chain: hela,
    //transport: http(),
    transport: http("http://13.212.91.23:4337"),
}).extend(bundlerActions('0xA93a94f983A2E79d861E55124f96454A4E6411eA'));

const client2 = createBundlerClient({
    chain: hela,
    transport: http("http://13.212.91.23:4337"),
    //entryPoint: '0xc9569A87e533b29A06e758874f0533Ab5EAC5113',
    entryPoint: '0xA93a94f983A2E79d861E55124f96454A4E6411eA'
})

const PM_ADDRESS = "0xf8e99BB0e456A26E17A01f71b285E7eeA2a03651";
const EP_ADDR_HELA = "0xA93a94f983A2E79d861E55124f96454A4E6411eA";
const sender = "0x20a27EA707D92a8f494668BfB09C605Eb2BD1D14";
const initCode = '0x'

const main = async () => {
    //const blockNumber = await client.getBlockNumber();
    //console.log('Block number:', blockNumber);
    const supportedEntrypoint = await client.supportedEntryPoints();
    console.log('Supported entrypoints:', supportedEntrypoint);

    const [signer0] = await hre.ethers.getSigners();
    const Account = await hre.ethers.getContractFactory("Account");
    const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR_HELA);

    console.log('entryPoint Nonce:', await entryPoint.getNonce(sender, 0));

    const userOp = {
        sender,  // smart account address
        nonce: await entryPoint.getNonce(sender, 0),   // from entryPoint
        initCode,  // for AccountFactory
        callData: Account.interface.encodeFunctionData("execute"),   //function in smart account
        callGasLimit: 1_000_000,
        verificationGasLimit: 1_000_000,
        preVerificationGas: 100_000,
        maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        paymasterAndData: PM_ADDRESS,
        signature:"0x"
    }

    const userOpHash = await entryPoint.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

    const gasEstimate = await client.sendUserOperation({
        userOperation: userOp,
        entryPoint: "0xA93a94f983A2E79d861E55124f96454A4E6411eA"
    }) 

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


