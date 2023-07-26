<template>
  <div class="py-6 flex gap-x-4">
    <img
      class="h-14 w-14 object-cover object-center rounded-full hover:scale-105 transition-transform cursor-pointer"
      :src="'https://img.youtube.com/vi/' + item.videoId + '/0.jpg'"
      :alt="'Class ' + item.lecture"
      @click="play"
    >
    <div>
      <div class="text-gray-400 whitespace-nowrap text-xs mb-1" @click="play">
        <a class="hover:text-slate-800 cursor-pointer">
          Play
          <svg class="inline-block w-4 h-4 align-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.3944 11.9998L10 7.73686V16.2628L16.3944 11.9998ZM19.376 12.4158L8.77735 19.4816C8.54759 19.6348 8.23715 19.5727 8.08397 19.3429C8.02922 19.2608 8 19.1643 8 19.0656V4.93408C8 4.65794 8.22386 4.43408 8.5 4.43408C8.59871 4.43408 8.69522 4.4633 8.77735 4.51806L19.376 11.5838C19.6057 11.737 19.6678 12.0474 19.5146 12.2772C19.478 12.3321 19.4309 12.3792 19.376 12.4158Z" fill="currentColor" /></svg>
        </a>
        <span class="mx-2 border-slate-300 border-l" />
        Class {{ item.lecture }}
        <span class="mx-2 border-slate-300 border-l" />
        {{ formatMilliseconds(item.start) }}-{{ formatMilliseconds(item.end) }}
      </div>
      <p class="text-gray-500 text-sm">
        {{ item.text }}
      </p>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);

defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits([ 'play' ]);

function formatMilliseconds(ms) {
  return dayjs.duration(ms).format('HH:mm:ss');
}

function play() {
  emit('play');
}
</script>
