<template>
  <div class="container py-8">
    <div class="relative">
      <div class="inline-block relative main-title text-yellow-400 text-shadow cursor-pointer" @click="getBack">
        The Making of Modern Ukraine
        <div class="absolute top-0 inset-y-0 overflow-hidden text-blue-500">The Making of Modern Ukraine</div>
      </div>
      <div class="main-subtitle text-slate-400 relative pt-3">
        A semantic search engine on Prof. Tim Snyder's lectures at Yale.
      </div>
      <the-links class="absolute top-1 right-0 hidden sm:flex"/>
    </div>
  </div>
</template>

<script setup>
import TheLinks from './TheLinks.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits(['reset']);

function getBack() {
  emit('reset');
  router.push('/');
}
</script>
