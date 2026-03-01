<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="contract-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arrendamiento-modal-title"
      @click.self="$emit('close')"
    >
      <div class="contract-modal-backdrop" aria-hidden="true" @click="$emit('close')"></div>
      <div class="contract-modal">
        <div class="contract-modal-header">
          <h2 id="arrendamiento-modal-title" class="contract-modal-title">
            Contrato de arrendamiento de media estancia
          </h2>
          <button
            type="button"
            class="contract-modal-close"
            aria-label="Cerrar"
            @click="$emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="contract-modal-body">
          <p class="contract-doc-main-title">
            CONTRATO DE ARRENDAMIENTO DE MEDIA ESTANCIA PARA USO PROFESIONAL<br />
            + CÉDULA DE DESCANSO
          </p>
          <p class="contract-place">En Madrid, a [] de [______] de 202[]</p>

          <section class="contract-section">
            <h4 class="contract-section-title">REUNIDOS:</h4>
            <p><strong>ARRENDADOR:</strong> LOFT2LIVE S.L.</p>
            <p><strong>ARRENDATARIO:</strong> [Nombre del Profesional], con DNI/NIE [________].</p>
          </section>

          <section class="contract-section">
            <h4 class="contract-section-title">DECLARAN:</h4>
            <p><strong>I.</strong> Que el inmueble está calificado como Oficina/Local y cuenta con una distribución técnica certificada que distingue entre un Hub Profesional y un Módulo de Descanso.</p>
            <p><strong>II.</strong> Que el Arrendatario tiene interés en el arrendamiento del inmueble para el ejercicio de su actividad profesional y pernocta accesoria durante la Temporada Académica/Profesional.</p>
          </section>

          <section class="contract-section">
            <h4 class="contract-section-title">ESTIPULACIONES CLAVE</h4>

            <div class="contract-clause">
              <strong>PRIMERA.– NATURALEZA Y DURACIÓN (MEDIA ESTANCIA)</strong>
              <p>El presente contrato se pacta por una temporada determinada, coincidiendo con el ciclo profesional/académico:</p>
              <p><strong>Periodo:</strong> Desde el 1 de septiembre hasta el 31 de julio (11 meses).</p>
              <p><strong>Causa de Temporalidad:</strong> El Arrendatario manifiesta que su necesidad de ocupación es transitoria por motivos de proyectos profesionales o formación técnica en la capital, no constituyendo en ningún caso su vivienda habitual y permanente.</p>
            </div>

            <div class="contract-clause">
              <strong>SEGUNDA.– RÉGIMEN DE SOCIO Y BENEFICIOS "FLEX LIVE"</strong>
              <p>El ecosistema Loft2Live premia la vinculación patrimonial. Se establecen dos regímenes de tarifas:</p>
              <ul class="contract-list">
                <li><strong>Tarifa General:</strong> Aplicable a usuarios estándar del ecosistema.</li>
                <li><strong>Tarifa Socio Loft2Live:</strong> Aplicable a Arrendatarios que posean al menos un (1) Ticket de Participación (5.000€) en formato Token MiCA.</li>
              </ul>
              <p><strong>Descuento Temporada:</strong> Diez por ciento (10%) de reducción lineal en la renta mensual de este contrato.</p>
              <p><strong>Descuento Días Sueltos:</strong> Veinte por ciento (20%) de reducción en reservas adicionales de días sueltos dentro de la red global de Loft2Live.</p>
            </div>

            <div class="contract-clause">
              <strong>TERCERA.– ESTRUCTURA DE RENTA Y FACTURACIÓN DUAL</strong>
              <p>La contraprestación económica se desglosa según el uso certificado para maximizar la deducibilidad:</p>
              <p><strong>Renta Hub Profesional:</strong> [Monto A] € + IVA (21%). Gasto 100% deducible para el profesional.</p>
              <p><strong>Cuota Módulo de Descanso:</strong> [Monto B] €. Gasto de uso personal (No sujeto a IVA).</p>
              <p><strong>Aplicación de Descuento Socio:</strong> Si el Arrendatario acredita la titularidad de su Ticket de 5.000€, los montos anteriores se verán reducidos automáticamente en un 10%.</p>
            </div>

            <div class="contract-clause">
              <strong>CUARTA.– AGILIDAD MiCA Y SISTEMA DE TOKENS</strong>
              <p>El Arrendatario recibirá un Access Token gestionado bajo normativa MiCA que le otorga:</p>
              <ul class="contract-list">
                <li>Identificación criptográfica y acceso físico al inmueble.</li>
                <li>Gestión de los descuentos de socio (10%/20%) de forma automatizada mediante Smart Contracts.</li>
                <li>Trazabilidad de uso para la emisión del certificado fiscal anual.</li>
              </ul>
            </div>

            <div class="contract-clause">
              <strong>QUINTA.– SISTEMA FLEX USE (MONETIZACIÓN POR AUSENCIA)</strong>
              <p>Si el Arrendatario se ausenta del inmueble durante la vigencia del contrato, podrá activar el modo Flex Use. Loft2Live gestionará el espacio para otros profesionales, generando Créditos de Estancia que el Arrendatario podrá usar para viajar a otras ciudades o para compensar gastos de mantenimiento.</p>
            </div>

            <div class="contract-clause">
              <strong>SEXTA.– TERMINACIÓN Y VACACIONES (AGOSTO)</strong>
              <p>El contrato finaliza el 31 de julio. Durante el mes de agosto, el inmueble queda a plena disposición de Loft2Live para labores de mantenimiento, actualización técnica o explotación en régimen de corta estancia, salvo que las partes pacten expresamente una prórroga de verano.</p>
            </div>
          </section>

          <section class="contract-section contract-closing">
            <p>Leído el presente contrato y estando de acuerdo con su contenido, las partes lo firman en duplicado ejemplar en el lugar y fecha indicados en el encabezamiento.</p>
            <p class="contract-signatures">(Firma Arrendador) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (Firma Arrendatario)</p>
          </section>
        </div>

        <div class="contract-modal-footer">
          <button type="button" class="contract-modal-cta" @click="$emit('close')">
            Entendido
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
.contract-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.contract-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.contract-modal {
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

.contract-modal-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #2793F2;
  border-radius: 1.25rem 1.25rem 0 0;
}

