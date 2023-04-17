<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-3xl sm:p-6">
              <div class="w-full aspect-video">
                <VueYtframe
                  ref="player"
                  :video-id="videoId"
                  :key="videoId"
                  width="100%"
                  :player-vars="{ autoplay: 0, listType: 'user_uploads' }"
                  @ready="onPlayerReady"
                />
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
                <button @click="close" type="button" class="text-sm inline-flex flex-nowrap items-center rounded-md border-0 py-1.5 pl-3 pr-5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 bg-slate-200 hover:bg-slate-300">
                  <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z" fill="currentColor"></path></svg>
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
import { shallowRef, ref, onBeforeUnmount } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';

const open = shallowRef(false);
const videoId = shallowRef(null);
const text = shallowRef(null);
const title = shallowRef(null);
const timing = shallowRef(null);

const interval = ref(null);
const player = ref(null);
const onPlayerReady = ref(() => {});

defineExpose({
  play
});

onBeforeUnmount(cleanup);

function cleanup() {
  clearInterval(interval.value);
  interval.value = null;
}

function play(item) {
  console.log(item)
  videoId.value = item.videoId;
  text.value = item.text;
  title.value = `Class ${item.lecture}`;
  timing.value = `${formatMilliseconds(item.start)}-${ formatMilliseconds(item.end)}`;
  open.value = true;

  onPlayerReady.value = () => {
    const realStart = Math.floor(item.start/1000) - 2; // headstart
    const realEnd = Math.ceil(item.end/1000) + 2; // headstart

    player.value.seekTo(realStart, true);
    player.value.playVideo();

    interval.value = setInterval(() => {
      if (typeof player.value?.getCurrentTime !== 'function') {
        return;
      }

      if (player.value.getCurrentTime() < realEnd) {
        return;
      }

      clearInterval(interval.value);

      player.value.pauseVideo();
    }, 100);
  };
}

function close() {
  clearInterval(interval.value);

  player.value.pauseVideo();
  open.value = false;
  videoId.value = null;
  text.value = null;
  title.value = null;
  timing.value = null;
}

function formatMilliseconds(ms) {
  const d1 = new Date();
  const msShift = d1.getTimezoneOffset() * 60 * 1000;
  const d = new Date(0);
  d.setUTCMilliseconds(ms + msShift);

  const hoursLine = d.getHours() > 0 ? (d.getHours() + 'h') : '';

  return hoursLine + String(d.getMinutes()) + 'm' + String(d.getSeconds()) + 's';
}
</script>
