/**
 * Carga dinámicamente el script de Google Maps
 * NOTA: El script principal se carga en index.html (replicado de RentoQ)
 * Esta función verifica que esté disponible o carga una versión alternativa
 * con la API key de VITE_GOOGLE_MAPS_API_KEY si es necesario
 */

let googleMapsScriptLoaded = false;
let googleMapsScriptLoading = false;
let googleMapsScriptPromise: Promise<void> | null = null;

export async function loadGoogleMapsScript(): Promise<void> {
  // Si ya está cargado, retornar inmediatamente
  if (googleMapsScriptLoaded) {
    return;
  }

  // Si ya se está cargando, retornar la promesa existente
  if (googleMapsScriptLoading && googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  // Si ya existe el objeto window.google.maps, marcar como cargado
  if (window.google && window.google.maps) {
    googleMapsScriptLoaded = true;
    return;
  }

  googleMapsScriptLoading = true;

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    // Check once more before attempting to load
    if (window.google && window.google.maps) {
      googleMapsScriptLoaded = true;
      googleMapsScriptLoading = false;
      resolve();
      return;
    }

    // Try to load alternative script if main one didn't load
    // This would use VITE_GOOGLE_MAPS_API_KEY if configured
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (apiKey) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        googleMapsScriptLoaded = true;
        googleMapsScriptLoading = false;
        resolve();
      };

      script.onerror = () => {
        googleMapsScriptLoading = false;
        const error = new Error('Failed to load Google Maps script');
        console.error(error);
        reject(error);
      };

      document.head.appendChild(script);
    } else {
      // No custom API key, wait for index.html script to load
      const checkGoogle = () => {
        if (window.google && window.google.maps) {
          googleMapsScriptLoaded = true;
          googleMapsScriptLoading = false;
          resolve();
        } else {
          setTimeout(checkGoogle, 100);
        }
      };
      checkGoogle();
    }
  });

  return googleMapsScriptPromise;
}

/**
 * Comprueba si Google Maps está disponible
 */
export function isGoogleMapsLoaded(): boolean {
  return googleMapsScriptLoaded && !!window.google?.maps;
}

/**
 * Obtiene la promesa de carga si está en progreso
 */
export function getGoogleMapsLoadingPromise(): Promise<void> | null {
  return googleMapsScriptPromise;
}
