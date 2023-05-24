<template>
  <p class="mt-10 text-sm">
    Click to try these:

    <ul class="mt-4 mb-8">
      <li class="pl-8 mb-2 cursor-pointer underline decoration-dashed" @click="emitMyself">
        What is the origin of the Ukrainian state?
      </li>
      <li class="pl-8 mb-2 cursor-pointer underline decoration-dashed" @click="emitMyself">
        Is Crimea originally a part of Ukraine?
      </li>
      <li class="pl-8 mb-2 cursor-pointer underline decoration-dashed" @click="emitMyself">
        Where do nations come from?
      </li>
    </ul>
  </p>

  <p class="mt-4 text-sm">
    We use AI to search and extract relevant information from prof.&nbsp;Snyder's lectures.
  </p>

  <p class="mt-4 text-sm">
    Asking questions in free form, like you would ask a human, will get better answers.
  </p>
</template>

<script setup>
const emit = defineEmits([ 'search' ]);

function emitMyself(e) {
  emit('search', e.target.innerText);
}
</script>
