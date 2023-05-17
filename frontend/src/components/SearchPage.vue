<template>
  <div class="container">
    <transition-grow>
      <div v-if="!models" class="py-8 h-100 text-gray-500">
        <spinner class="mr-2" />
        Loading models...
      </div>

      <div v-else>
        <form @submit.prevent="doSearch">
          <label for="search" class="sr-only">Search</label>
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center ml-3 mr-1 z-10" :class="search ? 'cursor-pointer' : 'pointer-events-none'" @click="reset">
              <div class="w-4 h-4 relative">
                <svg class="absolute inset-0 text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-opacity" :class="search ? 'opacity-100' : 'opacity-0'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z" fill="currentColor"></path></svg>
                <svg class="absolute inset-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-opacity" :class="search ? 'opacity-0' : 'opacity-100'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" fill="currentColor"></path></svg>
              </div>
            </div>
            <input v-model="search" type="text" id="search" :disabled="isLoading || isErrorState" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 p-2.5 pr-32 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ask something…" autocomplete="off" required>
            <div class="absolute inset-y-1 right-1 flex items-center border-l mr-[-1px]">
              <button type="button" :disabled="isLoading || isErrorState" class="px-3" @click="isAdvancedVisible = !isAdvancedVisible">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.32894 3.27158C6.56203 2.8332 7.99181 3.10749 8.97878 4.09446C9.96603 5.08171 10.2402 6.51202 9.80129 7.74535L20.646 18.5902L18.5247 20.7115L7.67887 9.86709C6.44578 10.3055 5.016 10.0312 4.02903 9.04421C3.04178 8.05696 2.76761 6.62665 3.20652 5.39332L5.44325 7.63C6.02903 8.21578 6.97878 8.21578 7.56457 7.63C8.15035 7.04421 8.15035 6.09446 7.56457 5.50868L5.32894 3.27158ZM15.6963 5.15512L18.8783 3.38736L20.2925 4.80157L18.5247 7.98355L16.757 8.3371L14.6356 10.4584L13.2214 9.04421L15.3427 6.92289L15.6963 5.15512ZM8.62523 12.9333L10.7465 15.0546L5.7968 20.0044C5.21101 20.5902 4.26127 20.5902 3.67548 20.0044C3.12415 19.453 3.09172 18.5793 3.57819 17.99L3.67548 17.883L8.62523 12.9333Z" fill="currentColor"></path></svg>
              </button>
              <button type="submit" :disabled="isErrorState || !search || isLoading " class="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
          </div>
          <div v-if="isErrorState" class="relative w-full text-sm text-red-400 pt-2">
            There was an error loading configuration, so search is temporarily unavailable. Please try again later.
          </div>

          <transition-grow>
            <div v-if="isAmbiguousQuery" class="mt-2 text-orange-700 font-light relative pl-6">
              <div class="absolute top-0 -left-0">👆</div>
              <span class="text-sm">
                Unlike Google, this search engine works better by asking actual questions in free form. Please end your question with &laquo;?&raquo; or click again on Search button to continue.
              </span>
            </div>
          </transition-grow>
        </form>

        <transition-grow>
          <div v-if="isAdvancedVisible" class="grid grid-cols-6 gap-x-6">
            <div class="mt-2 col-span-6 sm:col-span-3">
              <label for="modelName" class="block text-xs leading-5 text-gray-400 mr-3">Embeddings model</label>
              <select v-model="modelName" id="modelName" class="block w-full text-xs rounded-md border-0 py-1.5 pl-2 pr-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                <option v-for="model in models" :key="model" :value="model">{{ model }}</option>
              </select>
            </div>
            <div class="mt-2 col-span-6 sm:col-span-3">
              <label for="summaryModelName" class="block text-xs leading-5 text-gray-400 mr-3">Summary model</label>
              <select v-model="summaryModelName" id="summaryModelName" class="block w-full text-xs rounded-md border-0 py-1.5 pl-2 pr-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                <option v-for="model in summaryModels" :key="model" :value="model">{{ model }}</option>
              </select>
            </div>
          </div>
        </transition-grow>

        <transition-grow>
          <div v-if="!isLoading && isInitialState" class="mt-10">
            <initial-page @search="searchByExample" />
          </div>
        </transition-grow>

        <transition-grow>
          <div v-if="isLoading" class="my-6 text-gray-400">
            <spinner class="mr-2" />
            Loading...
          </div>
        </transition-grow>

        <transition-grow>
          <div v-if="!isLoading && prevSearch">
            <div class="my-6 flex items-center">
              <h2 class="text-xl font-medium text-slate-600 grow">{{ prevSearch }}</h2>

              <!-- <div class="text-gray-400 grow text-sm">
                <span class="mr-2">Showing results for:</span>
                <span class="font-bold">{{ prevSearch }}</span>
              </div> -->

              <div class="shrink-0 ml-2">
                <div v-if="shareUrl">
                  <copy-to-clipboard :text="shareUrl" />
                </div>
                <button v-else @click="share" :disabled="!isShareButtonEnabled" type="button" class="text-sm flex flex-nowrap items-center rounded-md border-0 py-1.5 pl-3 pr-5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 bg-slate-200 hover:bg-slate-300">
                  <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.1202 17.0228L8.92129 14.7324C8.19135 15.5125 7.15261 16 6 16C3.79086 16 2 14.2091 2 12C2 9.79086 3.79086 8 6 8C7.15255 8 8.19125 8.48746 8.92118 9.26746L13.1202 6.97713C13.0417 6.66441 13 6.33707 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6C21 8.20914 19.2091 10 17 10C15.8474 10 14.8087 9.51251 14.0787 8.73246L9.87977 11.0228C9.9583 11.3355 10 11.6629 10 12C10 12.3371 9.95831 12.6644 9.87981 12.9771L14.0788 15.2675C14.8087 14.4875 15.8474 14 17 14C19.2091 14 21 15.7909 21 18C21 20.2091 19.2091 22 17 22C14.7909 22 13 20.2091 13 18C13 17.6629 13.0417 17.3355 13.1202 17.0228ZM6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14ZM17 8C18.1046 8 19 7.10457 19 6C19 4.89543 18.1046 4 17 4C15.8954 4 15 4.89543 15 6C15 7.10457 15.8954 8 17 8ZM17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z" fill="currentColor"></path></svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </transition-grow>

        <transition-grow>
          <div v-if="!isLoading && id" class="my-4 h-max min-h-[100px] relative">
            <transition-fade>
              <div v-if="summary" class="text-sm mb-6">
                {{ summary }}

                <p class="mt-4 text-slate-400 text-xs">
                  The above answer is automatically summarized by AI model based on the transcripts as presented below and is not the author's direct speech.
                </p>
              </div>

              <div v-else role="status" class="animate-pulse absolute inset-0">
                <div class="h-2.5 bg-gray-200 rounded-sm dark:bg-gray-700 w-1/3 mb-4"></div>
                <div class="h-2 bg-gray-200 rounded-sm dark:bg-gray-700 w-4/5 mb-2.5"></div>
                <div class="h-2 bg-gray-200 rounded-sm dark:bg-gray-700 w-3/4 mb-2.5"></div>
                <span class="sr-only">Loading...</span>
              </div>
            </transition-fade>
          </div>
        </transition-grow>

        <transition-grow>
          <h2 v-if="!isLoading && prevSearch && results?.length" class="text-xl font-medium text-slate-600 pt-2">Relevant transcripts:</h2>
        </transition-grow>

        <transition-group
          :css="false"
          @beforeEnter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
        >
          <search-item
            v-for="(item, index) in results"
            :key="item.sequences.join('_')"
            :data-index="index"
            :item="item"
            :class="{ '!opacity-70': prevSearch != search }"
            @play="jumpTo(item)"
          />
        </transition-group>

        <transition-grow>
          <div v-if="!isLoading && prevSearch && !results?.length" class="my-10 text-gray-400 italic">
            No relevant information found on the query provided. :-(
          </div>
        </transition-grow>
      </div>
    </transition-grow>
  </div>

  <scroll-to-top />

  <video-modal ref="videoMadal" />

  <alert-modal ref="alertModal" />
</template>

<script setup>
import Spinner from './Spinner.vue';
import InitialPage from './InitialPage.vue';
import TransitionGrow from './TransitionGrow.vue';
import TransitionFade from './TransitionFade.vue';
import ScrollToTop from './ScrollToTop.vue';
import CopyToClipboard from './CopyToClipboard.vue';
import SearchItem from './SearchItem.vue';
import VideoModal from './VideoModal.vue';
import AlertModal from './AlertModal.vue';
import { ref, shallowRef, watch, onMounted } from 'vue';
import { useFetch } from '@vueuse/core';
import gsap from 'gsap';
import { models, isErrorState } from '../useModels';
import { isDisclaimerVisible } from '../useDisclaimer';

const props = defineProps({
  shareId: {
    type: String,
    required: false
  }
});

const emit = defineEmits(['reset']);

const summaryModels = ref([
  'gpt-3.5-turbo',
  'gpt-4'
]);

const isAdvancedVisible = ref(false);

const search = ref('');
const prevSearch = ref('');
const modelName = ref(null);
const summaryModelName = ref(summaryModels.value[0]);
const isInitialState = ref(true);
const shareUrl = ref(null);

watch(isInitialState, value => isDisclaimerVisible.value = value, { immediate: true });

const results = ref([]);
const summary = ref(null);
const id = ref(null);

const videoMadal = ref(null);
const alertModal = ref(null);

const isLoading = shallowRef(false);
const isShareButtonEnabled = shallowRef(false);

// race condition with shared results page
if (!modelName.value) {
  if (models.value.length > 0) {
    modelName.value = models.value[0];
  } else {
    const unwatch = watch(models, (value) => {
      if (value.length > 0) {
        modelName.value = value[0];
        unwatch();
      }
    });
  }
}

async function share() {
  isShareButtonEnabled.value = false;

  const { data } = await useFetch('/api/share/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id.value
    }),
  }).json();

  if (!data.value.success) {
    showAlert("Error on the server side. Please try again later.");
    return;
  }

  const u = new URL(document.location.href);
  u.search = '';
  u.hash = '';
  u.pathname = '/' + data.value.shareId;

  for (const [key, _value] of u.searchParams) {
    u.searchParams.delete(key);
  }

  shareUrl.value = u.toString();
}

