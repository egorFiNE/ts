<template>
  <the-background />
  <div class="flex flex-col min-h-screen text-gray-700">
    <div class="shrink-0">
      <the-title :title="title" :description="description" />
    </div>

    <div class="grow">
      <router-view :key="bounce" @reset="bounce = !bounce" />
    </div>

    <div class="shrink-0">
      <the-footer />
    </div>
  </div>
</template>

<script setup>
import TheFooter from './components/TheFooter.vue';
import TheTitle from './components/TheTitle.vue';
import TheBackground from './components/TheBackground.vue';
import { shallowRef, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { libraries } from './useLibraries';

const route = useRoute();

const bounce = shallowRef(false);
const title = shallowRef('AI semantic search engine');
const description = shallowRef('');

watchEffect(() => {
  if ([ 'documentPage', 'documentSharePage' ].includes(route.name)) {
    const library = libraries.value.find(lib => lib.slug === route.params.section);

    if (library) {
      title.value = library.title;
      description.value = library.description;
      return;
    }
  }

  title.value = 'AI semantic search engine';
  description.value = '';
});
</script>
