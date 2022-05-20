const fs = require('fs');
const path = require('path')
const ethers = require('ethers');
const ZombieABI = require('./zombieclub-abi.json');
require('dotenv').config({path: path.resolve(__dirname, '../.env.dev')});

const ZombieAddress = '0x9c80777cae192e5031c38a0d951c55730ecc3f5e';
const provider = new ethers.providers.JsonRpcProvider(process.env['WE3_RPC_URL']);

const outputFilePath = path.resolve(__dirname, '../src/assets/reveal-to-token.json');
const EachFetchDataBlockSize = 10000;
const fromBlock = 14486247;

async function main() {
  const latestBlock = await provider.getBlockNumber();
  const signer =  provider.getSigner()
  const ZombieContract = new ethers.Contract(ZombieAddress, ZombieABI, signer);
  const result = {"updated_time": new Date().getTime()};
  const parseZombieTokenReveal = async (fromBlock, toBlock) => {
      const filters = ZombieContract.filters.RevealReceived();
      const revealedEvents = await ZombieContract.queryFilter(
          filters,
          fromBlock,
          toBlock
      );
      console.log(`> find ${revealedEvents.length} events.....`)
      for (let index = 0; index < revealedEvents.length; index++) {
          const event = revealedEvents[index];
          const tockenId = event.args['tokenId'].toNumber();
          const revealId = event.args['revealId'].toNumber();
          result[revealId] = tockenId;
      }
  }

  let currentStartBlock =  fromBlock;
  let currentEndBlock =  fromBlock + EachFetchDataBlockSize;
  currentEndBlock = currentEndBlock > latestBlock ? latestBlock : currentEndBlock;
  while (currentEndBlock <= latestBlock) {
      console.log(`parsing ${currentStartBlock} ~ ${currentEndBlock} (end=${latestBlock}) blocks......`);
      await parseZombieTokenReveal(currentStartBlock, currentEndBlock);
      if (currentEndBlock >= latestBlock) {
          break;
      }
      currentStartBlock = currentEndBlock + 1;
      currentEndBlock = currentEndBlock + EachFetchDataBlockSize > latestBlock ? latestBlock : currentEndBlock + EachFetchDataBlockSize;
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(result), 'utf8', function(err) {
      if (err) return console.log(err);
  });
  
  
}

function delay(time = 1000) {
  return new Promise((r) => {
      setTimeout(r, time)
  })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

function delay(time = 1000) {
  return new Promise((r) => {
      setTimeout(r, time)
  })
}