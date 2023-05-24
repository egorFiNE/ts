<template>
  <canvas ref="canvas" class="fixed -z-10 h-screen w-screen opacity-10" />
</template>

<script setup>
import { ref, onMounted } from "vue";

const canvas = ref(null);

onMounted(() => {
  const ctx = canvas.value.getContext("2d");

  const numCircles = 10;

  const colors = [ "rgba(0, 20, 255, 0.9)", "rgba(255, 215, 0, 0.5)" ];

  // Draw random circles
  for (let i = 0; i < numCircles; i++) {
    const x = Math.round(Math.random() * canvas.value.width);
    const y = Math.round(Math.random() * canvas.value.height);
    const radius = Math.round(Math.random() * 50 + 10); // Random radius between 10 and 60
    const blur = Math.round(Math.random() * 20 + 10); // Random blur between
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.round(2 * Math.PI));
    ctx.fillStyle = i < numCircles / 2 ? colors[0] : colors[1];
    ctx.filter = `blur(${blur}px)`;
    ctx.fill();
  }
});
</script>
