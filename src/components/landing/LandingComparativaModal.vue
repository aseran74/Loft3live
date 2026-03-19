<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="comparativa-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparativa-modal-title"
      @click.self="$emit('close')"
    >
      <div class="comparativa-modal-backdrop" aria-hidden="true" @click="$emit('close')"></div>
      <div class="comparativa-modal">
        <div class="comparativa-modal-header">
          <h2 id="comparativa-modal-title" class="comparativa-modal-title">
            Comparativa de Ahorro: Modelo 80/20 vs. Tradicional
          </h2>
          <button
            type="button"
            class="comparativa-modal-close"
            aria-label="Cerrar"
            @click="$emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="comparativa-modal-body">
          <div class="comparison-table-wrapper">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Apartamento tradicional</th>
                  <th>Modelo Apartamento Smart (80/20)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Deducción IVA/Gastos</td>
                  <td>0% - 20%</td>
                  <td>100% (sobre el 80% del valor)</td>
                </tr>
                <tr>
                  <td>Deducción IRPF</td>
                  <td>Estándar</td>
                  <td>30% (sobre el 20% del valor)</td>
                </tr>
                <tr>
                  <td>Estructura Legal</td>
                  <td>Escritura única</td>
                  <td>Escritura Dual (Máxima optimización)</td>
                </tr>
                <tr>
                  <td>Movilidad</td>
                  <td>Activo fijo y pesado</td>
                  <td>Activo líquido y canjeable por tokens</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="comparativa-modal-footer">
          <button type="button" class="comparativa-modal-cta" @click="$emit('close')">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

function handleEscape(e: KeyboardEvent) {
  if (props.open && e.key === 'Escape') emit('close')
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.comparativa-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.comparativa-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.comparativa-modal {
  position: relative;
  width: 100%;
  max-width: 720px;
  max-height: calc(100vh - 2rem);
  background: white;
  border-radius: 1.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.comparativa-modal-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: var(--color-primary, #2793F2);
  border-radius: 1.25rem 1.25rem 0 0;
}

.comparativa-modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.comparativa-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.comparativa-modal-close:hover {
  background: rgba(255, 255, 255, 0.35);
}

.comparativa-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.comparison-table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border, #e5e7eb);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.comparison-table thead {
  background: linear-gradient(135deg, var(--color-loft-100, #e0e7ff), var(--color-primary, #2793F2));
  color: white;
}

.comparison-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
}

.comparison-table th:first-child {
  border-radius: 0.75rem 0 0 0;
}

.comparison-table th:last-child {
  border-radius: 0 0.75rem 0 0;
  background: rgba(255, 255, 255, 0.12);
}

.comparison-table tbody tr {
  transition: background 0.2s ease;
}

.comparison-table tbody tr:nth-child(even) {
  background: #f9fafb;
}

.comparison-table tbody tr:hover {
  background: #f3f4f6;
}

.comparison-table td {
  padding: 1rem 1.25rem;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

.comparison-table td:first-child {
  font-weight: 600;
  color: #111827;
  width: 28%;
}

.comparison-table td:nth-child(2) {
  color: #6b7280;
}

.comparison-table td:last-child {
  color: var(--color-primary, #2793F2);
  font-weight: 500;
}

.comparison-table tbody tr:last-child td {
  border-bottom: none;
}

.comparativa-modal-footer {
  flex-shrink: 0;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.comparativa-modal-cta {
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: var(--color-primary, #2793F2);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.comparativa-modal-cta:hover {
  opacity: 0.9;
}

@media (max-width: 640px) {
  .comparativa-modal-title {
    font-size: 1.1rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
