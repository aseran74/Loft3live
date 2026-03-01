import { ref } from 'vue'

declare global {
  interface Window {
    google?: unknown
    __googlePlacesCallback?: () => void
  }
}

const scriptLoaded = ref(false)

interface GoogleMapsPlaces {
  maps: {
    places: {
      Autocomplete: new (
        input: HTMLInputElement,
        opts: { types?: string[]; fields?: string[] }
      ) => {
        getPlace: () => { formatted_address?: string }
        addListener: (event: string, fn: () => void) => void
      }
    }
  }
}

export function useGooglePlaces() {
  function loadScript(): Promise<void> {
    const g = (typeof window !== 'undefined' && window.google) as GoogleMapsPlaces | undefined
    if (scriptLoaded.value || g?.maps?.places) {
      scriptLoaded.value = true
      return Promise.resolve()
    }
    const key = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
    if (!key) return Promise.reject(new Error('Falta VITE_GOOGLE_PLACES_API_KEY en .env'))

    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existing) {
        scriptLoaded.value = true
        resolve()
        return
      }
      window.__googlePlacesCallback = () => {
        scriptLoaded.value = true
        resolve()
      }
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=__googlePlacesCallback`
      script.async = true
      script.defer = true
      script.onerror = () => reject(new Error('Error al cargar Google Maps'))
      document.head.appendChild(script)
    })
  }

  function initAutocomplete(
    input: HTMLInputElement,
    options: { onPlaceSelect: (address: string) => void; types?: string[] }
  ) {
    const g = window.google as GoogleMapsPlaces | undefined
    if (!g?.maps?.places) return
    const autocomplete = new g.maps.places.Autocomplete(input, {
      types: options.types ?? ['address'],
      fields: ['formatted_address', 'address_components', 'geometry'],
    })
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      const addr = place.formatted_address ?? ''
      if (addr) options.onPlaceSelect(addr)
    })
  }

  return { loadScript, initAutocomplete, scriptLoaded }
}
