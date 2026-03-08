<template>
  <component :is="layoutComponent">
  <div
    class="p-4 sm:p-6"
    :class="{ 'pt-24': topPadding || isPublicRoute }"
    style="background-color: #F2F2F2"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Botón volver -->
      <button
        type="button"
        @click="router.push(backTo)"
        class="mb-6 flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
        style="color: #2793F2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {{ backLabel }}
      </button>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p style="color: #0D0D0D">Cargando proyecto...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- Contenido del proyecto -->
      <div v-else-if="proyecto" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6 sm:p-8">
          <!-- Título del proyecto -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8" style="color: #0D0D0D">
            {{ proyecto.nombre_proyecto }}
          </h1>

          <!-- Precio total de la inversión y barra de progreso -->
          <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
              <p class="text-sm text-gray-600">Precio total de la inversión</p>
              <p class="text-2xl sm:text-3xl font-bold" style="color: #0D0D0D">
                {{ formatCurrency(proyecto.objetivo_inversion_total) }}
              </p>
            </div>
            <div class="flex justify-between text-sm mb-2" style="color: #0D0D0D">
              <span>Progreso de inversión</span>
              <span class="font-semibold">{{ proyecto.porcentaje_llegado }}% completado</span>
            </div>
            <div class="w-full rounded-full h-4" style="background-color: #C8D9B0">
              <div
                class="h-4 rounded-full transition-all duration-500"
                :style="`width: ${Math.min(100, proyecto.porcentaje_llegado)}%; background: linear-gradient(135deg, #C8D9B0, #2793F2)`"
              ></div>
            </div>
            <!-- Consulta vinculante urbanística -->
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="text-sm text-gray-600">Consulta vinculante urbanística:</span>
              <span
                v-if="proyecto.consulta_vinculante_urbanistica"
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                style="background-color: #C8D9B0; color: #2793F2"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sí
              </span>
              <span v-else class="text-sm font-medium text-gray-500">No</span>
            </div>
          </div>

          <!-- Fotos antes y después de la reforma (lado a lado en desktop) -->
          <div
            v-if="(proyecto.fotos_oficina_actual?.length > 0) || (proyecto.fotos_oficina_remodelada?.length > 0)"
            :class="(proyecto.fotos_oficina_actual?.length > 0) && (proyecto.fotos_oficina_remodelada?.length > 0) ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8' : 'mb-8'"
          >
            <!-- 1. Fotos antes de la reforma (oficina) -->
            <div v-if="proyecto.fotos_oficina_actual?.length > 0">
              <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Fotos antes de la reforma (oficina)</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div
                  v-for="(photo, idx) in proyecto.fotos_oficina_actual"
                  :key="'actual-' + idx"
                  class="rounded-xl overflow-hidden border-2 shadow-md cursor-pointer"
                  style="border-color: #C8D9B0"
                  @click="openReformaLightbox(idx, 'actual')"
                >
                  <div class="aspect-[4/3] bg-gray-100">
                    <img
                      :src="getPhotoUrl(photo)"
                      :alt="`Oficina antes reforma - ${proyecto.nombre_proyecto}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Fotos después de la reforma (convertido en loft) -->
            <div v-if="proyecto.fotos_oficina_remodelada?.length > 0">
              <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Fotos después de la reforma (convertido en loft)</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div
                  v-for="(photo, idx) in proyecto.fotos_oficina_remodelada"
                  :key="'remodelada-' + idx"
                  class="rounded-xl overflow-hidden border-2 shadow-md cursor-pointer"
                  style="border-color: #C8D9B0"
                  @click="openReformaLightbox(idx, 'remodelada')"
                >
                  <div class="aspect-[4/3] bg-gray-100">
                    <img
                      :src="getPhotoUrl(photo)"
                      :alt="`Loft después reforma - ${proyecto.nombre_proyecto}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Fotos apartamento -->
          <div v-if="proyecto.fotos?.length > 0" class="mb-8">
            <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Fotos apartamento</h2>
            <div class="modern-gallery">
              <div class="gallery-main-image" @click="openLightbox(0)">
                <img
                  :src="getPhotoUrl(proyecto.fotos[0])"
                  :alt="`${proyecto.nombre_proyecto} - Imagen principal`"
                  class="w-full h-full object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                />
                <div class="absolute inset-0 bg-black/0 hover:bg-black/10 rounded-lg transition-colors"></div>
              </div>

              <div class="gallery-side-grid">
                <div
                  v-for="(photo, index) in proyecto.fotos.slice(1, 5)"
                  :key="index + 1"
                  class="gallery-side-image relative group cursor-pointer"
                  @click="openLightbox(index + 1)"
                >
                  <img
                    :src="getPhotoUrl(photo)"
                    :alt="`Foto ${index + 2} de ${proyecto.nombre_proyecto}`"
                    class="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors"></div>

                  <div
                    v-if="index === 3 && (proyecto?.fotos?.length ?? 0) > 5"
                    class="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center"
                  >
                    <div class="text-white text-center">
                      <svg class="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="text-lg font-semibold">+{{ (proyecto?.fotos?.length ?? 0) - 5 }}</p>
                      <p class="text-sm">más fotos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 flex gap-2 overflow-x-auto pb-2 gallery-thumbnails">
              <button
                v-for="(photo, index) in proyecto.fotos"
                :key="index"
                type="button"
                class="gallery-thumbnail flex-shrink-0"
                :class="{ 'active': currentPhotoIndex === index }"
                @click="openLightbox(index)"
              >
                <img
                  :src="getPhotoUrl(photo)"
                  :alt="`Miniatura ${index + 1}`"
                  class="w-full h-full object-cover rounded-lg"
                />
              </button>
            </div>
          </div>

          <!-- 4. Fotos instalaciones comunes -->
          <div v-if="(proyecto.fotos_instalaciones_comunes?.length ?? 0) > 0" class="mb-8">
            <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Fotos instalaciones comunes</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div
                v-for="(photo, idx) in proyecto.fotos_instalaciones_comunes"
                :key="'inst-' + idx"
                class="rounded-xl overflow-hidden border-2 shadow-md"
                style="border-color: #C8D9B0"
              >
                <div class="aspect-[4/3] bg-gray-100">
                  <img
                    :src="getPhotoUrl(photo)"
                    :alt="`Instalaciones comunes - ${proyecto.nombre_proyecto}`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Videos del proyecto -->
          <div v-if="proyecto.videos?.length > 0" class="mb-8">
            <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Videos</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="(videoUrl, index) in proyecto.videos"
                :key="index"
                class="rounded-xl overflow-hidden border-2 shadow-md aspect-video bg-black"
                style="border-color: #C8D9B0"
              >
                <iframe
                  v-if="isYoutubeUrl(videoUrl) || isVimeoUrl(videoUrl)"
                  :src="getVideoEmbedUrl(videoUrl)"
                  class="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  title="Vídeo del proyecto"
                />
                <video
                  v-else
                  :src="getVideoUrl(videoUrl)"
                  class="w-full h-full object-contain"
                  controls
                  playsinline
                >
                  Tu navegador no soporta la reproducción de vídeo.
                </video>
              </div>
            </div>
          </div>

          <!-- Grid de información -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
            <!-- Información principal -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Detalles del proyecto -->
              <div>
                <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Detalles del proyecto</h2>
                <div class="space-y-4">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 mb-1 sm:mb-0">Precio por unidad</span>
                    <span class="font-semibold text-lg" style="color: #0D0D0D">
                      {{ formatCurrency(proyecto.precio_unidad) }}
                    </span>
                  </div>
                  <div v-if="proyecto.alquiler && proyecto.precio_alquiler_mes" class="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-200">
                    <span class="text-gray-600 mb-1 sm:mb-0">Precio alquiler</span>
                    <span class="font-semibold text-lg" style="color: #0D0D0D">
                      {{ formatCurrency(proyecto.precio_alquiler_mes) }}/mes
                    </span>
                  </div>
                  <div v-if="proyecto.permisos" class="py-3">
                    <span class="text-gray-600 block mb-2">Permisos</span>
                    <p class="text-gray-800 whitespace-pre-line">{{ proyecto.permisos }}</p>
                  </div>
                  <div v-if="proyecto.caracteristicas" class="py-3">
                    <span class="text-gray-600 block mb-2">Características</span>
                    <p class="text-gray-800 whitespace-pre-line">{{ proyecto.caracteristicas }}</p>
                  </div>
                </div>
              </div>

              <!-- Tipos de unidades -->
              <div class="mt-6">
                <h2 class="text-2xl font-bold mb-4" style="color:#0D0D0D">Tipos de unidad</h2>

                <div
                  v-if="proyecto.unidades_tipos?.length"
                  class="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div
                    v-for="(u, idx) in proyecto.unidades_tipos.slice(0,4)"
                    :key="idx"
                    class="rounded-xl border bg-white p-4"
                    style="border-color:#C8D9B0"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h3 class="text-base font-semibold" style="color:#0D0D0D">
                          {{ u.nombre || `Tipo ${idx+1}` }}
                        </h3>
                        <p class="text-sm text-gray-600 mt-1">
                          <span class="font-semibold" style="color:#0D0D0D">
                            {{ formatCurrency(Number(u.precio || 0)) }}
                          </span>
                          <span v-if="u.m2" class="ml-2 text-gray-600">· {{ u.m2 }} m²</span>
                        </p>
                      </div>
                    </div>

                    <div class="mt-3">
                      <p class="text-xs text-gray-500 mb-2">Planos</p>
                      <div v-if="u.planos?.length" class="space-y-2">
                        <a
                          v-for="(p, pIdx) in u.planos"
                          :key="pIdx"
                          class="block text-sm font-semibold hover:opacity-80"
                          style="color:#2793F2"
                          :href="getPhotoUrl(p)"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver plano {{ pIdx + 1 }}
                        </a>
                      </div>
                      <p v-else class="text-sm text-gray-600">Sin planos adjuntos.</p>
                    </div>
                  </div>
                </div>

                <div v-else class="rounded-xl border p-4 text-sm text-gray-600" style="border-color:#C8D9B0">
                  No hay tipos de unidad configurados.
                </div>
              </div>

              <!-- Comodidades -->
              <div class="mt-6">
                <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Comodidades</h2>

                <div v-if="proyecto.comodidades?.length > 0" class="space-y-4">
                  <div
                    v-for="group in amenityGroups"
                    :key="group.title"
                    class="rounded-xl border p-4 bg-white"
                    style="border-color: #C8D9B0"
                  >
                    <div class="mb-3">
                      <h3 class="text-base font-semibold" style="color: #0D0D0D">{{ group.title }}</h3>
                      <p v-if="group.subtitle" class="text-xs text-gray-500 mt-1">{{ group.subtitle }}</p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="item in group.items.filter(i => proyecto!.comodidades!.includes(i.key))"
                        :key="item.key"
                        class="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border"
                        style="border-color: #C8D9B0; background-color: #F2F2F2; color: #0D0D0D"
                      >
                        <span class="w-4 h-4" style="color: #2793F2" v-html="getAmenityIconSvg(item.key)"></span>
                        <span class="leading-none">{{ item.label }}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div v-else class="rounded-xl border p-4 text-sm text-gray-600" style="border-color: #C8D9B0">
                  No hay comodidades registradas para este proyecto.
                </div>
              </div>

              <!-- Complementos Flexliving -->
              <div class="mt-6">
                <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Complementos Flexliving</h2>
                <div v-if="proyecto.complementos_flexliving?.length" class="rounded-xl border p-4 bg-white" style="border-color: #C8D9B0">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="c in proyecto.complementos_flexliving"
                      :key="c"
                      class="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border"
                      style="border-color: #C8D9B0; background-color: #F2F2F2; color: #0D0D0D"
                    >
                      <span class="leading-none">{{ etiquetaComplementoFlexliving(c) }}</span>
                    </span>
                  </div>
                </div>
                <div v-else class="rounded-xl border p-4 text-sm text-gray-600" style="border-color: #C8D9B0">
                  No hay complementos Flexliving registrados para este proyecto.
                </div>
              </div>

              <!-- Instalaciones reservables (solo en panel admin; oculto en vista pública) -->
              <InstalacionesReservablesProyecto v-if="proyecto?.id && !isPublicRoute" :proyecto-id="proyecto.id" />

              <!-- Mapa de localización -->
              <div v-if="proyecto.localizacion" class="mt-6">
                <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Ubicación</h2>
                <div class="rounded-lg overflow-hidden shadow-md">
                  <iframe
                    class="w-full h-64 sm:h-80 md:h-96"
                    :src="mapsEmbedUrl"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <p class="mt-3 text-sm text-gray-600">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ proyecto.localizacion }}
                </p>
                <div class="mt-2">
                  <a
                    class="text-sm font-semibold hover:opacity-80"
                    style="color:#2793F2"
                    :href="mapsOpenUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir en Google Maps
                  </a>
                </div>

                <!-- Street View: iframe embed guardado en el proyecto -->
                <div v-if="proyecto.street_view_embed" class="mt-8">
                  <h2 class="text-2xl font-bold mb-4" style="color: #0D0D0D">Vista de calle</h2>
                  <div
                    class="w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border-2 shadow-md"
                    style="border-color: #C8D9B0"
                  >
                    <iframe
                      :src="proyecto.street_view_embed"
                      class="w-full h-full"
                      style="border: 0"
                      allowfullscreen
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>

              <!-- Botón Caso de Éxito 80/20 -->
              <div class="mt-8">
                <button
                  type="button"
                  @click="casoExitoModalOpen = true"
                  class="w-full sm:w-auto px-6 py-4 rounded-xl border-2 font-semibold transition-colors hover:opacity-90 flex items-center justify-center gap-2"
                  style="border-color: #C8D9B0; background-color: #F2F2F2; color: #2793F2"
                >
                  <span>💰</span>
                  Caso de Éxito: El "Efecto 80/20" sobre tu facturación
                </button>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Resumen -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-xl font-bold mb-4" style="color: #0D0D0D">Resumen</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Tipo de inversión</span>
                    <span class="font-semibold" style="color: #0D0D0D">{{ proyecto.tipo_inversion }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Lofts disponibles</span>
                    <span class="font-semibold" style="color: #0D0D0D">{{ proyecto.num_lofts }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Localización</span>
                    <span class="font-semibold text-right" style="color: #0D0D0D">{{ proyecto.localizacion }}</span>
                  </div>
                </div>
              </div>

              <!-- Fechas -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-xl font-bold mb-4" style="color: #0D0D0D">Información</h3>
                <div class="space-y-3 text-sm">
                  <div>
                    <span class="text-gray-600 block">Creado</span>
                    <span class="font-semibold" style="color: #0D0D0D"> {{ formatDate(proyecto.created_at) }} </span>
                  </div>
                  <div v-if="proyecto.updated_at">
                    <span class="text-gray-600 block">Última actualización</span>
                    <span class="font-semibold" style="color: #0D0D0D"> {{ formatDate(proyecto.updated_at) }} </span>
                  </div>
                </div>
              </div>

              <!-- Acciones (solo en panel admin) -->
              <div v-if="!isPublicRoute" class="flex flex-col gap-3">
                <button
                  @click="editProyecto"
                  class="w-full px-6 py-3 text-white rounded-lg transition-colors font-semibold hover:opacity-90"
                  style="background: linear-gradient(135deg, #C8D9B0, #2793F2)"
                >
                  Editar proyecto
                </button>

                <div
                  class="w-full px-6 py-3 rounded-lg border-2 text-center font-semibold"
                  style="border-color: #C8D9B0; background-color: #F2F2F2; color: #2793F2"
                >
                  Desgravación: 100% (uso 100% oficina)
                </div>

                <button
                  @click="deleteProyecto"
                  class="w-full px-6 py-3 border-2 rounded-lg transition-colors font-semibold hover:opacity-70"
                  style="border-color: #C8D9B0; color: #0D0D0D"
                >
                  Eliminar proyecto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Lightbox para fotos -->
  <div
    v-if="lightboxOpen && (proyecto?.fotos?.length ?? 0) > 0"
    class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    @click="closeLightbox"
  >
    <div class="relative max-w-4xl max-h-full" @click.stop>
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        aria-label="Cerrar"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button
        @click="previousPhoto"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
        aria-label="Foto anterior"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        @click="nextPhoto"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
        aria-label="Siguiente foto"
      >
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <img
        :src="getPhotoUrl(proyecto?.fotos?.[currentPhotoIndex] ?? '')"
        :alt="`Foto ${currentPhotoIndex + 1} de ${proyecto?.nombre_proyecto ?? ''}`"
        class="max-w-full max-h-[80vh] object-contain rounded-lg"
      />
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
        {{ currentPhotoIndex + 1 }} / {{ proyecto?.fotos?.length ?? 0 }}
      </div>
    </div>
  </div>

  <!-- Lightbox fotos reforma -->
  <div
    v-if="reformaLightboxOpen && reformaLightboxFotos.length > 0"
    class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    @click="closeReformaLightbox"
  >
    <button
      @click="closeReformaLightbox"
      class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      aria-label="Cerrar"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <button
      v-if="reformaLightboxFotos.length > 1"
      @click.stop="previousReformaPhoto"
      class="absolute left-4 text-white hover:text-gray-300 transition-colors"
      aria-label="Anterior"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      v-if="reformaLightboxFotos.length > 1"
      @click.stop="nextReformaPhoto"
      class="absolute right-4 text-white hover:text-gray-300 transition-colors"
      aria-label="Siguiente"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
    <img
      :src="getPhotoUrl(reformaLightboxFotos[currentReformaPhotoIndex])"
      :alt="`Reforma ${currentReformaPhotoIndex + 1}`"
      class="max-w-full max-h-full object-contain"
      @click.stop
    />
    <div
      v-if="reformaLightboxFotos.length > 1"
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm"
    >
      {{ currentReformaPhotoIndex + 1 }} / {{ reformaLightboxFotos.length }}
    </div>
  </div>

  <!-- Modal Caso de Éxito 80/20 -->
  <Teleport to="body">
    <div
      v-if="casoExitoModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      @click.self="casoExitoModalOpen = false"
    >
      <div
        class="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="caso-exito-title"
        @click.stop
      >
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl" style="border-color: #C8D9B0">
          <h2 id="caso-exito-title" class="text-xl font-bold" style="color: #0D0D0D">
            💰 Caso de Éxito: El "Efecto 80/20" sobre tu facturación
          </h2>
          <button
            type="button"
            @click="casoExitoModalOpen = false"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 sm:p-8">
          <p class="text-sm text-gray-600 mb-6">
            Introduce tu facturación anual. El valor del inmueble corresponde a este proyecto.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-semibold mb-2" style="color: #0D0D0D">Tu facturación anual (€)</label>
              <input
                v-model.number="facturacionAnual"
                type="number"
                min="0"
                step="1000"
                class="w-full px-4 py-3 rounded-lg border-2 bg-white text-lg"
                style="border-color: #C8D9B0; color: #0D0D0D"
                placeholder="80000"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2" style="color: #0D0D0D">Valor del inmueble (este proyecto)</label>
              <div
                class="w-full px-4 py-3 rounded-lg border-2 text-lg font-semibold"
                style="border-color: #C8D9B0; background-color: #EEEEEE; color: #0D0D0D"
              >
                {{ formatCurrency(valorInmueble) }}
              </div>
            </div>
          </div>

          <p class="text-gray-700 mb-6">
            Imagina que eres un profesional o empresa que factura <strong>{{ formatCurrency(facturacionAnual || 0) }}</strong> al año.
            Sin una estrategia inmobiliaria inteligente, tu base imponible es muy alta y terminas pagando un porcentaje elevado en impuestos.
            Con nuestro modelo de Smart Loft, transformas tu gasto de vida en un escudo fiscal.
          </p>

          <div class="space-y-6">
            <div class="rounded-xl border p-4 sm:p-5 bg-white" style="border-color: #C8D9B0">
              <h3 class="text-lg font-bold mb-3" style="color: #2793F2">ESCENARIO A: EL AUTÓNOMO (Estimación Directa)</h3>
              <p class="text-sm text-gray-700 mb-3">
                Facturación: <strong>{{ formatCurrency(facturacionAnual || 0) }}</strong> | Alquiler: 1.200 € (1.000 € Oficina + 200 € Vivienda)
              </p>
              <p class="text-sm text-gray-700 mb-2">
                <strong>Alquiler con nosotros:</strong> De esos {{ formatCurrency(facturacionAnual || 0) }}, restas 12.000 € de la oficina y el 30% de la vivienda. Ahora Hacienda solo te calcula impuestos sobre <strong>~{{ formatCurrency(baseReducidaAutonomo) }}</strong> en lugar de {{ formatCurrency(facturacionAnual || 0) }}.
              </p>
              <p class="text-sm text-gray-700 mb-3">
                <strong>Resultado:</strong> Te ahorras unos <strong>{{ formatCurrency(ahorroIrpfAprox) }}</strong> al año en IRPF. Es como si el loft te costara varios meses menos al año.
              </p>
              <p class="text-sm text-gray-700 mb-2">
                <strong>Compra con nosotros ({{ formatCurrency(valorInmueble) }}):</strong>
              </p>
              <p class="text-sm text-gray-700">
                Inyección de Liquidez: Hacienda te devuelve el 21% de IVA de la oficina: <strong>{{ formatCurrency(ivaRecuperableOficina) }}</strong> directos a tu cuenta. Deducción por Amortización: Restas unos 4.500 €/año de tus beneficios por el desgaste del inmueble. Resultado: Pagas la hipoteca con dinero que antes se iba en impuestos.
              </p>
            </div>

            <div class="rounded-xl border p-4 sm:p-5 bg-white" style="border-color: #C8D9B0">
              <h3 class="text-lg font-bold mb-3" style="color: #2793F2">ESCENARIO B: SOCIEDAD LIMITADA (SL)</h3>
              <p class="text-sm text-gray-700 mb-3">
                Facturación: <strong>{{ formatCurrency(facturacionAnual || 0) }}</strong> | Compra: <strong>{{ formatCurrency(valorInmueble) }}</strong>
              </p>
              <p class="text-sm text-gray-700 mb-2">
                <strong>Alquiler con nosotros:</strong> La SL deduce el 100% de la oficina (1.000 €/mes). Resultado: Reduces el beneficio de la empresa en 12.000 €, ahorrando en Impuesto de Sociedades y recuperando el IVA cada trimestre.
              </p>
              <p class="text-sm text-gray-700">
                <strong>Compra con nosotros:</strong> La sociedad adquiere el activo. Efecto Balance: Tu empresa ahora tiene un patrimonio de <strong>{{ formatCurrency(valorInmueble) }}</strong>. El 80% de la hipoteca, el IBI, la comunidad y los intereses son gastos que reducen tu beneficio neto, pagando el mínimo legal de impuestos mientras el inmueble se revaloriza.
              </p>
            </div>

            <div class="rounded-xl border p-4 sm:p-5 bg-white" style="border-color: #C8D9B0">
              <h3 class="text-lg font-bold mb-3" style="color: #0D0D0D">📉 Resumen: ¿Dónde prefieres que esté tu dinero?</h3>
              <p class="text-sm text-gray-600 mb-3">Si facturas {{ formatCurrency(facturacionAnual || 0) }}...</p>
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse" style="border-color: #C8D9B0">
                  <thead>
                    <tr style="background-color: #F2F2F2">
                      <th class="text-left py-2 px-3 border" style="border-color: #C8D9B0; color: #0D0D0D">Concepto</th>
                      <th class="text-left py-2 px-3 border" style="border-color: #C8D9B0; color: #0D0D0D">Sin nuestro modelo</th>
                      <th class="text-left py-2 px-3 border" style="border-color: #C8D9B0; color: #2793F2">Con Smart Loft 80/20</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="py-2 px-3 border text-gray-700" style="border-color: #C8D9B0">Gasto Vivienda</td>
                      <td class="py-2 px-3 border text-gray-700" style="border-color: #C8D9B0">No deducible (100% de tu bolsillo)</td>
                      <td class="py-2 px-3 border font-semibold" style="border-color: #C8D9B0; color: #0D0D0D">80% deducible como oficina</td>
                    </tr>
                    <tr>
                      <td class="py-2 px-3 border text-gray-700" style="border-color: #C8D9B0">IVA de Compra</td>
                      <td class="py-2 px-3 border text-gray-700" style="border-color: #C8D9B0">Lo pagas y lo pierdes</td>
                      <td class="py-2 px-3 border font-semibold" style="border-color: #C8D9B0; color: #0D0D0D">Recuperas {{ formatCurrency(ivaRecuperableOficina) }} (en oficina)</td>
                    </tr>
                    <tr>
                      <td class="py-2 px-3 border text-gray-700" style="border-color: #C8D9B0">Impuestos anuales</td>
                      <td class="py-2 px-3 border text-gray-700" style="border-color: #C8D9B0">Máximo tramo</td>
                      <td class="py-2 px-3 border font-semibold" style="border-color: #C8D9B0; color: #0D0D0D">Tramo reducido por gastos</td>
                    </tr>
                    <tr>
                      <td class="py-2 px-3 border text-gray-700" style="border-color: #C8D9B0">Movilidad</td>
                      <td class="py-2 px-3 border text-gray-700" style="border-color: #C8D9B0">Atado a una ciudad</td>
                      <td class="py-2 px-3 border font-semibold" style="border-color: #C8D9B0; color: #0D0D0D">Tokens para moverte por la red</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              type="button"
              @click="casoExitoModalOpen = false"
              class="px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
              style="background: linear-gradient(135deg, #C8D9B0, #2793F2); color: white"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  </component>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PublicPageLayout from '@/components/layout/PublicPageLayout.vue'
import type { Proyecto } from '@/types/proyecto'
import { insforge } from '@/lib/insforge'
import { getPhotoUrl } from '@/utils/storage'
import { amenityGroups, getAmenityIconSvg } from '@/utils/amenities'
import InstalacionesReservablesProyecto from '@/components/proyectos/InstalacionesReservablesProyecto.vue'

const props = withDefaults(
  defineProps<{
    backTo?: string
    backLabel?: string
    topPadding?: boolean
    proyectoId?: string
  }>(),
  {
    backTo: '/proyectos',
    backLabel: 'Volver a proyectos',
    topPadding: false,
    proyectoId: undefined,
  }
)

const route = useRoute()
const router = useRouter()

const isPublicRoute = computed(() => route.path.startsWith('/inversiones'))
const layoutComponent = computed(() => (isPublicRoute.value ? PublicPageLayout : AdminLayout))
const backTo = computed(() => (isPublicRoute.value ? '/inversiones' : (props.backTo ?? '/proyectos')))
const backLabel = computed(() => (isPublicRoute.value ? 'Volver a inversiones' : (props.backLabel ?? 'Volver a proyectos')))
const topPadding = computed(() => props.topPadding)

const proyecto = ref<Proyecto | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const lightboxOpen = ref(false)
const currentPhotoIndex = ref(0)
const reformaLightboxOpen = ref(false)
const currentReformaPhotoIndex = ref(0)
const reformaLightboxFotos = ref<string[]>([])
const casoExitoModalOpen = ref(false)
const facturacionAnual = ref<number>(80000)

let keyPressHandler: ((e: KeyboardEvent) => void) | null = null

const resolveProyectoId = (): string | null => {
  const fromProp = (props.proyectoId || '').trim()
  if (fromProp) return fromProp
  const fromRoute = route.params.id as string
  return fromRoute || null
}

const loadProyecto = async (id: string) => {
  loading.value = true
  error.value = null
  try {
    const { data, error: err } = await insforge.database
      .from('proyectos')
      .select()
      .eq('id', id)
      .single()

    if (err) {
      error.value = err.message || 'Error al cargar el proyecto'
      proyecto.value = null
      return
    }

    if (data) {
      proyecto.value = data as Proyecto
    } else {
      error.value = 'Proyecto no encontrado'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar el proyecto'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const proyectoId = resolveProyectoId()
  if (proyectoId) {
    await loadProyecto(proyectoId)
  } else {
    error.value = 'ID de proyecto no válido'
    loading.value = false
  }

  keyPressHandler = (e: KeyboardEvent) => {
    if (casoExitoModalOpen.value && e.key === 'Escape') {
      casoExitoModalOpen.value = false
    } else if (reformaLightboxOpen.value) {
      if (e.key === 'Escape') closeReformaLightbox()
      else if (e.key === 'ArrowRight') nextReformaPhoto()
      else if (e.key === 'ArrowLeft') previousReformaPhoto()
    } else if (lightboxOpen.value) {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowRight') nextPhoto()
      else if (e.key === 'ArrowLeft') previousPhoto()
    }
  }
  window.addEventListener('keydown', keyPressHandler)
})

watch(() => route.params.id, async (newId) => {
  const id = Array.isArray(newId) ? newId[0] : newId
  if (id && typeof id === 'string') await loadProyecto(id)
})

const mapsEmbedUrl = computed(() => {
  const q = encodeURIComponent(proyecto.value?.localizacion || '')
  return `https://www.google.com/maps?q=${q}&output=embed`
})

const mapsOpenUrl = computed(() => {
  const q = encodeURIComponent(proyecto.value?.localizacion || '')
  return `https://www.google.com/maps?q=${q}`
})

const valorInmueble = computed(() => Number(proyecto.value?.precio_unidad || 0))
const ivaRecuperableOficina = computed(() =>
  Math.round(valorInmueble.value * 0.8 * 0.21)
)
const baseReducidaAutonomo = computed(() => {
  const f = Number(facturacionAnual.value || 0)
  const deducibleOficina = 12000
  const deducibleVivienda = Math.round(200 * 12 * 0.3)
  return Math.max(0, f - deducibleOficina - deducibleVivienda)
})
const ahorroIrpfAprox = computed(() => {
  const f = Number(facturacionAnual.value || 0)
  const baseReducida = baseReducidaAutonomo.value
  const diferencia = f - baseReducida
  const tipoMedioAprox = 0.35
  return Math.round(diferencia * tipoMedioAprox)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

const FLEX_COMPLEMENTOS_LABEL: Record<string, string> = {
  aire_acondicionado: 'Aire acondicionado',
  internet_alta_velocidad: 'Internet Alta Velocidad',
  friega_platos: 'Friega platos',
  lavadora_secadora: 'Lavadora / secadora',
  tv_full_hd: 'TV Full HD',
}

function etiquetaComplementoFlexliving(key: string): string {
  return FLEX_COMPLEMENTOS_LABEL[key] || key
}

const getVideoUrl = (pathOrUrl: string): string => {
  if (pathOrUrl.startsWith('http')) return pathOrUrl
  const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL || import.meta.env.VITE_INSFORGE_URL || ''
  return `${baseUrl}/api/storage/buckets/photos/objects/${encodeURIComponent(pathOrUrl)}`
}

const isYoutubeUrl = (url: string): boolean => {
  return /youtube\.com|youtu\.be/i.test(url)
}

const isVimeoUrl = (url: string): boolean => {
  return /vimeo\.com/i.test(url)
}

const getVideoEmbedUrl = (url: string): string => {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return url
}

const openLightbox = (index: number) => {
  currentPhotoIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const nextPhoto = () => {
  if (proyecto.value?.fotos && currentPhotoIndex.value < proyecto.value.fotos.length - 1) {
    currentPhotoIndex.value++
  } else if (proyecto.value?.fotos) {
    currentPhotoIndex.value = 0
  }
}

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  } else if (proyecto.value?.fotos) {
    currentPhotoIndex.value = proyecto.value.fotos.length - 1
  }
}

const openReformaLightbox = (index: number, tipo: 'actual' | 'remodelada') => {
  const fotos = tipo === 'actual'
    ? proyecto.value?.fotos_oficina_actual
    : proyecto.value?.fotos_oficina_remodelada
  if (fotos?.length) {
    reformaLightboxFotos.value = fotos
    currentReformaPhotoIndex.value = index
    reformaLightboxOpen.value = true
  }
}

const closeReformaLightbox = () => {
  reformaLightboxOpen.value = false
}

const nextReformaPhoto = () => {
  if (currentReformaPhotoIndex.value < reformaLightboxFotos.value.length - 1) {
    currentReformaPhotoIndex.value++
  } else {
    currentReformaPhotoIndex.value = 0
  }
}

const previousReformaPhoto = () => {
  if (currentReformaPhotoIndex.value > 0) {
    currentReformaPhotoIndex.value--
  } else {
    currentReformaPhotoIndex.value = reformaLightboxFotos.value.length - 1
  }
}

const editProyecto = () => {
  if (proyecto.value?.id) {
    router.push(`/proyectos/${proyecto.value.id}/editar`)
  }
}

const deleteProyecto = async () => {
  if (!proyecto.value?.id) return

  if (confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
    try {
      await insforge.database.from('proyectos').delete().eq('id', proyecto.value.id)
      router.push('/proyectos')
    } catch (err) {
      console.error('Error al eliminar proyecto', err)
      alert('Error al eliminar el proyecto')
    }
  }
}

onUnmounted(() => {
  if (keyPressHandler) {
    window.removeEventListener('keydown', keyPressHandler)
  }
})
</script>

<style scoped>
img {
  transition: transform 0.3s ease;
}

.modern-gallery {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
  margin-bottom: 1rem;
}

.gallery-main-image {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
}

.gallery-side-grid {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
}

.gallery-side-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 12px;
}

@media (min-width: 768px) {
  .modern-gallery {
    grid-template-columns: 7fr 3fr;
  }

  .gallery-main-image {
    height: 100%;
    min-height: 420px;
  }

  .gallery-side-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }

  .gallery-side-image {
    height: 100%;
  }
}

@media (min-width: 1024px) {
  .gallery-side-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, 1fr);
  }
}

.gallery-thumbnails {
  scrollbar-width: thin;
  scrollbar-color: #C8D9B0 #F2F2F2;
}

.gallery-thumbnails::-webkit-scrollbar {
  height: 6px;
}

.gallery-thumbnails::-webkit-scrollbar-track {
  background: #F2F2F2;
  border-radius: 3px;
}

.gallery-thumbnails::-webkit-scrollbar-thumb {
  background: #C8D9B0;
  border-radius: 3px;
}

.gallery-thumbnails::-webkit-scrollbar-thumb:hover {
  background: #2793F2;
}

.gallery-thumbnail {
  width: 100px;
  height: 70px;
  overflow: hidden;
  border-radius: 8px;
  border: 3px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  background: none;
  padding: 0;
}

.gallery-thumbnail:hover {
  border-color: #2793F2;
  transform: scale(1.05);
}

.gallery-thumbnail.active {
  border-color: #2793F2;
  box-shadow: 0 0 0 1px #2793F2;
}
</style>
