<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="contract-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contract-modal-title"
      @click.self="$emit('close')"
    >
      <div class="contract-modal-backdrop" aria-hidden="true" @click="$emit('close')"></div>
      <div class="contract-modal">
        <div class="contract-modal-header">
          <h2 id="contract-modal-title" class="contract-modal-title">Modelos de compraventa</h2>
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

        <!-- Selector de modelo -->
        <div class="contract-model-tabs">
          <button
            type="button"
            class="contract-tab"
            :class="{ 'contract-tab-active': activeModel === 'permuta' }"
            @click="activeModel = 'permuta'"
          >
            📑 Permuta (loft entero por tokens)
          </button>
          <button
            type="button"
            class="contract-tab"
            :class="{ 'contract-tab-active': activeModel === 'tickets' }"
            @click="activeModel = 'tickets'"
          >
            📑 Suscripción de tickets
          </button>
        </div>

        <div class="contract-modal-body">
          <!-- MODELO 1: Permuta de activos por tokens -->
          <div v-show="activeModel === 'permuta'" class="contract-model-content">
            <h3 class="contract-doc-title">CONTRATO DE PERMUTA DE ACTIVOS INMOBILIARIOS POR TOKENS DE VALOR (MODELO MiCA)</h3>

            <section class="contract-section">
              <h4 class="contract-section-title">REUNIDOS:</h4>
              <p><strong>EL VENDEDOR / PROPIETARIO:</strong> [Nombre o Razón Social], con DNI/CIF [Número].</p>
              <p><strong>EL ADQUIRENTE / USUARIO:</strong> [Nombre o Razón Social], con DNI/CIF [Número].</p>
            </section>

            <section class="contract-section">
              <h4 class="contract-section-title">DECLARAN:</h4>
              <p><strong>I.</strong> Que EL VENDEDOR es propietario pleno del activo inmobiliario situado en [Dirección], configurado técnicamente bajo dos usos diferenciados:</p>
              <ul class="contract-list">
                <li><strong>Hub Profesional:</strong> Espacio destinado efectivamente a actividad económica y servicios profesionales.</li>
                <li><strong>Módulo de Descanso:</strong> Espacio privado destinado a pernocta y uso personal complementario.</li>
              </ul>
              <p><strong>II.</strong> Que ambas partes acuerdan la transmisión del activo bajo una estructura de permuta por activos digitales (Tokens), integrando la propiedad en el ecosistema Loft2Live.</p>
            </section>

            <section class="contract-section">
              <h4 class="contract-section-title">CLÁUSULAS ESTRATÉGICAS</h4>

              <div class="contract-clause">
                <strong>PRIMERA.– OBJETO Y TRANSMISIÓN</strong>
                <p>EL VENDEDOR transmite la nuda propiedad y el pleno dominio del activo compuesto por el Hub Profesional y el Módulo de Descanso a EL ADQUIRENTE. La transmisión se perfecciona mediante la entrega física del inmueble y la transferencia técnica de los tokens en la red blockchain.</p>
              </div>

              <div class="contract-clause">
                <strong>SEGUNDA.– PRECIO Y PARIDAD DEL TOKEN (PEG-VALUE)</strong>
                <p>El valor de mercado total del activo se fija en [Monto] €. El pago se realiza mediante la entrega de Tokens de Valor Loft2Live, asignando a cada unidad un valor nominal anclado al valor de tasación real del inmueble.</p>
                <p><strong>Estabilidad:</strong> El valor del token es independiente de la volatilidad cripto, al estar respaldado 1:1 por activos físicos.</p>
              </div>

              <div class="contract-clause">
                <strong>TERCERA.– OPTIMIZACIÓN FISCAL POR USO CERTIFICADO</strong>
                <p>La transmisión y posterior explotación del activo se desglosa según el uso real acreditado mediante informe técnico:</p>
                <p><strong>Tramo Hub Profesional:</strong> Al ser un activo afecto a la actividad económica, el Adquirente podrá deducirse el IVA y los gastos asociados (IBI, comunidad, suministros) según el grado de afectación real certificado.</p>
                <p><strong>Tramo Módulo de Descanso:</strong> Recibe el tratamiento fiscal propio del uso personal, garantizando una separación contable clara y defendible ante la administración tributaria.</p>
              </div>

              <div class="contract-clause">
                <strong>CUARTA.– NATURALEZA DEL TOKEN (REGLAMENTO MiCA)</strong>
                <p>Los tokens entregados son activos digitales de utilidad y valor que otorgan al titular:</p>
                <ul class="contract-sublist">
                  <li><strong>Derechos Operativos:</strong> Percepción de rendimientos por el programa Flex Use.</li>
                  <li><strong>Movilidad Instantánea:</strong> Capacidad de permutar el uso de este activo por otros dentro de la red global de Loft2Live.</li>
                  <li><strong>Trazabilidad:</strong> Registro inmutable de la propiedad y los usos en blockchain (Polygon).</li>
                </ul>
              </div>

              <div class="contract-clause">
                <strong>QUINTA.– ACTUALIZACIÓN Y PLUSVALÍA</strong>
                <p>Para garantizar la seguridad patrimonial, el ecosistema actualizará la paridad de los tokens en función de las tasaciones oficiales periódicas. Esto permite al inversor capturar la revalorización del mercado inmobiliario de forma líquida y digital.</p>
              </div>

              <div class="contract-clause">
                <strong>SEXTA.– FLEXIBILIDAD Y SALIDA (EXIT STRATEGY)</strong>
                <p>El ADQUIRENTE conserva el derecho perpetuo a:</p>
                <ul class="contract-sublist">
                  <li><strong>Venta Directa:</strong> Enajenación tradicional del inmueble a terceros.</li>
                  <li><strong>Rotación Digital:</strong> Liquidar su posición en el activo a cambio de tokens líquidos para mudarse a otra ubicación de la red, ajustando la diferencia según los valores de mercado de la ciudad de destino.</li>
                </ul>
              </div>

              <div class="contract-clause">
                <strong>SÉPTIMA.– JURISDICCIÓN Y ELEVACIÓN A PÚBLICO</strong>
                <p>Este contrato se rige por la legislación española y queda sujeto a su elevación a Escritura Pública. En dicho acto se formalizará la transmisión registral y la carga de los activos digitales en la wallet del Adquirente.</p>
              </div>
            </section>

            <section class="contract-section contract-closing">
              <p>Leído el presente contrato y estando de acuerdo con su contenido, las partes lo firman en duplicado ejemplar en el lugar y fecha indicados en el encabezamiento.</p>
              <p class="contract-signatures">(Firma Vendedor) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (Firma Adquirente)</p>
            </section>
          </div>

          <!-- MODELO 2: Suscripción de tickets -->
          <div v-show="activeModel === 'tickets'" class="contract-model-content">
            <h3 class="contract-doc-title">CONTRATO DE ADHESIÓN AL ECOSISTEMA LOFT2LIVE: SUSCRIPCIÓN DE TICKETS (MODELO MiCA)</h3>

            <section class="contract-section">
              <h4 class="contract-section-title">REUNIDOS:</h4>
              <p><strong>EL EMISOR:</strong> Loft2Live S.L., gestora del ecosistema de activos híbridos.</p>
              <p><strong>EL SUSCRIPTOR:</strong> [Nombre o Razón Social], con DNI/CIF [Número].</p>
            </section>

            <section class="contract-section">
              <h4 class="contract-section-title">DECLARAN:</h4>
              <p><strong>I.</strong> Que Loft2Live ha desarrollado un ecosistema basado en la tokenización de espacios profesionales (Hub Profesional) y de pernocta (Módulo de Descanso).</p>
              <p><strong>II.</strong> Que el SUSCRIPTOR desea integrarse en dicho ecosistema mediante la adquisición de Tickets de Participación digitalizados.</p>
            </section>

            <section class="contract-section">
              <h4 class="contract-section-title">CLÁUSULAS ESTRATÉGICAS</h4>

              <div class="contract-clause">
                <strong>PRIMERA.– OBJETO: TICKETS DE ENTRADA AL ECOSISTEMA</strong>
                <p>El Suscriptor adquiere [Número] Tickets por un valor unitario de 5.000 €. Esta aportación le otorga la condición de Miembro del Ecosistema Loft2Live, representada mediante la transferencia de Tokens de Utilidad (L2L) a su wallet digital.</p>
              </div>

              <div class="contract-clause">
                <strong>SEGUNDA.– MARCO JURÍDICO: AGILIDAD MiCA (REGLAMENTO UE 2023/1114)</strong>
                <p>Este contrato se rige por el principio de Agilidad MiCA. Al configurarse los tokens como activos de utilidad (Utility Tokens), la operación se beneficia de un marco regulatorio europeo simplificado:</p>
                <ul class="contract-sublist">
                  <li><strong>Eficiencia:</strong> Sin necesidad de folletos de emisión ante la CNMV, permitiendo una ejecución de inversión inmediata.</li>
                  <li><strong>Seguridad:</strong> Cumplimiento estricto con la normativa europea de criptoactivos, garantizando transparencia y protección al adquirente.</li>
                </ul>
              </div>

              <div class="contract-clause">
                <strong>TERCERA.– BENEFICIOS DEL ECOSISTEMA LOFT2LIVE</strong>
                <p>La tenencia de los tickets/tokens otorga derechos exclusivos dentro de la red:</p>
                <ul class="contract-sublist">
                  <li><strong>Derecho de Acceso:</strong> Uso de cualquier Hub Profesional de la red (Madrid, Barcelona, etc.).</li>
                  <li><strong>Tarifa Flex Live:</strong> Descuentos directos del [X]% en estancias y servicios asociados (coworking, gestión fiscal, limpieza).</li>
                  <li><strong>Gobernanza de Red:</strong> Participación en la toma de decisiones sobre la apertura de nuevos espacios en el ecosistema.</li>
                </ul>
              </div>

              <div class="contract-clause">
                <strong>CUARTA.– VALOR DE RESPALDO Y PEG-VALUE</strong>
                <p>Para garantizar la estabilidad del capital, cada ticket de 5.000€ está anclado al valor de mercado de los activos físicos del ecosistema.</p>
                <p><strong>Trazabilidad:</strong> El inversor puede verificar en tiempo real, mediante blockchain (Polygon), cómo su ticket mantiene la paridad con el valor de tasación inmobiliaria de la red.</p>
              </div>

              <div class="contract-clause">
                <strong>QUINTA.– MOVILIDAD Y LIQUIDEZ DIGITAL</strong>
                <p>El ecosistema Loft2Live elimina la rigidez del ladrillo:</p>
                <ul class="contract-sublist">
                  <li><strong>Intercambio de Valor:</strong> Los tokens pueden ser canjeados por servicios o días de estancia de forma líquida.</li>
                  <li><strong>Marketplace Interno:</strong> El suscriptor puede transferir sus tickets a otros miembros del ecosistema en un mercado secundario ágil, sin las esperas ni los costes de una venta inmobiliaria tradicional.</li>
                </ul>
              </div>

              <div class="contract-clause">
                <strong>SEXTA.– SALIDA PROGRAMADA</strong>
                <p>El suscriptor podrá solicitar la liquidación de sus tickets tras un periodo de permanencia de [X] meses, recibiendo el valor de tasación actualizado del ecosistema, consolidando así las plusvalías generadas por la revalorización de los inmuebles.</p>
              </div>
            </section>

            <section class="contract-section contract-closing">
              <p>Leído el presente contrato y estando de acuerdo con su contenido, las partes lo firman en duplicado ejemplar en el lugar y fecha indicados en el encabezamiento.</p>
              <p class="contract-signatures">(Firma Emisor) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (Firma Suscriptor)</p>
            </section>
          </div>
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
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const activeModel = ref<'permuta' | 'tickets'>('permuta')

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
  font-size: 1.35rem;
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

