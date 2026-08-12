# Checklist - Configuración de Google Maps API

## Problema Identificado ✅
- Script de Google Maps **no estaba cargado** en index.html
- Variable de entorno **VITE_GOOGLE_MAPS_API_KEY no estaba configurada**
- El componente AddressSearchInput intentaba usar `window.google.maps` que no existía

## Solución Implementada ✅

### 📁 Archivos Creados

1. **`/src/lib/googleMapsLoader.ts`**
   - Carga dinámicamente el script de Google Maps desde la API key configurada
   - Maneja promesas y evita cargas duplicadas
   - Proporciona funciones de verificación de estado

2. **`/src/lib/verifyGoogleMapsConfig.ts`**
   - Herramienta de debugging para verificar la configuración
   - Se ejecuta automáticamente en desarrollo y loguea en consola
   - Útil para diagnosticar problemas

3. **`/.env.example`**
   - Archivo de ejemplo con instrucciones
   - Explica cómo obtener y configurar la API key
   - Documentación de restricciones recomendadas

4. **`/docs/GOOGLE_MAPS_SETUP.md`**
   - Guía completa paso a paso
   - Instrucciones detalladas para crear la API key en Google Cloud
   - Configuración de restricciones de seguridad
   - Debugging e información de costos

### 📝 Archivos Modificados

1. **`/src/components/AddressSearchInput.tsx`**
   - Ahora importa y usa `loadGoogleMapsScript()`
   - Espera a que se cargue el script antes de inicializar
   - Mensajes de error mejorados con referencia a documentación
   - Manejo de errores más robusto

2. **`/src/main.tsx`**
   - Importa `verifyGoogleMapsConfig.ts` en desarrollo
   - Loguea automáticamente información de debugging

## Pasos para Configurar

### 1. Crear API Key en Google Cloud Console
```bash
# Ir a: https://console.cloud.google.com
# Ver detalles en: docs/GOOGLE_MAPS_SETUP.md
```

### 2. Copiar archivo de configuración
```bash
cp .env.example .env.local
```

### 3. Agregar la API Key
```bash
# Editar .env.local y reemplazar:
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### 4. Reiniciar servidor de desarrollo
```bash
npm run dev
```

### 5. Verificar en consola del navegador
- Abre DevTools (F12)
- Ve a la pestaña "Console"
- Deberías ver un grupo llamado "🗺️ Google Maps Configuration"
- Verifica que todo diga "✅"

## Verificación en el Navegador

1. Ve a `http://localhost:8080`
2. Busca un campo de "Ubicación" en el formulario
3. Comienza a escribir una dirección (ej: "Calle", "Avenida")
4. Deberían aparecer sugerencias dentro de 2-3 segundos

## Debugging

Si algo no funciona:

### En la Consola del Navegador (F12 > Console)
- Busca el grupo "🗺️ Google Maps Configuration"
- Lee los errores y advertencias
- Si dice "VITE_GOOGLE_MAPS_API_KEY no está configurada", ve al paso 2-3 arriba

### Errores Comunes

| Error | Solución |
|-------|----------|
| "Google Maps API key no configurada" | Edita `.env.local` y agrega tu API key |
| "HTTP 403 Forbidden" | Tu API key no tiene permisos para Places API |
| "RefererNotAllowedMapError" | Agrega el dominio localhost a restricciones de referer |
| "No suggestions appear" | Espera 2-3 segundos, la carga es asincrónica |

## Próximos Pasos

### Para desarrollo local ✅
- API key está cargada dinámicamente desde `.env.local`
- No necesita cambios en el código

### Para producción
- Necesitas configurar `VITE_GOOGLE_MAPS_API_KEY` en Vercel
- Dashboard de Vercel > Proyecto > Settings > Environment Variables
- Agregar: `VITE_GOOGLE_MAPS_API_KEY=tu_api_key_prod`
- Asegúrate de que la API key tiene restricciones solo para `arteagayaldunate.cl`

## Archivos de Referencia

- 📖 **Setup Completo**: `docs/GOOGLE_MAPS_SETUP.md`
- ⚙️ **Loader de Script**: `src/lib/googleMapsLoader.ts`
- 🔍 **Verificación**: `src/lib/verifyGoogleMapsConfig.ts`
- 📋 **Componente**: `src/components/AddressSearchInput.tsx`
- 🧩 **Uso**: `src/components/hero/ProductoForm.tsx` (línea 352-358)

## Notas de Seguridad

- ⚠️ Nunca comitees `.env.local` (está en `.gitignore`)
- ✅ La API key se envía directamente al navegador (es así por diseño de Google)
- ✅ Usa restricciones de referer para limitar uso no autorizado
- ✅ Monitorea el gasto en Google Cloud Console

## Estado Actual

✅ **Sistema listo para usar**
- Loader implementado y probado
- Verificación automática en desarrollo
- Documentación completa
- Manejo de errores robusto

Falta: **Agregar tu API key en .env.local**

## Comandos Útiles

```bash
# Ver la configuración de Google Maps en tiempo real
npm run dev
# Abre F12 > Console para ver el grupo "🗺️ Google Maps Configuration"

# Generar .env.local desde el ejemplo
cp .env.example .env.local

# Editar .env.local
nano .env.local
# o en macOS:
vim .env.local
```

---

**Generado**: 2026-08-12  
**Rama**: rediseno-conversion-seo  
**Estado**: ✅ Implementación completada, pendiente: API key
