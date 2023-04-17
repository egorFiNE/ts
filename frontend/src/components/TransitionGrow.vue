<template>
  <transition
    :css="false"
    @beforeEnter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    mode="out-in"
  >
    <slot />
  </transition>
</template>

<script setup>
import gsap from 'gsap';

function onBeforeEnter(el) {
  el.style.opacity = 0;
  el.style.height = 0;
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: 'auto',
    onComplete: done
  });
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    onComplete: done
  });
}
</script>
