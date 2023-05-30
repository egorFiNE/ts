import { shallowRef } from 'vue';
import { useFetch } from '@vueuse/core';

const models = shallowRef([]);
const isErrorState = shallowRef(false);

async function reloadModels() {
  const { data, error } = await useFetch('/api/models/', {
    method: 'GET'
  }).json();

  if (error.value) {
    isErrorState.value = true;
    models.value = [];
    return;
  }

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

export { models, isErrorState };
