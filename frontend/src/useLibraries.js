import { shallowRef } from 'vue';
import { useFetch } from '@vueuse/core';

const libraries = shallowRef([]);
const isErrorState = shallowRef(false);

async function reloadLibraries() {
  const { data, error } = await useFetch('/api/libraries/', {
    method: 'GET'
  }).json();

  if (error.value) {
    isErrorState.value = true;
    libraries.value = [];
    return;
  }

  if (!data.value.success) {
    isErrorState.value = true;
    libraries.value = [];
    return;
  }

  libraries.value = data.value.libraries;
}

async function loadLibraries() {
  if (libraries.value.length > 0) {
    return;
  }
  await reloadLibraries();
}

loadLibraries();

export { libraries, isErrorState };
