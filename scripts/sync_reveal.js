const fs = require('fs');
const path = require('path');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const ZombieMap = require('../src/assets/zombie-map.json');
const ipfsGateway = [ 'https://opensea.mypinata.cloud/ipfs/', 'https://opensea.mypinata.cloud/ipfs/', 'https://opensea.mypinata.cloud/ipfs/' ];
// 'https://opensea.mypinata.cloud/ipfs/', 'https://cloudflare-ipfs.com/ipfs/', 'https://gateway.ipfs.io/ipfs/', 'https://ipfs.io/ipfs/', 'https://gateway.pinata.cloud/ipfs/', 'https://cf-ipfs.com/ipfs/

const outputFilePath = path.resolve(__dirname, '../src/assets/reveal-to-token.json');

axiosRetry(axios, { retries: 3 });
async function main() {
  const result = {"updated_time": new Date().getTime()};
  const ids = Object.keys(ZombieMap).sort((a, b) => a - b);
  let currentIndex = 0;
  let pending = [];
  console.log(`parsing ${ids.length} tokens.....`);
  while (currentIndex <= (ids.length-1)) {
    try {
      const tokenId = ids[currentIndex];
      const ipfsId = ZombieMap[tokenId][0];
      const gateway = ipfsGateway[currentIndex % ipfsGateway.length];
      // console.log(gateway)
      pending.push({
        id: tokenId,
        req: axios.get(`${gateway}${ipfsId}`),
      });
      if(pending.length === ipfsGateway.length || currentIndex === (ids.length-1)) {
        console.log(`INFO: waiting (${currentIndex+1}/${ids.length})......`);
        const resList = await Promise.all(pending.map(r => r.req));
        resList.forEach((res, idx) => {
          const revealId = res.data.name.split('#')[1];
          result[revealId] = pending[idx].id;
        });
        pending = [];
        await delay(500);
      }
    } catch (error) {
      console.log(`ERROR: currentIndex=${currentIndex}`);
      console.error(error.message);
      console.log(error.request)
    }
    currentIndex++;
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(result), 'utf8', function(err) {
    if (err) return console.log(err);
  });
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