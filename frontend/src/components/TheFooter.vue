<template>
  <footer>
    <div class="container py-8 md:flex md:items-center md:justify-between">
      <div class="flex justify-center space-x-6 md:order-2 text-xs">
        <router-link to="/about" class="text-slate-400 hover:text-slate-500">
          About
        </router-link>
        <a href="mailto:me@egorfine.com" class="text-slate-400 hover:text-slate-500">
          Contact Us
        </a>
        <a href="https://github.com/egorFiNE/ts" class="text-slate-400 hover:text-slate-500">
          GitHub
        </a>
      </div>
      <div class="mt-8 md:order-1 md:mt-0">
        <p class="text-center text-xs leading-5 text-slate-400">
          <span>&copy; 2023</span>

          <span class="mx-5 border-slate-300 border-l" />

          Made in <span class="text-lg mx-1 relative top-[2px]" style="opacity: 0.6">🇺🇦</span>
        </p>
      </div>
    </div>
  </footer>
</template>
