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
  el.style.height = '100px';
}

function onEnter(el, done) {
  gsap.to(el, {
    duration: 0.5,
    opacity: 1,
    height: 'auto',
    onComplete: done
  });
}

function onLeave(el, done) {
  gsap.to(el, {
    duration: 0.5,
    opacity: 0,
    height: '100px',
    onComplete: done
  });
}
</script>
