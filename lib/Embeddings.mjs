import axios from 'axios';

// max length of embedding is equal to OpenAI embedding size.
export const EMBEDDING_LENGTH = 1536;

const EMBEDDING_SERVER_URL = 'http://' + process.env.EMBEDDING_SERVER_LISTEN_HOST + ':' + process.env.EMBEDDING_SERVER_LISTEN_PORT + '/calc';

export function normalizeEmbedding(embedding) {
  if (!embedding) {
    throw new Error('Embedding is not defined');
  }

  if (embedding.length === EMBEDDING_LENGTH) {
    return embedding;
  }

  const normalizedEmbedding = new Array(EMBEDDING_LENGTH).fill(0);
  for (let i = 0; i < embedding.length; i++) {
    normalizedEmbedding[i] = embedding[i];
  }
  return normalizedEmbedding;
}

async function getEmbeddingsLocalServer(model, text) {
  const r = await axios.request({
    method: 'POST',
    url: EMBEDDING_SERVER_URL,
    data: {
      model,
      text
    }
  });

  if (r.status !== 200) {
    console.log(r.status, r.statusText, r.data);
    throw new Error("Cannot calc embeddings");
  }

  return r.data;
}

async function getEmbeddingsOpenAI(input) {
  const result = await axios.request({
    method: 'POST',
    url: 'https://api.openai.com/v1/embeddings',
    headers: {
      Authorization: 'Bearer ' + process.env.OPENAI_API_KEY
    },
    validateStatus: () => true,
    data: {
      model: 'text-embedding-ada-002',
      input
    }
  });

  if (result.status !== 200) {
    console.log("GPT OOPS");
    console.log(result.status + ' ' + result.statusText);
    console.log(result.data);
    return null;
  }

  const embeddings = [];

  for (let i = 0; i < result.data.data.length; i++) {
    const entry = result.data.data[i];
    if (entry.index !== i) {
      throw new Error("Oops, index != index in embeddings");
    }

    embeddings.push(entry.embedding);
  }

  return embeddings;
}

export async function getEmbeddings(model, text) {
  if (model === 'openai') {
    return await getEmbeddingsOpenAI(text);
  }

  return await getEmbeddingsLocalServer(model, text);
}
