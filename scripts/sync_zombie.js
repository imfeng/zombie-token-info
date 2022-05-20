const fs = require('fs');
const path = require('path')
const bs58 = require('bs58')
const ethers = require('ethers');
const ZombieABI = require('./zombieclub-abi.json');
require('dotenv').config({path: path.resolve(__dirname, '../.env.dev')});

const ZombieAddress = '0x9c80777cae192e5031c38a0d951c55730ecc3f5e';
const ZombieInterface = new ethers.utils.Interface(ZombieABI);
const outputFilePath = path.resolve(__dirname, '../src/assets/zombie-map.json');
const provider = new ethers.providers.JsonRpcProvider(process.env['WE3_RPC_URL']);
const EachFetchDataBlockSize = 2000;
const fromBlock = 14486247;

async function main() {
    const latestBlock = await provider.getBlockNumber();
    const signer =  provider.getSigner()
    const ZombieContract = new ethers.Contract(ZombieAddress, ZombieABI, signer);
    const result = {"updated_time": new Date().getTime()};
    const parseZombieToken = async (fromBlock, toBlock) => {
        const filters = ZombieContract.filters.Revealed();
        const revealedEvents = await ZombieContract.queryFilter(
            filters,
            fromBlock,
            toBlock
        );
        let pending = [];
        console.log(`> find ${revealedEvents.length} events.....`)
        for (let index = 0; index < revealedEvents.length; index++) {
            if(index % 10 === 0) {
                await Promise.all(pending.concat(delay(1000))); // every 10 tx await minumun 1s
                pending = [];
            }
            const event = revealedEvents[index];
            const tockenId = event.args['tokenId'].toNumber();
            if(result[tockenId]) {
                continue;
            }
            pending.push(setResultFromEvent(event, result));
        }
        await Promise.all(pending);
    }

    const setResultFromEvent = async (event) => {
        try {
            const tx = await event.getTransaction();
            const decodedTx = ZombieInterface.parseTransaction({ data: tx.data, value: tx.value});
            if(decodedTx.name === 'revealMany') {
                const tokens = decodedTx.args['_tokenIds'];
                const hashes = decodedTx.args['_tokenBaseURIHashes'];
                tokens.forEach((id, idx) => {
                    result[id] = hashes[idx].map(v => getIpfsHashFromBytes32(v));
                });
            }
            if(decodedTx.name === 'reveal') {
                const id = decodedTx.args['_tokenId'];
                const hash = decodedTx.args['_tokenBaseURIHashes'].map(v => getIpfsHashFromBytes32(v));;
                result[id] = hash;
            }

            return true;
        } catch (error) {
            console.error(`ERROR getTxDetailFromEvent: ${error}`);
            return false;
        }
    }

    let currentStartBlock =  fromBlock;
    let currentEndBlock =  fromBlock + EachFetchDataBlockSize;
    currentEndBlock = currentEndBlock > latestBlock ? latestBlock : currentEndBlock;
    while (currentEndBlock <= latestBlock) {
        console.log(`parsing ${currentStartBlock} ~ ${currentEndBlock} (end=${latestBlock}) blocks......`);
        await parseZombieToken(currentStartBlock, currentEndBlock);
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

function getIpfsHashFromBytes32(bytes32Hex) {
    // Add our default ipfs values for first 2 bytes:
    // function:0x12=sha2, size:0x20=256 bits
    // and cut off leading "0x"
    const hashHex = "1220" + bytes32Hex.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
