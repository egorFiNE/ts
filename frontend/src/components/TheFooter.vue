<template>
  <div v-if="isDisclaimerVisible && $route.path == '/'" class="container pt-4 pb-2 text-slate-400 text-xs">
    Disclaimer: transcripts of lectures are used verbatim.
    <router-link to="/about" class="cursor-pointer underline decoration-dashed">
      Read more.
    </router-link>
  </div>

  <footer class="border-t text-slate-400">
    <div class="container py-8 md:flex md:items-center md:justify-between">
      <div class="flex justify-center space-x-6 md:order-2 text-xs">
        <router-link to="/about" class="hover:text-slate-500">
          About
        </router-link>
        <a href="mailto:me@egorfine.com" class="hover:text-slate-500">
          Contact us
        </a>
        <a href="https://github.com/egorFiNE/ts" class="hover:text-slate-500">
          GitHub
        </a>
      </div>
      <div class="mt-8 md:order-1 md:mt-0">
        <p class="text-center text-xs leading-5">
          <!--
          <span>&copy; 2023</span>
          <span class="mx-5 border-slate-300 border-l" />
          -->

          Made in <span class="text-lg mx-1 relative top-[2px]" style="opacity: 0.6">🇺🇦</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { isDisclaimerVisible } from '../useDisclaimer';
</script>
