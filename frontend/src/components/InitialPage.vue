<template>
  <p class="pt-4 text-sm text-gray-600">
    This is a semantic search engine for the lectures "The Making of Modern Ukraine" by Prof. Tim Snyder.
  </p>

  <p class="mt-4 text-gray-400 text-sm">
    Unlike typical search engines (like Google), here you can ask questions in free form and get answers based off Prof. Snyder's work.
    The question is parsed by an AI engine, and the snippets of classes where the lecturer might be talking
    about the subject similar to or related to the original question are retrieved.
  </p>

  <p class="mt-4 text-gray-400 text-sm">
    The collection of semantically related snippets of wisdom is then summarized using GPT, a large AI language model.
  </p>

  <p class="mt-10 text-gray-400 text-sm">
    Try these:

    <ul class="mt-4 mb-10 text-gray-400 text-sm">
      <li class="pl-8 mb-2 cursor-pointer underline decoration-dashed" @click="emitMyself">Where do nations come from?</li>
      <li class="pl-8 mb-2 cursor-pointer underline decoration-dashed" @click="emitMyself">Is Ukraine population mostly jewish?</li>
      <li class="pl-8 mb-2 cursor-pointer underline decoration-dashed" @click="emitMyself">Is Crimea truly Ukraine?</li>
    </ul>
  </p>
</template>

<script setup>
const emit = defineEmits([ 'search' ]);

function emitMyself(e) {
  emit('search', e.target.innerText);
}
</script>
