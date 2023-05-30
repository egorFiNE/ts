<template>
  <div class="container py-18 sm:py-24">
    <div class="mx-auto max-w-7xl">
      <div class="mx-auto max-w-2xl text-center">
        <p class="mt-2 text-lg leading-8 text-gray-600/70">
          Unlike typical search engines (like Google), here you can ask questions in free form and get answers.
          The question is parsed by an AI engine, and the snippets of classes where the lecturer might be talking about the subject
          similar to or related to the original question are retrieved.
        </p>
      </div>
      <div v-if="libraries.length" class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article v-for="library in libraries" :key="library.id" class="relative group flex flex-col items-start justify-between">
          <div class="w-full">
            <img :src="library.coverUrl" alt="" class="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2] saturate-50 group-hover:saturate-100">
          </div>
          <div class="max-w-xl">
            <div class="mt-8 flex items-center gap-x-4 text-xs">
              <time :datetime="library.createdAt" class="text-gray-500/70">{{ formatDate(library.createdAt) }}</time>
            </div>
            <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900/70 group-hover:text-gray-600/70">
              <router-link :to="`/${library.slug}/`" class="stretched-link">
                <span class="absolute inset-0" />
                {{ library.title }}
              </router-link>
            </h3>
            <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600/70 group-hover:text-gray-500/70">
              {{ library.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { libraries } from '../useLibraries';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// const libraries = [
//   {
//     id: 1,
//     title: 'The Making of Modern Ukraine',
//     slug: 'snyder',
//     description: "Proffessor Tim Snyder's lectures at Yale",
//     coverUrl: '/snyder.webp',
//     createdAt: '2023-05-30T17:57:27.443Z
//   },
//   {
//     id: 2,
//     title: 'Ancient Greek Literature',
//     slug: 'greek',
//     description: 'Greek literature, body of writings in the Greek language, with a continuous history extending from the 1st millennium bc to the present day.',
//     coverUrl: '/literature.jpg',
//     createdAt: '2023-05-30T17:57:27.443Z
//   },
//   {
//     id: 3,
//     title: 'Lenin Collected Works',
//     slug: 'lenin',
//     description: 'A complete edition of Lenin’s Collected Works and a fairly extensive literature on Leninism',
//     coverUrl: '/lenin.jpg',
//     createdAt: '2023-05-30T17:57:27.443Z
//   }
// ];
</script>
