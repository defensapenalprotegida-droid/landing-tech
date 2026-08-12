# Configuración de Google Maps API

## Descripción

El componente `AddressSearchInput` utiliza Google Places Autocomplete para permitir a los usuarios buscar y seleccionar direcciones en el formulario de contacto.

## Pasos de Configuración

### 1. Crear una API Key en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs & Services" > "Enabled APIs & services"
4. Habilita las siguientes APIs:
   - **Maps JavaScript API** - Necesaria para cargar el script de Google Maps
   - **Places API** - Necesaria para autocomplete de direcciones

### 2. Crear una Credencial de API Key

1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "API Key"
3. Copia tu API Key

### 3. Restringir la API Key (Importante para Seguridad)

#### Restricción de Aplicación:
1. Selecciona tu API Key y haz clic en Edit
2. En "Application restrictions", selecciona **"HTTP referers"**
3. Agrega los siguientes dominios:
   ```
   https://arteagayaldunate.cl/*
   https://*.arteagayaldunate.cl/*
   http://localhost:8080/*
   http://localhost:3000/*
   ```

#### Restricción por API:
1. En "API restrictions", selecciona **"Restrict key"**
2. Selecciona solo:
   - Maps JavaScript API
   - Places API

### 4. Configurar la Variable de Entorno

1. Copia tu `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y reemplaza `your_api_key_here` con tu API Key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyD-...tu_api_key...
   ```

### 5. Reinicia el Servidor de Desarrollo

```bash
npm run dev
```

## Validación

Para verificar que todo está configurado correctamente:

1. Abre el navegador y ve a `http://localhost:8080` (o el puerto configurado)
2. Busca un campo de "Ubicación" en el formulario
3. Comienza a escribir una dirección (ej: "Calle")
4. Deberían aparecer sugerencias de direcciones de Google Places

### Debugging

Si tienes problemas:

1. **Abre la consola del navegador** (F12 > Console)
2. Busca mensajes de error relacionados con Google Maps
3. Verifica estos puntos:
   - ¿La variable `VITE_GOOGLE_MAPS_API_KEY` está configurada?
   - ¿La API Key es válida en Google Cloud Console?
   - ¿Las APIs (Maps JavaScript API + Places API) están habilitadas?
   - ¿La restricción de referers incluye localhost?

## Costos

Google Places Autocomplete tiene un modelo de precios. Para verificar el costo actual:
- Ve a [Google Maps Platform Pricing](https://cloud.google.com/maps-platform/pricing)
- Places API Autocomplete requests pueden requerir facturación

**Recomendación:** Configura alertas de gasto en Google Cloud Console para evitar sorpresas.

## Notas de Seguridad

- ⚠️ Nunca incluyas tu API Key en repositorios públicos
- ✅ Usa `.env.local` que está en `.gitignore`
- ✅ Restringe siempre tu API Key por referer y API
- ✅ En producción, verifica que solo `arteagayaldunate.cl` esté autorizado

## Variables de Entorno

| Variable | Descripción | Valor de Ejemplo |
|----------|-------------|------------------|
| `VITE_GOOGLE_MAPS_API_KEY` | API Key de Google Maps | `AIzaSyD_...` |

## Soporte

Si necesitas ayuda:
1. Revisa [Google Maps Platform Docs](https://developers.google.com/maps)
2. Verifica [Google Places Autocomplete Documentation](https://developers.google.com/maps/documentation/javascript/places-autocomplete)
3. Consulta la [Google Cloud Console Help](https://cloud.google.com/docs)
