<template>
  <div class="relative">
    <input
      ref="inputEl"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      autocomplete="off"
      class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      @input="onInput"
    />
    <span
      v-if="!scriptLoaded"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
    >
      Cargando…
    </span>
    <span
      v-else
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      aria-hidden="true"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useGooglePlaces } from '@/composables/useGooglePlaces'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    required?: boolean
  }>(),
  { placeholder: 'Buscar dirección...', required: false }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const inputEl = ref<HTMLInputElement | null>(null)
const { loadScript, initAutocomplete, scriptLoaded } = useGooglePlaces()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

onMounted(async () => {
  try {
    await loadScript()
    if (inputEl.value) {
      initAutocomplete(inputEl.value, {
        onPlaceSelect: (address) => emit('update:modelValue', address),
      })
    }
  } catch (err) {
    console.warn('Google Places no disponible:', err)
  }
})

watch(
  () => props.modelValue,
  (val) => {
    if (inputEl.value && inputEl.value.value !== val) {
      inputEl.value.value = val ?? ''
    }
  },
  { immediate: true }
)
</script>