const isAmbiguousQuery = shallowRef(false);

async function doSearch() {
  if (!search.value) {
    return;
  }

  const normalizedSearch = (search.value || '').replace(/\s+/, ' ').replaceAll(' ?', '?').trim();
  if (!normalizedSearch.endsWith('?')) {
    if (!isAmbiguousQuery.value) {
      isAmbiguousQuery.value = true;
      return;
    }
  }

  isAmbiguousQuery.value = false;

  isLoading.value = true;

  results.value = [];
  id.value = null;
  summary.value = null;
  shareUrl.value = null;

  try {
    plausible('Search', { props: { query: search.value }});
  } catch(e) {}

  const { data } = await useFetch('/api/search/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modelName: modelName.value,
      summaryModelName: summaryModelName.value,
      query: search.value
    }),
  }).json();

  isLoading.value = false;
  isInitialState.value = false;

  if (!data?.value?.success) {
    showAlert("Something wrong happened on our servers. Please let us know or try again later.");
    return;
  }

  isShareButtonEnabled.value = false;

  if (data.value.isEmpty) {
    results.value = [];
    id.value = null;
    prevSearch.value = search.value;
    return;
  }

  results.value = data.value?.results || [];
  id.value = data.value?.id || null;
  prevSearch.value = search.value;
  getSummary();
}