.contract-modal-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
}

.contract-modal-close {
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

.contract-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.contract-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #374151;
}

.contract-doc-main-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0D0D0D;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1.4;
}

.contract-place {
  margin: 0 0 1.25rem 0;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.contract-section {
  margin-bottom: 1.25rem;
}

.contract-section-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2793F2;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.contract-section p {
  margin: 0 0 0.4rem 0;
}

.contract-part {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.contract-part-title {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0D0D0D;
  text-align: center;
}

.contract-list {
  margin: 0.5rem 0 0.75rem 0;
  padding-left: 1.5rem;
}

.contract-list li {
  margin-bottom: 0.35rem;
}

.contract-list-check li::before {
  content: '✅ ';
}

.contract-list-cross li::before {
  content: '❌ ';
}

.contract-table-wrap {
  overflow-x: auto;
  margin: 0.75rem 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.contract-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.contract-table th,
.contract-table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.contract-table th {
  background: #f3f4f6;
  font-weight: 600;
  color: #0D0D0D;
}

.contract-table tbody tr:last-child td {
  border-bottom: none;
}

.contract-clause {
  margin-bottom: 1rem;
  padding: 0.875rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 4px solid #2793F2;
}

.contract-clause p {
  margin: 0 0 0.35rem 0;
}

.contract-clause p:last-child {
  margin-bottom: 0;
}

.contract-closing {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 2px solid #e5e7eb;
}

.contract-signatures {
  margin-top: 1.25rem !important;
  font-style: italic;
  color: #6b7280;
  text-align: center;
}

.contract-signatures-block {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  text-align: center;
}

.contract-signatures-block p {
  margin: 0 0 0.35rem 0;
}

.contract-signature-spacer {
  margin-top: 1.25rem !important;
}

@media (max-width: 480px) {
  .contract-signatures-block {
    grid-template-columns: 1fr;
  }
}

.contract-modal-footer {
  flex-shrink: 0;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 1.25rem 1.25rem;
}

.contract-modal-cta {
  width: 100%;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #2793F2;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.1s ease;
}

.contract-modal-cta:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .contract-modal-title {
    font-size: 1rem;
  }

  .contract-modal-body {
    padding: 1rem;
    font-size: 0.8rem;
  }

  .contract-table {
    font-size: 0.75rem;
  }

  .contract-table th,
  .contract-table td {
    padding: 0.4rem 0.5rem;
  }
}
</style>
