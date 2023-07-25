<template>
  <div class="container py-8">
    <div class="relative">
      <div class="inline-block relative main-titl text-shadow cursor-pointer" @click="getBack">
        Atom
      </div>
      <div class="main-subtitle text-slate-400 relative pt-3">
        AI search on ...
      </div>
      <the-links class="absolute top-1 right-0 hidden sm:flex" />
    </div>
  </div>
</template>

<script setup>
import TheLinks from './TheLinks.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits([ 'reset' ]);

function getBack() {
  emit('reset');
  router.push('/');
}
</script>
