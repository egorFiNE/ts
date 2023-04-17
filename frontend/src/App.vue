<template>
  <background />
  <div class="flex flex-col min-h-screen">
    <div class="shrink-0">
      <the-title />
    </div>

    <div class="grow">
      <router-view />
    </div>

    <div class="shrink-0 border-t">
      <the-footer />
    </div>
  </div>
</template>

<script setup>
import TheFooter from './components/TheFooter.vue';
import TheTitle from './components/TheTitle.vue';
import Background from './components/Background.vue';
</script>
