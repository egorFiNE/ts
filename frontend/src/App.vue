<template>
  <the-background />
  <div class="flex flex-col min-h-screen text-gray-700">
    <div class="shrink-0">
      <the-title @reset="bounce = !bounce" />
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
import { shallowRef } from 'vue';

const bounce = shallowRef(false);
</script>
