<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <!-- Nombre del proyecto -->
      <div>
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Nombre del proyecto *
        </label>
        <input
          v-model="formData.nombre_proyecto"
          type="text"
          required
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Localización (Google Places) -->
      <div>
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Localización *
        </label>
        <GooglePlacesInput
          v-model="formData.localizacion"
          placeholder="Buscar dirección o lugar..."
          :required="true"
        />
      </div>

      <!-- Localidad -->
      <div>
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Localidad
        </label>
        <select
          v-model="localidadModel"
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">— Sin asignar —</option>
          <option value="Málaga">Málaga</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Valencia">Valencia</option>
          <option value="Madrid">Madrid</option>
        </select>
        <p class="mt-1 text-xs text-gray-500">Ciudad para filtros en canje de puntos.</p>
      </div>

      <!-- Google Street View -->
      <div class="md:col-span-2">
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Vista de calle (Google Street View)
        </label>
        <textarea
          v-model="formData.street_view_embed"
          rows="3"
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Pega el iframe de Google Maps o la URL src"
        />
      </div>

      <!-- Permisos -->
      <div>
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Permisos
        </label>
        <textarea
          v-model="formData.permisos"
          rows="3"
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Características -->
      <div class="md:col-span-2">
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Características
        </label>
        <textarea
          v-model="formData.caracteristicas"
          rows="4"
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Descripción de las características del proyecto..."
        />
      </div>

      <!-- Nº de lofts -->
      <div>
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Nº de lofts *
        </label>
        <input
          v-model.number="formData.num_lofts"
          type="number"
          min="1"
          required
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Desglose inversión -->
      <div class="md:col-span-2 rounded-xl border p-4 bg-white dark:bg-gray-800" style="border-color: #C8D9B0">
        <h3 class="text-sm sm:text-base font-semibold mb-3 text-gray-800 dark:text-white">
          Desglose inversión y tickets
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">Precio compra (EUR)</label>
            <input
              v-model.number="formData.precio_compra"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">Precio reforma (EUR)</label>
            <input
              v-model.number="formData.precio_reforma"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">Licencias (EUR)</label>
            <input
              v-model.number="formData.licencias"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-700/50" style="border-color: #C8D9B0">
            <div class="text-xs text-gray-500">Comisión 2%</div>
            <div class="text-sm font-semibold text-gray-800 dark:text-white">{{ comisionTotal.toFixed(2) }} €</div>
          </div>
          <div class="rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-700/50" style="border-color: #C8D9B0">
            <div class="text-xs text-gray-500">Suma total</div>
            <div class="text-sm font-semibold text-gray-800 dark:text-white">{{ sumaTotal.toFixed(2) }} €</div>
          </div>
          <div class="rounded-lg border px-3 py-2 bg-gray-50 dark:bg-gray-700/50" style="border-color: #C8D9B0">
            <div class="text-xs text-gray-500">Tickets disponibles ({{ TICKET_EUR }} €)</div>
            <div class="text-sm font-semibold text-gray-800 dark:text-white">{{ ticketsDisponibles }}</div>
          </div>
        </div>
      </div>

      <!-- Checkboxes -->
      <div>
        <label class="flex items-center gap-2 text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          <input v-model="formData.alquiler" type="checkbox" class="w-4 h-4 rounded border-gray-300 accent-brand-500" />
          Disponible para alquiler
        </label>
      </div>
      <div>
        <label class="flex items-center gap-2 text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          <input v-model="formData.mostrar_en_landing" type="checkbox" class="w-4 h-4 rounded border-gray-300 accent-brand-500" />
          Mostrar en landing page
        </label>
      </div>
      <div>
        <label class="flex items-center gap-2 text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          <input v-model="formData.consulta_vinculante_urbanistica" type="checkbox" class="w-4 h-4 rounded border-gray-300 accent-brand-500" />
          Consulta vinculante urbanística
        </label>
      </div>
      <div>
        <label class="flex items-center gap-2 text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          <input v-model="formData.vendido_cerrado" type="checkbox" class="w-4 h-4 rounded border-gray-300 accent-brand-500" />
          Proyecto cerrado y vendido
        </label>
      </div>

      <!-- Precio alquiler -->
      <div v-if="formData.alquiler">
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Precio alquiler (EUR/mes)
        </label>
        <input
          v-model.number="formData.precio_alquiler_mes"
          type="number"
          step="0.01"
          min="0"
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Gasto comunidad -->
      <div>
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Gasto estimado comunidad (EUR)
        </label>
        <input
          v-model.number="formData.gasto_estimado_comunidad"
          type="number"
          step="0.01"
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Tipo inversión -->
      <div>
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Tipo de inversión *
        </label>
        <select
          v-model="formData.tipo_inversion"
          required
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="Quarterly Bullet">Quarterly Bullet</option>
          <option value="Monthly">Monthly</option>
          <option value="Annual">Annual</option>
        </select>
      </div>

      <!-- Porcentaje llegado -->
      <div>
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Porcentaje llegado (%)
        </label>
        <input
          v-model.number="formData.porcentaje_llegado"
          type="number"
          min="0"
          max="100"
          step="0.01"
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Mín. término -->
      <div>
        <label class="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-800 dark:text-gray-200">
          Mín. término (meses) *
        </label>
        <input
          v-model.number="formData.min_termino_meses"
          type="number"
          min="1"
          required
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>
    </div>

    <!-- Unidades disponibles (4 tipos) -->
    <div class="mt-4 sm:mt-6">
      <label class="block text-xs sm:text-sm font-medium mb-3 text-gray-800 dark:text-gray-200">
        Unidades disponibles (hasta 4 tipos)
      </label>
      <div class="space-y-4">
        <div
          v-for="(tipo, idx) in unidadTipos"
          :key="idx"
          class="rounded-xl border p-4 bg-white dark:bg-gray-800"
          style="border-color: #C8D9B0"
        >
          <h3 class="text-sm font-semibold mb-3 text-gray-800 dark:text-white">Tipo {{ idx + 1 }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">Nombre</label>
              <input
                v-model="tipo.nombre"
                type="text"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                placeholder="Ej: Estándar / Ático"
              />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">Precio (EUR)</label>
              <input
                v-model.number="tipo.precio"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">m²</label>
              <input
                v-model.number="tipo.m2"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
          </div>
          <div v-if="formData.vendido_cerrado" class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/30">
            <div>
              <label class="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">Unidades totales</label>
              <input v-model.number="tipo.unidades_totales" type="number" min="0" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">Precio alquiler (EUR/mes)</label>
              <input v-model.number="tipo.precio_alquiler" type="number" min="0" step="0.01" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1 text-gray-800 dark:text-gray-200">Gestionados por plataforma</label>
              <input v-model.number="tipo.alquilados" type="number" min="0" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comodidades -->
    <div class="mt-4 sm:mt-6">
      <div class="flex flex-wrap gap-2 mb-3">
        <button type="button" class="text-xs px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" @click="selectAllAmenities">
          Seleccionar todo
        </button>
        <button type="button" class="text-xs px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" @click="clearAmenities">
          Limpiar
        </button>
      </div>
      <div class="space-y-4">
        <div v-for="group in amenityGroups" :key="group.title" class="rounded-xl border p-4 bg-white dark:bg-gray-800" style="border-color: #C8D9B0">
          <h3 class="text-sm font-semibold mb-3 text-gray-800 dark:text-white">{{ group.title }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              v-for="item in group.items"
              :key="item.key"
              class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
              style="border-color: #C8D9B0"
            >
              <input type="checkbox" :checked="isAmenitySelected(item.key)" @change="toggleAmenity(item.key)" class="rounded accent-brand-500" />
              <span class="text-sm text-gray-800 dark:text-gray-200">{{ item.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

      <!-- Complementos Flexliving -->
      <div class="mt-4 sm:mt-6">
        <h3 class="text-sm font-semibold mb-3 text-gray-800 dark:text-white">Complementos Flexliving</h3>
        <div class="flex flex-wrap gap-2 mb-3">
          <button type="button" class="text-xs px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" @click="selectAllComplementos">
            Seleccionar todo
          </button>
          <button type="button" class="text-xs px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" @click="clearComplementos">
            Limpiar
          </button>
        </div>
        <div class="rounded-xl border p-4 bg-white dark:bg-gray-800" style="border-color: #C8D9B0">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              v-for="c in flexComplementos"
              :key="c.key"
              class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
              style="border-color: #C8D9B0"
            >
              <input type="checkbox" :checked="isComplementoSelected(c.key)" @change="toggleComplemento(c.key)" class="rounded accent-brand-500" />
              <span class="text-sm text-gray-800 dark:text-gray-200">{{ c.label }}</span>
            </label>
          </div>
        </div>
      </div>

    <!-- 1. Fotos antes de la reforma (oficina) -->
    <div class="mt-4 sm:mt-6">
      <label class="block text-xs sm:text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Fotos antes de la reforma (oficina)</label>
      <div class="mb-4">
        <input ref="fileInputOficinaActual" type="file" accept="image/*" multiple class="hidden" @change="(e) => handleFileSelectFor(e, 'oficina_actual')" />
        <button type="button" @click="fileInputOficinaActual?.click()" class="px-4 py-2 border-2 border-dashed rounded-lg font-medium text-brand-500 hover:opacity-70 border-brand-500">+ Agregar fotos</button>
      </div>
      <div v-if="(formData.fotos_oficina_actual?.length ?? 0) > 0 || uploadedPhotosOficinaActual.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div v-for="(photo, index) in (formData.fotos_oficina_actual || [])" :key="`oa-e-${index}`" class="relative group">
          <img :src="getPhotoUrl(photo)" alt="" class="w-full h-24 sm:h-32 object-cover rounded-lg" />
          <button type="button" @click="removeExistingPhotoIn('fotos_oficina_actual', index)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
        </div>
        <div v-for="(photo, index) in uploadedPhotosOficinaActual" :key="`oa-n-${index}`" class="relative group">
          <img :src="photo.preview" alt="" class="w-full h-24 sm:h-32 object-cover rounded-lg" />
          <button type="button" @click="uploadedPhotosOficinaActual.splice(index, 1)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
        </div>
      </div>
    </div>

    <!-- 2. Fotos después de la reforma (convertido en loft) -->
    <div class="mt-4 sm:mt-6">
      <label class="block text-xs sm:text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Fotos después de la reforma (convertido en loft)</label>
      <div class="mb-4">
        <input ref="fileInputOficinaRemodelada" type="file" accept="image/*" multiple class="hidden" @change="(e) => handleFileSelectFor(e, 'oficina_remodelada')" />
        <button type="button" @click="fileInputOficinaRemodelada?.click()" class="px-4 py-2 border-2 border-dashed rounded-lg font-medium text-brand-500 hover:opacity-70 border-brand-500">+ Agregar fotos</button>
      </div>
      <div v-if="(formData.fotos_oficina_remodelada?.length ?? 0) > 0 || uploadedPhotosOficinaRemodelada.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div v-for="(photo, index) in (formData.fotos_oficina_remodelada || [])" :key="`or-e-${index}`" class="relative group">
          <img :src="getPhotoUrl(photo)" alt="" class="w-full h-24 sm:h-32 object-cover rounded-lg" />
          <button type="button" @click="removeExistingPhotoIn('fotos_oficina_remodelada', index)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
        </div>
        <div v-for="(photo, index) in uploadedPhotosOficinaRemodelada" :key="`or-n-${index}`" class="relative group">
          <img :src="photo.preview" alt="" class="w-full h-24 sm:h-32 object-cover rounded-lg" />
          <button type="button" @click="uploadedPhotosOficinaRemodelada.splice(index, 1)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
        </div>
      </div>
    </div>

    <!-- 3. Fotos apartamento -->
    <div class="mt-4 sm:mt-6">
      <label class="block text-xs sm:text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Fotos apartamento</label>
      <div class="mb-4">
        <input ref="fileInput" type="file" accept="image/*" multiple @change="(e) => handleFileSelectFor(e, 'fotos')" class="hidden" />
        <button type="button" @click="fileInput?.click()" class="px-4 py-2 border-2 border-dashed rounded-lg font-medium text-brand-500 hover:opacity-70 border-brand-500">+ Agregar fotos</button>
      </div>
      <div v-if="uploadedPhotos.length > 0 || existingPhotos.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div v-for="(photo, index) in existingPhotos" :key="`e-${index}`" class="relative group">
          <img :src="getPhotoUrl(photo)" :alt="`Foto ${index + 1}`" class="w-full h-24 sm:h-32 object-cover rounded-lg" />
          <button type="button" @click="removeExistingPhoto(index)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
        </div>
        <div v-for="(photo, index) in uploadedPhotos" :key="`n-${index}`" class="relative group">
          <img :src="photo.preview" :alt="`Nueva ${index + 1}`" class="w-full h-24 sm:h-32 object-cover rounded-lg" />
          <button type="button" @click="removePhoto(index)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
        </div>
      </div>
    </div>

    <!-- 4. Fotos instalaciones comunes -->
    <div class="mt-4 sm:mt-6">
      <label class="block text-xs sm:text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Fotos instalaciones comunes</label>
      <div class="mb-4">
        <input ref="fileInputInstalaciones" type="file" accept="image/*" multiple class="hidden" @change="(e) => handleFileSelectFor(e, 'instalaciones')" />
        <button type="button" @click="fileInputInstalaciones?.click()" class="px-4 py-2 border-2 border-dashed rounded-lg font-medium text-brand-500 hover:opacity-70 border-brand-500">+ Agregar fotos</button>
      </div>
      <div v-if="(formData.fotos_instalaciones_comunes?.length ?? 0) > 0 || uploadedPhotosInstalaciones.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div v-for="(photo, index) in (formData.fotos_instalaciones_comunes || [])" :key="`in-e-${index}`" class="relative group">
          <img :src="getPhotoUrl(photo)" alt="" class="w-full h-24 sm:h-32 object-cover rounded-lg" />
          <button type="button" @click="removeExistingPhotoIn('fotos_instalaciones_comunes', index)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
        </div>
        <div v-for="(photo, index) in uploadedPhotosInstalaciones" :key="`in-n-${index}`" class="relative group">
          <img :src="photo.preview" alt="" class="w-full h-24 sm:h-32 object-cover rounded-lg" />
          <button type="button" @click="uploadedPhotosInstalaciones.splice(index, 1)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
        </div>
      </div>
    </div>

    <!-- Videos -->
    <div class="mt-4 sm:mt-6">
      <label class="block text-xs sm:text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Videos del proyecto</label>
      <div class="flex flex-wrap gap-2 mb-3">
        <input
          v-model="newVideoUrl"
          type="url"
          placeholder="https://..."
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
          @keydown.enter.prevent="addVideo"
        />
        <button type="button" @click="addVideo" class="px-4 py-2 rounded-lg font-medium text-sm bg-brand-500 text-white hover:opacity-90">
          + Añadir vídeo
        </button>
      </div>
      <div v-if="formData.videos?.length > 0" class="space-y-2">
        <div v-for="(url, index) in formData.videos" :key="index" class="flex items-center gap-2 py-2 px-3 rounded-lg border bg-gray-50 dark:bg-gray-800">
          <span class="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">{{ url }}</span>
          <button type="button" @click="removeVideo(index)" class="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-1">×</button>
        </div>
      </div>
    </div>

    <!-- Instalaciones reservables (solo al editar): arriba de los botones para que Cancelar/Actualizar queden al final -->
    <div v-if="proyecto?.id" class="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
      <InstalacionesReservablesProyecto :proyecto-id="proyecto.id" />
    </div>

    <!-- Botones al final -->
    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 mt-6">
      <button type="button" @click="$emit('cancel')" class="px-6 py-2 border-2 rounded-lg font-semibold border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
        Cancelar
      </button>
      <button type="submit" :disabled="loading" class="px-6 py-2 rounded-lg font-semibold bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50">
        {{ loading ? 'Guardando...' : (proyecto?.id ? 'Actualizar' : 'Crear') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Proyecto, UnidadTipo } from '@/types/proyecto'
import { amenityGroups, type AmenityKey } from '@/utils/amenities'
import GooglePlacesInput from '@/components/common/GooglePlacesInput.vue'
import InstalacionesReservablesProyecto from '@/components/proyectos/InstalacionesReservablesProyecto.vue'
import { getPhotoUrl } from '@/utils/storage'

const props = defineProps<{
  proyecto?: Proyecto | null
  loading?: boolean
}>()

import type { PhotoFilesPayload } from '@/types/proyecto'

const emit = defineEmits<{
  submit: [data: Omit<Proyecto, 'id' | 'created_at' | 'updated_at'>, photoFiles: PhotoFilesPayload]
  cancel: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const fileInputOficinaActual = ref<HTMLInputElement | null>(null)
const fileInputOficinaRemodelada = ref<HTMLInputElement | null>(null)
const fileInputInstalaciones = ref<HTMLInputElement | null>(null)
const uploadedPhotos = ref<Array<{ file: File; preview: string }>>([])
const uploadedPhotosOficinaActual = ref<Array<{ file: File; preview: string }>>([])
const uploadedPhotosOficinaRemodelada = ref<Array<{ file: File; preview: string }>>([])
const uploadedPhotosInstalaciones = ref<Array<{ file: File; preview: string }>>([])
const existingPhotos = ref<string[]>([])
const newVideoUrl = ref('')

type UnidadTipoForm = {
  nombre: string
  precio: number
  m2: number | null
  planos: string[]
  nuevosPlanos: File[]
  unidades_totales?: number
  precio_alquiler?: number
  alquilados?: number
}

const formData = ref<Omit<Proyecto, 'id' | 'created_at' | 'updated_at'>>({
  nombre_proyecto: '',
  objetivo_inversion_total: 0,
  localizacion: '',
  localidad: null,
  permisos: '',
  num_lofts: 0,
  precio_unidad: 0,
  precio_compra: 0,
  precio_reforma: 0,
  licencias: 0,
  gasto_estimado_comunidad: 0,
  tipo_inversion: 'Quarterly Bullet',
  porcentaje_llegado: 0,
  min_termino_meses: 24,
  monto_restante: 0,
  alquiler: false,
  precio_alquiler_mes: undefined,
  mostrar_en_landing: false,
  consulta_vinculante_urbanistica: false,
  vendido_cerrado: false,
  caracteristicas: '',
  fotos: [],
  fotos_oficina_actual: [],
  fotos_oficina_remodelada: [],
  fotos_instalaciones_comunes: [],
  videos: [],
  street_view_embed: '',
  comodidades: [],
  complementos_flexliving: [],
  unidades_tipos: [],
})

const unidadTipos = ref<UnidadTipoForm[]>([
  { nombre: 'Tipo 1', precio: 0, m2: null, planos: [], nuevosPlanos: [] },
  { nombre: 'Tipo 2', precio: 0, m2: null, planos: [], nuevosPlanos: [] },
  { nombre: 'Tipo 3', precio: 0, m2: null, planos: [], nuevosPlanos: [] },
  { nombre: 'Tipo 4', precio: 0, m2: null, planos: [], nuevosPlanos: [] },
])

const localidadModel = computed({
  get: () => formData.value.localidad ?? '',
  set: (v: string) => { formData.value.localidad = (v?.trim()) || null },
})

const TICKET_EUR = 5000
const COMISION_PORCENTAJE = 0.02
const baseInversion = computed(() => {
  const c = Number(formData.value.precio_compra || 0)
  const r = Number(formData.value.precio_reforma || 0)
  const l = Number(formData.value.licencias || 0)
  return c + r + l
})
const comisionTotal = computed(() => baseInversion.value * COMISION_PORCENTAJE)
const sumaTotal = computed(() => baseInversion.value + comisionTotal.value)
const ticketsDisponibles = computed(() => Math.floor(sumaTotal.value / TICKET_EUR))

const isAmenitySelected = (key: AmenityKey) => (formData.value.comodidades || []).includes(key)
const toggleAmenity = (key: AmenityKey) => {
  const arr = [...(formData.value.comodidades || [])]
  const i = arr.indexOf(key)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(key)
  formData.value.comodidades = arr
}
const selectAllAmenities = () => {
  formData.value.comodidades = amenityGroups.flatMap((g) => g.items.map((i) => i.key))
}
const clearAmenities = () => { formData.value.comodidades = [] }

const flexComplementos = [
  { key: 'aire_acondicionado', label: 'Aire acondicionado' },
  { key: 'internet_alta_velocidad', label: 'Internet Alta Velocidad' },
  { key: 'friega_platos', label: 'Friega platos' },
  { key: 'lavadora_secadora', label: 'Lavadora / secadora' },
  { key: 'tv_full_hd', label: 'TV Full HD' },
] as const
type FlexComplementoKey = (typeof flexComplementos)[number]['key']

const isComplementoSelected = (key: FlexComplementoKey) => (formData.value.complementos_flexliving || []).includes(key)
const toggleComplemento = (key: FlexComplementoKey) => {
  const arr = [...(formData.value.complementos_flexliving || [])]
  const i = arr.indexOf(key)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(key)
  formData.value.complementos_flexliving = arr
}
const selectAllComplementos = () => {
  formData.value.complementos_flexliving = flexComplementos.map((c) => c.key)
}
const clearComplementos = () => { formData.value.complementos_flexliving = [] }


function handleFileSelectFor(e: Event, section: 'fotos' | 'oficina_actual' | 'oficina_remodelada' | 'instalaciones') {
  const target = e.target as HTMLInputElement
  if (!target.files) return
  const list =
    section === 'fotos' ? uploadedPhotos :
    section === 'oficina_actual' ? uploadedPhotosOficinaActual :
    section === 'oficina_remodelada' ? uploadedPhotosOficinaRemodelada :
    uploadedPhotosInstalaciones
  Array.from(target.files).forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => list.value.push({ file, preview: (ev.target?.result as string) || '' })
      reader.readAsDataURL(file)
    }
  })
  target.value = ''
}
const removePhoto = (i: number) => uploadedPhotos.value.splice(i, 1)
const removeExistingPhoto = (i: number) => {
  existingPhotos.value.splice(i, 1)
  formData.value.fotos = [...existingPhotos.value]
}
function removeExistingPhotoIn(
  field: 'fotos_oficina_actual' | 'fotos_oficina_remodelada' | 'fotos_instalaciones_comunes',
  index: number
) {
  const arr = [...(formData.value[field] || [])]
  arr.splice(index, 1)
  formData.value[field] = arr
}
const addVideo = () => {
  const url = newVideoUrl.value?.trim()
  if (!url) return
  formData.value.videos = [...(formData.value.videos || []), url]
  newVideoUrl.value = ''
}
const removeVideo = (i: number) => {
  const arr = [...(formData.value.videos || [])]
  arr.splice(i, 1)
  formData.value.videos = arr
}

function extractStreetViewSrc(v: string | undefined): string {
  if (!v?.trim()) return ''
  const m = v.trim().match(/src=["']([^"']+)["']/i)
  if (m) return m[1]
  return v.startsWith('http') ? v : v
}

function buildUnidadesTipos(): UnidadTipo[] {
  return unidadTipos.value.map((t, i) => ({
    nombre: (t.nombre || `Tipo ${i + 1}`).trim(),
    precio: Number(t.precio || 0),
    m2: t.m2 ?? undefined,
    planos: t.planos || [],
    ...(formData.value.vendido_cerrado && {
      unidades_totales: t.unidades_totales,
      precio_alquiler: t.precio_alquiler,
      alquilados: t.alquilados,
    }),
  }))
}

watch(() => props.proyecto, (p) => {
  if (p) {
    formData.value = {
      nombre_proyecto: p.nombre_proyecto,
      objetivo_inversion_total: p.objetivo_inversion_total ?? 0,
      localizacion: p.localizacion,
      localidad: p.localidad ?? null,
      permisos: p.permisos || '',
      num_lofts: p.num_lofts,
      precio_unidad: p.precio_unidad ?? 0,
      precio_compra: p.precio_compra ?? 0,
      precio_reforma: p.precio_reforma ?? 0,
      licencias: p.licencias ?? 0,
      gasto_estimado_comunidad: p.gasto_estimado_comunidad ?? 0,
      tipo_inversion: p.tipo_inversion,
      porcentaje_llegado: p.porcentaje_llegado ?? 0,
      min_termino_meses: p.min_termino_meses,
      monto_restante: p.monto_restante ?? 0,
      alquiler: p.alquiler ?? false,
      precio_alquiler_mes: p.precio_alquiler_mes,
      mostrar_en_landing: p.mostrar_en_landing ?? false,
      consulta_vinculante_urbanistica: p.consulta_vinculante_urbanistica ?? false,
      vendido_cerrado: p.vendido_cerrado ?? false,
      caracteristicas: p.caracteristicas || '',
      fotos: Array.isArray(p.fotos) ? p.fotos : [],
      fotos_oficina_actual: Array.isArray(p.fotos_oficina_actual) ? p.fotos_oficina_actual : [],
      fotos_oficina_remodelada: Array.isArray(p.fotos_oficina_remodelada) ? p.fotos_oficina_remodelada : [],
      fotos_instalaciones_comunes: Array.isArray(p.fotos_instalaciones_comunes) ? p.fotos_instalaciones_comunes : [],
      videos: Array.isArray(p.videos) ? p.videos : [],
      street_view_embed: p.street_view_embed || '',
      comodidades: Array.isArray(p.comodidades) ? p.comodidades : [],
      complementos_flexliving: Array.isArray(p.complementos_flexliving) ? p.complementos_flexliving : [],
      unidades_tipos: Array.isArray(p.unidades_tipos) ? p.unidades_tipos : [],
    }
    existingPhotos.value = Array.isArray(p.fotos) ? p.fotos : []
    const ut = Array.isArray(p.unidades_tipos) ? p.unidades_tipos : []
    unidadTipos.value = [0, 1, 2, 3].map((i) => {
      const u = ut[i] || {}
      return {
        nombre: (u as UnidadTipo).nombre || `Tipo ${i + 1}`,
        precio: Number((u as UnidadTipo).precio || 0),
        m2: (u as UnidadTipo).m2 ?? null,
        planos: (u as UnidadTipo).planos || [],
        nuevosPlanos: [],
        unidades_totales: (u as UnidadTipo).unidades_totales,
        precio_alquiler: (u as UnidadTipo).precio_alquiler,
        alquilados: (u as UnidadTipo).alquilados,
      }
    })
  } else {
    formData.value = { ...formData.value, nombre_proyecto: '', localizacion: '', localidad: null, permisos: '', num_lofts: 0, precio_compra: 0, precio_reforma: 0, licencias: 0, caracteristicas: '', fotos: [], fotos_oficina_actual: [], fotos_oficina_remodelada: [], fotos_instalaciones_comunes: [], videos: [], street_view_embed: '', comodidades: [], complementos_flexliving: [], unidades_tipos: [] }
    existingPhotos.value = []
    uploadedPhotos.value = []
    uploadedPhotosOficinaActual.value = []
    uploadedPhotosOficinaRemodelada.value = []
    uploadedPhotosInstalaciones.value = []
    newVideoUrl.value = ''
    unidadTipos.value = [
      { nombre: 'Tipo 1', precio: 0, m2: null, planos: [], nuevosPlanos: [] },
      { nombre: 'Tipo 2', precio: 0, m2: null, planos: [], nuevosPlanos: [] },
      { nombre: 'Tipo 3', precio: 0, m2: null, planos: [], nuevosPlanos: [] },
      { nombre: 'Tipo 4', precio: 0, m2: null, planos: [], nuevosPlanos: [] },
    ]
  }
}, { immediate: true })

const handleSubmit = () => {
  formData.value.street_view_embed = extractStreetViewSrc(formData.value.street_view_embed)
  formData.value.unidades_tipos = buildUnidadesTipos()
  formData.value.objetivo_inversion_total = sumaTotal.value
  const precios = unidadTipos.value.map((t) => Number(t.precio) || 0).filter((p) => p > 0)
  formData.value.precio_unidad = precios.length ? Math.min(...precios) : 0
  const photoFiles: PhotoFilesPayload = {
    fotos: uploadedPhotos.value.map((p) => p.file),
    fotos_oficina_actual: uploadedPhotosOficinaActual.value.map((p) => p.file),
    fotos_oficina_remodelada: uploadedPhotosOficinaRemodelada.value.map((p) => p.file),
    fotos_instalaciones_comunes: uploadedPhotosInstalaciones.value.map((p) => p.file),
  }
  emit('submit', formData.value, photoFiles)
}
</script>
