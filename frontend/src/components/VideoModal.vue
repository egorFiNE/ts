<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-3xl sm:p-6">
              <div class="w-full aspect-video">
                <component :is="videoId ? videoPlayerComponent : 'div'" ref="player" :video-id="videoId" />
              </div>
              <div class="text-xs py-4">
                <div class="text-xl font-medium text-slate-600 mb-2">
                  {{ title }}
                  <span class="mx-2 border-slate-300 border-l" />
                  {{ timing }}
                </div>
                {{ text }}
              </div>
              <div class="text-right">
                <button type="button" class="text-sm inline-flex flex-nowrap items-center rounded-md border-0 py-1.5 pl-3 pr-5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 bg-slate-200 hover:bg-slate-300" @click="close">
                  <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z" fill="currentColor" /></svg>
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { shallowRef, ref, watch } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
// import VideoPlayerYoutube from './VideoPlayerYoutube.vue';
import VideoPlayerVimeo from './VideoPlayerVimeo.vue';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);

const videoPlayerComponent = VideoPlayerVimeo;

const open = shallowRef(false);
const text = shallowRef(null);
const title = shallowRef(null);
const timing = shallowRef(null);
const videoId = shallowRef(null);

const player = ref(null);

defineExpose({
  play
});

function formatMilliseconds(ms) {
  return dayjs.duration(ms).format('HH:mm:ss');
}

function play(item) {
  text.value = item.text;
  title.value = `Class ${item.videoId}`;
  timing.value = `${formatMilliseconds(item.start)}-${formatMilliseconds(item.end)}`;
  videoId.value = item.videoId;
  open.value = true;

  const unwatch = watch(player, value => {
    if (value) {
      unwatch();
      value.play(item);
    }
  });
}

function close() {
  player.value.close();
  open.value = false;
  videoId.value = null;
  text.value = null;
  title.value = null;
  timing.value = null;
}
</script>
