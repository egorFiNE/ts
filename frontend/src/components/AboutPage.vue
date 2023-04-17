<template>
  <div class="container text-gray-600 text-sm">
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

    <figure class="mt-10 mb-10 border-l border-blue-600 pl-0">
      <blockquote class="text-gray-900 pl-9">
        <p class="font-semibold">In order to make the lectures searchable, we had to change some minor details of the transcriptions:</p>
        <p>
          <ol role="list" class="mt-8 max-w-xl space-y-4 text-gray-600">
            <li>For geographical places, we have used the official English spellings as transliterated from the Ukrainian language, i.e. “Chernihiv”, not “Chernigov”;</li>
            <li>Except for “Odessa,” which we spelled here with double s, as in the Russian language;</li>
            <li>Moscow is often mentioned as “Muscovy”, which is a valid toponym in itself;</li>
            <li>
              We have tried to keep important spelling details like “Kiev” vs “Kyiv” in the lectures where Prof. Snyder discusses the spelling of the Ukraine's
              capital and “Vladimir” vs “Volodymyr” when discussing the names of significant historical figures, including modern presidents of the two countries;
            </li>
            <li>We have used the commonly recognized spelling for geographically-related names, i.e. “Kievan Rus” and “Anne de Kiev”;</li>
            <li>Some of the people's names were changed to their basic form in order to be searchable. For example, Prof. Snyder says “Zygmunt”, but we had to convert those mentions to “Sigismund”;</li>
            <li>The beginnings and ends of the lectures containing discussions unrelated to the topic, such as greetings and students' matters, were removed from the index;</li>
            <li>Some of the mispronunciations that were immediately corrected by the lecturer were shortened into the corrected version, with the repetition removed from the index.</li>
          </ol>
        </p>
      </blockquote>
    </figure>

    <p class="mt-4">
      This is an open source software, so you are most welcome to <a class="underline" href="https://github.com/egorFiNE/ts">fork the code at GitHub</a> or <a class="underline" href="https://github.com/egorFiNE/ts/issues">submit issues</a>.
    </p>

    <p class="mt-4">
      This software is created by <a class="underline" href="https://egorfine.com/en/">Egor Egorov</a> and <a class="underline" href="https://github.com/insky">Roman Zhbadynskyi</a> in Kiev, Ukraine.
    </p>

    <p class="mt-4 mb-10">
      Question or comments? Please drop us an email: <a class="underline" href="mailto:me@egorfine.com?subject=ts">me@egorfine.com</a>.
    </p>
  </div>
</template>
