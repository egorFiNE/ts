import { ref, shallowRef } from 'vue';
import { useFetch } from '@vueuse/core';

const models = ref([]);
const isErrorState = shallowRef(false);

async function reloadModels() {
  let data = null;

  const result = await useFetch('/api/models/', {
    method: 'GET'
  }).json();

  if (result.error.value) {
    isErrorState.value = true;
    models.value = [];
    return;
  }

  data = result.data;

  if (!data.value.success) {
    isErrorState.value = true;
    models.value = [];
    return;
  }

  models.value = data.value.models;
}

async function loadModels() {
  if (models.value.length > 0) {
    return;
  }
  await reloadModels();
}

loadModels();

export { models, isErrorState }