async function getSummary() {
  if (!id.value) {
    return;
  }

  const { data } = await useFetch('/api/search/' + id.value).json();

  if (!data.value.success) {
    showAlert("Something wrong happened on our servers. Please let us know or try again later.");
    return;
  }

  if (data.value.isProcessing) {
    setTimeout(getSummary, 1000);
    return;
  }

  summary.value = data.value.summary;
  isShareButtonEnabled.value = true;
}

function jumpTo(item) {
  videoMadal.value.play(item);
}

function showAlert(message) {
  alertModal.value.show(message);
}

onMounted(async () => {
  if (!props.shareId) {
    return;
  }

  const { data } = await useFetch('/api/shared/' + props.shareId, {
    method: 'GET'
  }).json();

  if (!data.value.success) {
    return;
  }

  id.value = data.value.id;
  modelName.value = data.value.modelName;
  summary.value = data.value.summary;
  results.value = data.value.results;
  prevSearch.value = data.value.query;
  search.value = data.value.query;

  shareUrl.value = document.location.href;
  isShareButtonEnabled.value = true;

  isInitialState.value = false;
});

function onBeforeEnter(el) {
  el.style.opacity = 0;
  el.style.transform = 'scale(0)';
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    transform: 'scale(1)',
    delay: el.dataset.index < 10 ? el.dataset.index * 0.15 : 10 * 0.15,
    onComplete: done
  });
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    duration: 0.2,
    transform: 'scale(0)',
    onComplete: done
  });
}

function searchByExample(what) {
  if (isErrorState.value) {
    return;
  }
  search.value = what;
  doSearch();
}

function reset() {
  emit('reset');
}
</script>
