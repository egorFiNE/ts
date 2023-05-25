import { init } from '../models/index.mjs';
import axios from 'axios';

async function fillTextsGaps({ library, document, wordCount, modelName, texts, ends, sequences, sequelize }) {
  // TODO rewrite async loop
  for (let i = 0; i < texts.length; i++) {
    if (texts[i]) {
      continue;
    }

    const gapEntry = await sequelize.models.Chunk.findOne({
      where: {
        library,
        document,
        wordCount,
        modelName,
        sequence: sequences[i]
      },
      attributes: [ 'text', 'end' ],
      raw: true
    });

    texts[i] = gapEntry.text;
    ends[i] = gapEntry.end;
  }
}

async function fillSequenceGaps({ searchResults, library, modelName, sequelize }) {
  // TODO rewrite async loop
  for (const entry of searchResults) {
    await fillTextsGaps({ ...entry, library, modelName, sequelize });
  }
}

function joinSequenceGaps({ rawSearchResults, wordCount, document }) {
  const context = rawSearchResults.filter(e => e.wordCount === wordCount && e.document === document);

  context.sort((a, b) => a.sequence - b.sequence);

  for (const entry of context) {
    entry.sequences = [ entry.sequence ];
    entry.texts = [ entry.text ];
    entry.ends = [ entry.end ];
    entry.distances = [ entry.distance ];
  }

  if (context.length <= 1) {
    return context;
  }

  let prevEntry = context[0];

  for (let i = 1; i < context.length; i++) {
    const entry = context[i];

    if (entry.sequence === prevEntry.sequence + 2) {
      prevEntry.ends.push(0);
      prevEntry.texts.push(null);
      prevEntry.distances.push(Number.MAX_SAFE_INTEGER);
      prevEntry.sequences.push(entry.sequence - 1);
      prevEntry.sequence = entry.sequence - 1;
    }

    if (entry.sequence === prevEntry.sequence + 1) {
      prevEntry.texts.push(entry.text);
      prevEntry.sequences.push(entry.sequence);
      prevEntry.distances.push(entry.distance);
      prevEntry.sequence = entry.sequence;
      prevEntry.ends.push(entry.end);

      context[i] = null;
      continue;
    }

    prevEntry = entry;
  }

  return context.filter(a => Boolean(a));
}

function flattenTexts(textArray, overlapWordCount) {
  let text = textArray[0];

  for (let i = 1; i < textArray.length; i++) {
    const words = textArray[i].split(/\s+/);
    text += ' ' + words.slice(overlapWordCount).join(' ');
  }

  return text;
}

function flattenSearchResults({ searchResults, overlapWordCount }) {
  for (const entry of searchResults) {
    entry.end = Math.max.apply(null, entry.ends);
    delete entry.ends;

    entry.text = flattenTexts(entry.texts, overlapWordCount);
    delete entry.texts;

    entry.distance = Math.min.apply(null, entry.distances);
    delete entry.distances;

    delete entry.id;
    delete entry.sequence;
  }
}

async function joinContexts(largeContext, smallContext) {
  for (let i = 0; i < smallContext.length; i++) {
    const smallEntry = smallContext[i];
    if (!smallEntry) {
      continue;
    }

    for (const largeEntry of largeContext) {
      if (!largeEntry) {
        continue;
      }

      // small chunk lies completely within large chunk
      if (largeEntry.start <= smallEntry.start && smallEntry.end <= largeEntry.end) {
        smallContext[i] = null;
      }
    }
  }
}

export async function search(configuration, library, embedding, modelName) {
  const sequelize = await init();

  const limit = 200;
  const rawSearchResults = await sequelize.models.Chunk.search({ library, embedding, modelName, limit });

  const uniqueHashOfDocumentAndWordCount = { };

  for (const entry of rawSearchResults) {
    uniqueHashOfDocumentAndWordCount[entry.document] ||= new Set();
    uniqueHashOfDocumentAndWordCount[entry.document].add(entry.wordCount);
  }

  const overallSearchResults = [];

  for (const document of Object.keys(uniqueHashOfDocumentAndWordCount)) {
    const searchResultsByWordCount = {};

    for (const wordCount of Array.from(uniqueHashOfDocumentAndWordCount[document].values())) {
      const configurationEntry = configuration.contexts.find(c => c.wordCount === wordCount);
      if (!configurationEntry) {
        throw new Error("WTF");
      }

      const searchResults = joinSequenceGaps({
        rawSearchResults,
        wordCount,
        document: Number(document)
      });

      await fillSequenceGaps({ searchResults, library, modelName, sequelize });

      flattenSearchResults({ searchResults, overlapWordCount: configurationEntry.overlapWordCount });

      searchResultsByWordCount[String(wordCount)] = searchResults;
    }

    let contextSizes = Object.keys(searchResultsByWordCount);
    contextSizes.sort((a, b) => a - b);
    contextSizes = contextSizes.map(c => String(c));

    for (let i = 0; i < contextSizes.length - 1; i++) {
      const largeContextSize = contextSizes[i + 1];
      const smallContextSize = contextSizes[i];

      await joinContexts(searchResultsByWordCount[largeContextSize], searchResultsByWordCount[smallContextSize]);
    }

    const lectureSearchResults = Object.values(searchResultsByWordCount).flat().filter(entry => Boolean(entry));
    overallSearchResults.push(...lectureSearchResults);
  }

  overallSearchResults.sort((a, b) => a.distance - b.distance);

  return overallSearchResults;
}

export async function summarize(query, model, contextEntries) {
  const actualQuery = [
    "Video transcript is below.",
    "---------------------",
    contextEntries.join("\n\n"),
    "---------------------",
    "Given ONLY the transcript from video and not prior knowledge, answer the question. Do not provide personal opinion. Do not comment on the video transcript. Question: " + query
  ].join("\n");

  const messages = [
    {
      role: 'system',
      content: 'You are a transcript summarizing assistant.'
    },
    {
      role: 'user',
      content: actualQuery
    }
  ];

  const result = await axios.request({
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      Authorization: 'Bearer ' + process.env.OPENAI_API_KEY
    },
    validateStatus: () => true,
    data: {
      model,
      max_tokens: 700,
      messages,
      temperature: 0.4,
      user: 'timsnyder'
    }
  });

  if (result.status !== 200) {
    console.log("GPT OOPS");
    console.log(result.status + ' ' + result.statusText);
    console.log(result.data);
    return null;
  }

  return result.data.choices[0].message.content.trim();
}

export function shorten(searchResults, maxLength = 6000) {
  const texts = [];
  let len = 0;
  for (const entry of searchResults) {
    texts.push(entry.text);
    len += entry.text.length + 1;
    if (len >= maxLength) {
      break;
    }
  }

  return texts;
}

export function normalizeQuery(rawQuery) {
  const query = (rawQuery || '').replace(/\s+/g, ' ').trim();
  return query.length < 5 ? null : query; // FIXME length?
}

export function sanitizeQueryForIndexing(normalizedQuery) {
  return normalizedQuery
    .toLocaleLowerCase()
    .replaceAll('?', '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(word => word !== 'the' && word !== 'a')
    .join(' ');
}
