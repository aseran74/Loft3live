<template>
  <Teleport :to="teleportTarget" :disabled="!teleportTarget">
    <div
      v-if="open"
      class="flex-use-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flex-use-modal-title"
      @click.self="$emit('close')"
    >
      <div class="flex-use-modal-backdrop" aria-hidden="true" @click="$emit('close')"></div>
      <div class="flex-use-modal">
        <div class="flex-use-modal-header">
          <h2 id="flex-use-modal-title" class="flex-use-modal-title">📍 Ejemplo Práctico: El Puente Madrid - Barcelona</h2>
          <button
            type="button"
            class="flex-use-modal-close"
            aria-label="Cerrar"
            @click="$emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="flex-use-modal-body">
          <ul class="flex-use-modal-list">
            <li><strong>La situación:</strong> Vives/trabajas en tu Smart Loft de Madrid, pero te surge un proyecto de 20 días en Barcelona.</li>
            <li><strong>La acción:</strong> Activas el Modo Flex en la App. Tu loft de Madrid queda disponible para la red.</li>
            <li><strong>El resultado:</strong> Mientras estás en Barcelona, otro profesional usa tu espacio en Madrid. Tú acumulas créditos que cubren íntegramente tu estancia en Barcelona.</li>
            <li><strong>Balance final:</strong> Has vivido y trabajado en dos ciudades pagando solo una. Coste neto tendente a cero.</li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const teleportTarget = ref<string | HTMLElement | null>(null)
onMounted(() => {
  if (typeof document !== 'undefined' && document.body) {
    teleportTarget.value = document.body
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.flex-use-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.flex-use-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.flex-use-modal {
  position: relative;
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.flex-use-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

.flex-use-modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  padding-right: 0.5rem;
}

.flex-use-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.flex-use-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.flex-use-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.flex-use-modal-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--color-foreground);
}

.flex-use-modal-list li {
  margin-bottom: 0.75rem;
}

.flex-use-modal-list li:last-child {
  margin-bottom: 0;
}

.flex-use-modal-list strong {
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .flex-use-modal-overlay {
    padding: 0;
    align-items: stretch;
  }

  .flex-use-modal {
    max-width: none;
    max-height: none;
    height: 100%;
    min-height: 100vh;
    border-radius: 0;
  }

  .flex-use-modal-title {
    font-size: 1rem;
  }
}
</style>
