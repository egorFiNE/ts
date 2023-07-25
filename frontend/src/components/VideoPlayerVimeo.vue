<template>
  <div ref="playerContainer" class="w-full h-full">
    <vue-vimeo-player
      v-if="videoId && width && height"
      ref="playerVimeo"
      :key="videoId"
      :video-id="videoId"
      :player-width="toInt(width)"
      :player-height="toInt(height)"
      @ready="onPlayerReady"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { vueVimeoPlayer } from 'vue-vimeo-player';
import { useElementSize } from '@vueuse/core';

const playerContainer = ref(null);
const playerVimeo = ref(null);
const interval = ref(null);
const onPlayerReady = ref(() => {});

const { width, height } = useElementSize(playerContainer);

defineProps({
  videoId: {
    type: String,
    default: null
  }
});

defineExpose({
  play,
  close
});

onBeforeUnmount(cleanup);

function cleanup() {
  clearInterval(interval.value);
  interval.value = null;
}

function play(item) {
  onPlayerReady.value = async player => {
    let realStart = Math.floor(item.start / 1000) - 2;
    if (realStart < 0) {
      realStart = 0;
    }
    const realEnd = Math.ceil(item.end / 1000) + 2;

    await player.setCurrentTime(realStart, true);
    playerVimeo.value.play();

    interval.value = setInterval(async () => {
      if (typeof player?.getCurrentTime !== 'function') {
        return;
      }

      const currentTime = await player.getCurrentTime();

      if (currentTime < realEnd) {
        return;
      }

      clearInterval(interval.value);

      playerVimeo.value.pause();
    }, 100);
  };
}

function close() {
  clearInterval(interval.value);
  playerVimeo.value.pause();
}

function toInt(val) {
  return parseInt(val, 10);
}
</script>
