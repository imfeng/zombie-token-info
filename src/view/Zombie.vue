<template>
    <div
        translate="no"
        class="app"
        v-bind:class="[isMobile ? 'mobile' : 'desktop']"
    >

        <div class="section-studio">

            <div class="zombie-box">
                <div
                    class="img-item"
                    v-for="(item, idx) in zctImages"
                    v-bind:key="idx"
                >
                    <Loading v-bind:isShow="!item.isLoaded"></Loading>
                    <img

                        v-bind:alt="`#${idx}`"
                        v-bind:src="item.url"
                    >
                </div>
            </div>
            <div class="control-box">
                <label for="">Zombie club token ID： </label>
                <input
                    v-model="tokenId"
                    class="input-zombie"
                    type="number"
                >
                <button v-on:click="submit" class="btn-zombie">
                    SUBMIT
                </button>
            </div>
            <div class="detail-box">
                <p>latest update: 2022-05-05 05:00:00(GMT+8)</p>
                <a
                    target="_blank"
                    v-for="(url, idx) in zctMetadata"
                    v-bind:key="idx"
                    v-bind:href="url"
                >Metadata #{{ idx }}</a>
            </div>
        </div>
        <div class="copyright">
          <a target="_blank" href="https://etherscan.io/address/0xdE6bd783d0068bBf9011c50615F139FAf5acAA85">If you like this please donate: 0xdE6bd783d0068bBf9011c50615F139FAf5acAA85</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import ImgBlack from '@/assets/images/square-black.png';
import ImgCross from '@/assets/images/square-cross.png';
import ImgZctBlind from '@/assets/images/zombie-blind.png';
import zombieMap from '@/assets/zombie-map.json';
import Loading from '@/components/Loading.vue';
import { GlobalStore } from '@/store/GlobalStore';

const ipfsGateway = 'https://cloudflare-ipfs.com/ipfs/';
const { isMobile, } = GlobalStore;
type ImageType = {
    url: string;
    isLoaded: boolean;
    isDup: boolean;
}
const zctImages = ref<ImageType[]>(getDefaultZcts());
const zctMetadata = ref([]);
const tokenId = ref(1);
console.log(zombieMap);
const submit = async() => {
  if (zombieMap[tokenId.value]) {
    const metadataCids = zombieMap[tokenId.value];
    zctMetadata.value = metadataCids.map(r => `${ipfsGateway}${r}`);

    zctImages.value = new Array(4).fill(0).map(() => ({
      url: ImgBlack,
      isLoaded: false,
      isDup: false,
    }));
    for (let index = 0; index < metadataCids.length; index++) {
      const metadataUrl = metadataCids[index];
      zctImages.value[index].isDup = (index !== 0 && metadataUrl === metadataCids[index - 1]) || !metadataUrl;
      if (zctImages.value[index].isDup) {
        zctImages.value[index].url = ImgCross;
        zctImages.value[index].isLoaded = true;
      }
    }
    for (let index = 0; index < metadataCids.length; index++) {
      const metadataUrl = metadataCids[index];
      try {
        if (zctImages.value[index].isDup) {
          continue;
        }
        const res = await axios.get(`${ipfsGateway}${metadataUrl}`);
        const url = res.data.image.replace(/ipfs:\/\//g, `${ipfsGateway}`);
        zctImages.value[index].url = url;
        const idx = index;
        addImageProcess(zctImages.value[idx].url).then(() => {
          zctImages.value[idx].isLoaded = true;
        });
      } catch (error) {
        console.error(error);
      }
    }
    ImgCross;
  } else {
    alert(`Cannot find Token ID #${tokenId.value}`);
  }
};

function addImageProcess(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img.height);
    img.onerror = reject;
    img.src = src;
  });
}

function getDefaultZcts() {
  return new Array(4).fill(0).map(() => ({
    url: ImgZctBlind,
    isLoaded: true,
    isDup: false,
  }));
}
</script>

<style lang="scss">
    @import "~@/scss/reset.scss";
    @import '~@/scss/global-animation.scss';
    @import "@/scss/global.scss";
    @import '@/scss/global-rwd.scss';

    html, body, .app {
        overflow: hidden;
        padding: 0;
        margin: 0;
        .rectext,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            // font-family: "BlackOpsOne", Roboto, "Browallia New", sans-serif;
        }

    }
    .app {
      display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
        .section-studio {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 95vw;
          height: 95vh;
          overflow: hidden;
            position: relative;
        }
    }

    .zombie-box {
        max-width: 600px;
        max-height: 600px;
        display: flex;
        flex-wrap:wrap;
        .img-item {
            position: relative;
            width: 50%;
            height: 50%;
            flex: 1 1 50%;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .control-box {
        display: flex;
        justify-content: center;
        // align-items: center;
        margin: .5rem auto;
        label {
            line-height: 2rem;
        }
        .btn-zombie {
            cursor: pointer;
            justify-content: center;
            align-items: center;
            border: 6px solid #c9fa40;
            border-radius: 15px;
            background-color: #66f25f;
            background-image: url('~@/assets/images/btn-zombie.png');
            background-position: 50% 50%;
            background-size: 100% 200%;
            background-repeat: no-repeat;
            color: #000;
            letter-spacing: .14em;
            text-transform: uppercase;
        }
        .input-zombie {
            width: 150px;
            font-size: 1.3rem;
            border-radius: 5px;
            text-align: center;
        }

    }
    .detail-box {
      display: flex;
      flex-direction: column;
      text-align: center;
    }

    .copyright, .copyright a {
      color: rgba(255, 255, 255, 0.3);
    }
</style>