.contract-model-tabs {
  flex-shrink: 0;
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.contract-tab {
  flex: 1;
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.contract-tab:hover {
  color: #2793F2;
  border-color: #93c5fd;
}

.contract-tab-active {
  color: #2793F2;
  background: #eff6ff;
  border-color: #2793F2;
}

.contract-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.65;
  color: #374151;
}

.contract-model-content {
  min-height: 0;
}

.contract-intro {
  margin: 0 0 1.25rem 0;
  padding: 1rem;
  background: #f0fdf4;
  border-left: 4px solid #2793F2;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #166534;
  font-size: 0.9rem;
}

.contract-doc-title {
  margin: 0 0 1.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0D0D0D;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.contract-section {
  margin-bottom: 1.5rem;
}

.contract-section-title {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #2793F2;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.contract-section p {
  margin: 0 0 0.5rem 0;
}

.contract-list,
.contract-sublist {
  margin: 0.5rem 0 0.75rem 0;
  padding-left: 1.5rem;
}

.contract-list li,
.contract-sublist li {
  margin-bottom: 0.4rem;
}

.contract-clause {
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 4px solid #2793F2;
}

.contract-clause p {
  margin: 0 0 0.5rem 0;
}

.contract-clause p:last-child {
  margin-bottom: 0;
}

.contract-clause:last-child {
  margin-bottom: 0;
}

.contract-closing {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 2px solid #e5e7eb;
}

.contract-signatures {
  margin-top: 1.5rem !important;
  font-style: italic;
  color: #6b7280;
  text-align: center;
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
    font-size: 1.15rem;
  }

  .contract-modal-body {
    padding: 1rem;
    font-size: 0.85rem;
  }

  .contract-doc-title {
    font-size: 1rem;
  }
}
</style>
