<template>
  <div class="container text-sm">
    <p class="pt-4">
      This is an AI semantic search engine for the lectures "The Making of Modern Ukraine" by Prof. Tim Snyder.
    </p>

    <p class="mt-6">
      Unlike typical search engines (like Google), here you can ask questions in free form and get answers based off Prof. Snyder's work.
      The question is parsed by an AI engine, and the snippets of classes where the lecturer might be talking
      about the subject similar to or related to the original question are retrieved.
    </p>

    <p class="mt-6">
      The collection of semantically related snippets of wisdom is then summarized using GPT, a large AI language model.
    </p>

    <Disclosure as="div" class="border rounded mt-6 bg-white/70 px-8 py-6" v-slot="{ open }">
      <DisclosureButton class="flex w-full items-center text-left">
        <span class="font-semibold leading-7">
          <span class="inline-block w-5 text-xs text-slate-300">
            {{ open ? '▼' : '►'  }}
          </span>
          In order to make the lectures searchable, we had to change some minor details of the transcriptions:
        </span>
      </DisclosureButton>

      <DisclosurePanel>
        <ul class="my-6 space-y-3 text-slate-300 text-xs font-light list-disc ml-4" role="list">
          <li class="pl-2"><span class="text-gray-700">For geographical places, we have used the official English spellings as transliterated from the Ukrainian language, i.e. “Chernihiv”, not “Chernigov”;</span></li>
          <li class="pl-2"><span class="text-gray-700">Except for “Odessa,” which we spelled here with double s, as in the Russian language;</span></li>
          <li class="pl-2"><span class="text-gray-700">Moscow is often mentioned as “Muscovy”, which is a valid toponym in itself;</span></li>
          <li class="pl-2">
            <span class="text-gray-700">
              We have tried to keep important spelling details like “Kiev” vs “Kyiv” in the lectures where Prof. Snyder discusses the spelling of the Ukraine's
              capital and “Vladimir” vs “Volodymyr” when discussing the names of significant historical figures, including modern presidents of the two countries;
            </span>
          </li>
          <li class="pl-2"><span class="text-gray-700">We have used the commonly recognized spelling for geographically-related names, i.e. “Kievan Rus” and “Anne de Kiev”;</span></li>
          <li class="pl-2"><span class="text-gray-700">Some of the people's names were changed to their basic form in order to be searchable. For example, Prof. Snyder says “Zygmunt”, but we had to convert those mentions to “Sigismund”;</span></li>
          <li class="pl-2"><span class="text-gray-700">The beginnings and ends of the lectures containing discussions unrelated to the topic, such as greetings and students' matters, were removed from the index;</span></li>
          <li class="pl-2"><span class="text-gray-700">Some of the mispronunciations that were immediately corrected by the lecturer were shortened into the corrected version, with the repetition removed from the index.</span></li>
        </ul>

        <p class="text-xs">
          Otherwise the lectures' transcripts are used verbatim. No other changes were made.
        </p>
      </DisclosurePanel>
    </Disclosure>

    <p class="mt-6">
      This technology showcase software is created by
      <a class="underline" href="https://egorfine.com/en/">Egor Egorov</a>,
      <a class="underline" href="https://github.com/insky">Roman Zhbadynskyi</a> and
      <a class="underline" href="https://www.linkedin.com/in/shimalsky/">Eugene Shimalsky</a>
      in Kiev, Ukraine.
    </p>

    <div class="relative bg-white border rounded-lg overflow-hidden mb-20 mt-16">
      <div class="relative h-80 overflow-hidden bg-indigo-600 lg:absolute lg:left-0 lg:h-full lg:w-1/2">
        <img class="h-full w-full object-cover" src="/mriya.jpg" alt="" />
      </div>

      <div class="relative mx-auto max-w-7xl py-24 sm:py-22 lg:px-8 lg:py-20">
        <div class="pl-6 pr-6 lg:ml-auto lg:w-1/2 lg:pl-20 lg:pr-0 xl:pl-24">
          <h2 class="text-base font-semibold leading-7 text-cyan-600">AI search engine</h2>
          <p class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Need one for your data?</p>
          <p class="mt-6 text-base leading-7 text-gray-600">
            This is a showcase technology product. We are a team of developers and we can create a custom solution for your semantic search requirements based on your texts.
          </p>
          <div class="mt-8">
            <a href="mailto:me@egorfine.com?subject=ts" class="inline-flex rounded-md bg-cyan-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Drop us an email</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@headlessui/vue'
</script>
