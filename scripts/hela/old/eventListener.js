const Web3 = require('web3')
//const web3Hela = new Web3('ws://3.1.81.159:3001')
const web3Hela = new Web3('ws://13.212.208.252:3001')

const EntryPointABI = require('../../../artifacts/@account-abstraction/contracts/core/EntryPoint.sol/EntryPoint.json').abi  
const AccountFactoryABI = require('../../../artifacts/contracts/Account.sol/AccountFactory.json').abi
console.log('AccountFactoryABI:', AccountFactoryABI)
const TestABI = require('../../../artifacts/contracts/Account.sol/Test.json').abi

const AF_ADDR = "0x9F5b67550157FdfF40d36c837BbC50Ccb26cb841"
const AF_CONTRACT = new web3Hela.eth.Contract(AccountFactoryABI, AF_ADDR)
const EP_ADDR = "0xb7bBe14B0a8d44e3b99fF6fe2e495f4A47De22E7"
const EP_CONTRACT = new web3Hela.eth.Contract(EntryPointABI, EP_ADDR)
const TEST_ADDR = "0x4522340533cE76Ab3Fa616DfB03459939C2ff072"
const TEST_CONTRACT = new web3Hela.eth.Contract(TestABI, TEST_ADDR)

const fromBlock = 135218;
const toBlock = 'latest';
const batchSize = 100;

/* async function fetchEventsInBatches() {
  const latestBlockNumber = await web3Hela.eth.getBlockNumber();
  console.log('latestBlockNumber:', latestBlockNumber)
  const finalBlock = toBlock === 'latest' ? latestBlockNumber : toBlock;

  for (let i = fromBlock; i <= finalBlock; i += batchSize) {
    const endBlock = Math.min(i + batchSize - 1, finalBlock);
    TEST_CONTRACT.getPastEvents(
      'AllEvents',
      {
        fromBlock: i,
        toBlock: endBlock
      },
      (err, events) => { console.log(events) }
    );
  }
}

fetchEventsInBatches(); */

/* EP_CONTRACT.getPastEvents(
    'AllEvents',
    {
      fromBlock: 135218,
      toBlock: 'latest'
    },
    (err, events) => { console.log(events) }
  ) */

  // Listen for the SignatureVerified event
TEST_CONTRACT.events.TestEvent()
.on('data', event => {
    console.log('Signature verified. Signer address:', event.returnValues);
})
.on('error', error => {
    console.error('Error occurred while listening for events:', error);
});


EP_CONTRACT.events.handleOpsEvent()
.on('data', event => {
    console.log('Signature verified. Signer address:', event.returnValues);
})
.on('error', error => {
    console.error('Error occurred while listening for events:', error);
});

AF_CONTRACT.events.AccountCreated()
.on('data', event => {
    console.log('Account Factory create smart account:', event.returnValues);
})
.on('error', error => {
    console.error('Error occurred while listening for events:', error);
});

