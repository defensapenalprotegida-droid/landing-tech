/**
 * Utilitario para verificar la configuración de Google Maps
 * Úsalo durante desarrollo para diagnosticar problemas
 */

export function verifyGoogleMapsConfig(): {
  isConfigured: boolean;
  apiKey: string | null;
  apiLoaded: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Verificar API key
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    errors.push(
      "VITE_GOOGLE_MAPS_API_KEY no está configurada. Ve a docs/GOOGLE_MAPS_SETUP.md"
    );
  } else if (apiKey === "your_api_key_here") {
    errors.push(
      "VITE_GOOGLE_MAPS_API_KEY aún tiene el valor placeholder. Reemplázalo con tu API key real."
    );
  }

  // Verificar si Google Maps está cargado
  const apiLoaded = !!window.google?.maps;

  if (!apiLoaded && !errors.length) {
    warnings.push(
      "Google Maps API aún no ha sido cargado. Esto es normal si el script se está cargando aún."
    );
  }

  // Verificar si Places está disponible
  if (apiLoaded && !window.google?.maps?.places) {
    warnings.push(
      "Google Maps API cargado pero Places API no está disponible. Verifica que 'places' está en las librerías."
    );
  }

  const isConfigured = !errors.length && !!apiKey && apiLoaded;

  return {
    isConfigured,
    apiKey: apiKey || null,
    apiLoaded,
    errors,
    warnings,
  };
}

/**
 * Log de diagnóstico para consola
 */
export function logGoogleMapsDebugInfo(): void {
  const config = verifyGoogleMapsConfig();

  console.group("🗺️ Google Maps Configuration");

  console.log("API Key Configurada:", config.apiKey ? "✅ Sí" : "❌ No");
  if (config.apiKey) {
    // Mostrar solo los primeros y últimos caracteres por seguridad
    const key = config.apiKey;
    console.log(`  Valor: ${key.substring(0, 10)}...${key.substring(key.length - 10)}`);
  }

  console.log("API Cargada:", config.apiLoaded ? "✅ Sí" : "❌ No");

  if (config.errors.length > 0) {
    console.error("❌ Errores:");
    config.errors.forEach((error) => console.error(`  - ${error}`));
  }

  if (config.warnings.length > 0) {
    console.warn("⚠️ Advertencias:");
    config.warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  if (config.isConfigured) {
    console.log("✅ Todo está correctamente configurado");
    console.log("  - google.maps:", window.google?.maps ? "disponible" : "no disponible");
    console.log(
      "  - google.maps.places:",
      window.google?.maps?.places ? "disponible" : "no disponible"
    );
  }

  console.groupEnd();
}

// Log automático en desarrollo
if (import.meta.env.DEV) {
  // Log después de que el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      logGoogleMapsDebugInfo();
    });
  } else {
    logGoogleMapsDebugInfo();
  }
}
