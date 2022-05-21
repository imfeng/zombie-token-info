<template>
    <div
        translate="no"
        class="app"
        v-bind:class="[isMobile ? 'mobile' : 'desktop']"
    >
        <div ref="sectionStudio" class="section-studio">
          <header>
            <p class="zombie-title">ZombieClub</p>
            <p class="zombie-title-sub">非官方網站，資訊僅供參考</p>
            <p class="zombie-title-sub">Unofficial website, information is for reference only</p>
          </header>
            <div class="zombie-box">
                <div
                    class="img-item"
                    v-for="(item, idx) in zctImages"
                    v-bind:key="idx"
                    v-bind:style="imageItemStyle"
                >
                    <Loading v-bind:isShow="!item.isLoaded"></Loading>
                    <img
                        v-if="!item.isDup"
                        v-bind:alt="`#${idx}`"
                        v-bind:src="item.url"
                    >
                    <div v-else class="no-image" >
                      <p>NO IMAGE</p>
                    </div>
                </div>
            </div>
            <div class="control-box">
                <label for="">ZOMBIE ID：</label>
                <input
                    v-model="revealId"
                    class="input-zombie"
                    type="number"
                >
                <button v-on:click="submitRevealId" class="btn-zombie">
                    SUBMIT
                </button>
            </div>
            <p>or</p>
            <div class="control-box">
                <label for="">TOKEN ID：</label>
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
                <p>updated time: {{updatedTime}} </p>
                <template
                    v-for="(url, idx) in zctMetadata"
                    v-bind:key="idx"
                >
                    <a
                        target="_blank"
                        v-if="url"
                        v-bind:href="url"
                    >Metadata #{{ idx }}</a>
                </template>
            </div>
        </div>
        <div class="copyright">
            <a target="_blank" href="https://etherscan.io/address/0xdE6bd783d0068bBf9011c50615F139FAf5acAA85">If you like this please donate: 0xdE6bd783d0068bBf9011c50615F139FAf5acAA85</a>
            <br />
            <a target="_blank" class="pluto" href="https://discord.gg/VR5QtajJ">Made by Pluto Lab</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
import ImgBlack from '@/assets/images/square-black.png';
import ImgCross from '@/assets/images/square-cross.png';
import ImgZctBlind from '@/assets/images/zombie-blind.png';
import reveal2Token from '@/assets/reveal-to-token.json';
import zombieMap from '@/assets/zombie-map.json';
import Loading from '@/components/Loading.vue';
import { GlobalStore } from '@/store/GlobalStore';
type ImageType = {
    url: string;
    isLoaded: boolean;
    isDup: boolean;
}

const ipfsGateway = 'https://opensea.mypinata.cloud/ipfs/';
const { isMobile, screenSize } = GlobalStore;
const updatedTime = computed(() => new Date(zombieMap.updated_time).toLocaleString());
const sectionStudio = ref<HTMLDivElement | null>(null);
const zctImages = ref<ImageType[]>(getDefaultZcts());
const zctMetadata = ref([]);
const tokenId = ref(1);
const revealId = ref(0);
const r2t: { [k: string]: string} = reveal2Token;
const token2Reveal = Object.entries(r2t).reduce((acc, item) => {
  acc[item[1]] = Number(item[0]);
  return acc;
}, {} as { [k: string]: number});
onMounted(() => {
  resizeImgSquare();
  window.addEventListener('resize', resizeImgSquare);
});
onUnmounted(() => {
  window.removeEventListener('resize', resizeImgSquare);
});
const submit = async() => {
  if (zombieMap[tokenId.value]) {
    revealId.value = token2Reveal[tokenId.value];
    const metadataCids = zombieMap[tokenId.value];
    zctMetadata.value = metadataCids.map((r: string) => r ? `${ipfsGateway}${r}` : '');

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
}

const submitRevealId = () => {
  if (reveal2Token[revealId.value]) {
    tokenId.value = reveal2Token[revealId.value];
    submit();
  } else {
    alert(`Cannot find Reveal ID #${revealId.value}`);
  }
}

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
const imgeItemSize = reactive({
  width: 0,
  height: 0,
});
const imageItemStyle = computed(() => {
  const style: any = {};
  if(imgeItemSize.width) {
    style['width'] = `${imgeItemSize.width}px`;
  }
  if(imgeItemSize.height) {
    style['height'] = `${imgeItemSize.height}px`;
  }
  return style;
})
function resizeImgSquare() {
  if(!sectionStudio.value) return;
  const { width } = sectionStudio.value.getBoundingClientRect();
  const len = Math.round(width / 2);
  imgeItemSize.width = len;
  imgeItemSize.height = len;
}
</script>

<style lang="scss">
    @import "~@/scss/reset.scss";
    @import '~@/scss/global-animation.scss';
    @import "@/scss/global.scss";
    @import '@/scss/global-rwd.scss';

    html, body, .app {
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
        width: 100vw;
        min-height: 100vh;
        .section-studio {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-bottom: 3rem;
          width: 100%;
          max-width: 640px;
          position: relative;
        }
    }
    header {
      margin: 1rem;
      text-align: center;
      .zombie-title {
        font-family: 'Creepster', sans-serif;
        color: #afff10;
        font-size: 2rem;
      }

    }
    .zombie-box {
        display: flex;
        flex-wrap:wrap;
        justify-content: center;
        margin: 1rem auto;
        .img-item {
          max-width: 230px;
          max-height: 230px;
            position: relative;
            flex: 1 1 50%;
            img, .no-image {
            
                width: 100%;
                height: 100%;
            }

            .no-image {
              display: flex;
              justify-content: center;
              align-items: center;
              color: rgba(255,255,255, 0.3);
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
            border: 3px solid #c9fa40;
            border-radius: 15px;
            background-color: #66f25f;
            background-image: url('~@/assets/images/btn-zombie.png');
            background-position: 50% 50%;
            background-size: 100% 200%;
            background-repeat: no-repeat;
            color: #000;
            letter-spacing: .14rem;
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

    .copyright {
      text-align: center;
      padding: 1rem;
      a {
        color: rgba(255, 255, 255, 0.3);
      }
      .pluto {
        color: rgba(255, 255, 255, 0.3);
      }
    }
</style>
