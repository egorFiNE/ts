<template>
  <div class="container text-sm">
    <p class="pt-4">
      This is a semantic search engine for the lectures "The Making of Modern Ukraine" by Prof. Tim Snyder.
    </p>

    <p class="mt-4">
      Unlike typical search engines (like Google), here you can ask questions in free form and get answers based off Prof. Snyder's work.
      The question is parsed by an AI engine, and the snippets of classes where the lecturer might be talking
      about the subject similar to or related to the original question are retrieved.
    </p>

    <p class="mt-4">
      The collection of semantically related snippets of wisdom is then summarized using GPT, a large AI language model.
    </p>

    <Disclosure as="div" class="border rounded mt-4 bg-white px-8 py-6" v-slot="{ open }">
      <DisclosureButton class="flex w-full items-center text-left">
        <span class="font-semibold leading-7">
          <span class="inline-block w-5 text-xs text-slate-300">
            {{ open ? '▼' : '►'  }}
          </span>
          In order to make the lectures searchable, we had to change some minor details of the transcriptions
        </span>
      </DisclosureButton>

      <DisclosurePanel as="ul" role="list" class="my-4 space-y-3 text-slate-300 text-xs font-light list-disc ml-4">
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
      </DisclosurePanel>
    </Disclosure>

    <p class="mt-4">
      This is an open source software, so you are most welcome to <a class="underline" href="https://github.com/egorFiNE/ts">fork the code at GitHub</a> or
      <a class="underline" href="https://github.com/egorFiNE/ts/issues">submit issues</a>. Looking for prompt we use to summarize the answer? See <a class="underline pointer" href="https://github.com/egorFiNE/ts/blob/master/lib/Search.mjs#L182"><code>lib/Search.mjs:summarize()</code></a>.
    </p>

    <p class="mt-4">
      This software is created by
      <a class="underline" href="https://egorfine.com/en/">Egor Egorov</a>,
      <a class="underline" href="https://github.com/insky">Roman Zhbadynskyi</a> and
      <a class="underline" href="https://www.linkedin.com/in/shimalsky/">Eugene Shimalsky</a>
      in Kiev, Ukraine.
    </p>

    <p class="mt-4 mb-10">
      Question or comments? Please drop us an email: <a class="underline" href="mailto:me@egorfine.com?subject=ts">me@egorfine.com</a>.
    </p>
  </div>
</template>

<script setup>
  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@headlessui/vue'
</script>
