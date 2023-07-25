<template>
  <VueYtframe
    ref="playerYT"
    :key="videoId"
    :video-id="videoId"
    width="100%"
    :player-vars="{ autoplay: 0, listType: 'user_uploads' }"
    @ready="onPlayerReady"
  />
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

const playerYT = ref(null);
const onPlayerReady = ref(() => {});
const interval = ref(null);

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

  onPlayerReady.value = () => {
    const realStart = Math.floor(item.start / 1000) - 2; // headstart
    const realEnd = Math.ceil(item.end / 1000) + 2; // headstart

    playerYT.value.seekTo(realStart, true);
    playerYT.value.playVideo();

    interval.value = setInterval(() => {
      if (typeof playerYT.value?.getCurrentTime !== 'function') {
        return;
      }

      if (playerYT.value.getCurrentTime() < realEnd) {
        return;
      }

      clearInterval(interval.value);

      playerYT.value.pauseVideo();
    }, 100);
  };
}

function close() {
  clearInterval(interval.value);
  playerYT.value.stopVideo();
}
</script>
