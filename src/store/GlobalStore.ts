import { computed } from 'vue';
import { useScreen } from 'vue-screen';
import { defineStore } from '@/store/store';

const useGlobalStore = defineStore('global', () => {
  const screen = useScreen();
  const screenSize = computed(() => {
    return {
      width: screen.width,
      height: screen.height,
    };
  });
  const isMobile = computed(() => {
    return screen.width <= 860;
  });
  return {
    isMobile,
    screenSize,
  };
});
export const GlobalStore = useGlobalStore();
