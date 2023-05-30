<template>
  <div class="container py-8">
    <div class="relative">
      <div class="inline-block relative main-title text-blue-500 text-shadow cursor-pointer" @click="getBack">
        {{ title }}
      </div>
      <div class="main-subtitle text-slate-400 relative pt-3">
        {{ description }}
      </div>
      <the-links class="absolute top-1 right-0 hidden sm:flex" />
    </div>
  </div>
</template>

<script setup>
import TheLinks from './TheLinks.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  title: {
    type: String,
    default: 'AI Search Engine'
  },
  description: {
    type: String,
    default: ''
  }
});

function getBack() {
  router.push('/');
}
</script>
