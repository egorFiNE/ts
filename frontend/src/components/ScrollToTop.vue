<template>
  <transition name="fade">
    <a v-if="isButtonVisible" href="#" class="fixed bottom-5 right-5 rounded-full shadow text-blue-500" @click.prevent="toTop">
      <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.9997 10.8284L7.04996 15.7782L5.63574 14.364L11.9997 8L18.3637 14.364L16.9495 15.7782L11.9997 10.8284Z" fill="currentColor"></path></svg>
    </a>
  </transition>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue';

onMounted(() => {
  document.querySelector('body').addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  document.querySelector('body').removeEventListener('scroll', handleScroll);
});

let scTimer = null;

const isButtonVisible = ref(false);

function handleScroll() {
  if (scTimer) {
    return;
  }
  scTimer = setTimeout(() => {
    isButtonVisible.value = document.querySelector('body').scrollTop > 300;
    clearTimeout(scTimer);
    scTimer = null;
  }, 100);
}

function toTop() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}
</script>
