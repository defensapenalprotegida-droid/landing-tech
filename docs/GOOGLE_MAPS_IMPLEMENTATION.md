# Implementación de Google Maps - Replicado de RentoQ

## Overview

Se ha replicado exactamente la implementación de búsqueda de direcciones de RentoQ en landing-tech. Esto incluye:

1. **Script de Google Maps en index.html** - Mismo método dinámico que RentoQ
2. **Normalización de Región** - Convierte nombres de región de Google Maps al español oficial chileno
3. **Componentes de búsqueda y mapa**:
   - `AddressSearchInput` - Campo de búsqueda con autocompletar
   - `AddressMap` - Mapa interactivo con búsqueda y click para seleccionar

## Archivos Agregados/Modificados

### 1. index.html (Modificado)
- Se agregó el script de Google Maps con el mismo método que RentoQ
- API Key: `AIzaSyDxqBjkkUsX03qfknnXZFpRFRPSKIU-0iM` (misma de RentoQ)
- El script carga dinámicamente las librerías necesarias

```html
<script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    v: "weekly",
    key: "AIzaSyDxqBjkkUsX03qfknnXZFpRFRPSKIU-0iM"
  });
</script>
```

### 2. src/lib/normalizar-region.ts (Nuevo)
**Exacto de RentoQ** - Normaliza nombres de región devueltos por Google Maps al nombre oficial del sistema.

Mapeos incluidos:
- "Región Metropolitana" → "Metropolitana de Santiago"
- "Biobío Region" → "Biobío"
- Y muchos más variantes de Google

### 3. src/components/AddressMap.tsx (Nuevo)
**Replicado de RentalMapComponent de RentoQ (adaptado a React)**

Características:
- Mapa interactivo con búsqueda de dirección
- Geocodificación inversa (click en mapa)
- Normalización automática de región
- Modos: geoZonas, marcacion, biometrico
- Extrae componentes de dirección (calle, número, ciudad, región, país)
- Círculo visual del radio de cobertura
- Info window al hacer click en marcador

**Props:**
```typescript
interface AddressMapProps {
  value?: string;              // Dirección inicial
  onChange: (result: AddressResult) => void;  // Callback con resultado
  height?: string;             // Altura del mapa (default: 400px)
  showSearch?: boolean;        // Mostrar barra de búsqueda (default: true)
  disabled?: boolean;          // Deshabilitar interacción (default: false)
  mode?: 'geoZonas' | 'marcacion' | 'biometrico';  // Modo del mapa
}
```

**Resultado:**
```typescript
interface AddressResult {
  address: string;
  latitude: number;
  longitude: number;
  components?: {
    street?: string;
    streetNumber?: string;
    city?: string;
    region?: string;  // Normalizado al español oficial
    country?: string;
  };
}
```

### 4. src/components/AddressSearchInput.tsx (Actualizado)
- Agregada normalización de región
- Ahora normaliza los nombres de región al español oficial chileno
- Mismo comportamiento que RentoQ

### 5. src/lib/googleMapsLoader.ts (Actualizado)
- Mejorado para trabajar con el script de index.html
- Soporta fallback a carga dinámica si es necesario
- Compatible con VITE_GOOGLE_MAPS_API_KEY si se desea usar otra clave

## Uso

### Componente AddressSearchInput (Solo búsqueda)

```typescript
import AddressSearchInput, { AddressResult } from "@/components/AddressSearchInput";

export function MyForm() {
  const [address, setAddress] = useState<AddressResult | null>(null);

  const handleAddressSelect = (result: AddressResult) => {
    setAddress(result);
    console.log("Dirección seleccionada:", result);
    // result.address: "Avenida Apoquindo 1234, Las Condes..."
    // result.latitude: -33.387
    // result.longitude: -70.567
    // result.components.region: "Metropolitana de Santiago" (normalizado)
  };

  return (
    <AddressSearchInput
      value={address?.address || ""}
      onChange={handleAddressSelect}
      placeholder="Busca una dirección..."
      label="Dirección"
      required={true}
    />
  );
}
```

### Componente AddressMap (Mapa interactivo)

```typescript
import AddressMap, { AddressResult } from "@/components/AddressMap";

export function MapForm() {
  const [address, setAddress] = useState<AddressResult | null>(null);

  const handleAddressSelect = (result: AddressResult) => {
    setAddress(result);
    console.log("Ubicación seleccionada:", result);
  };

  return (
    <AddressMap
      value={address?.address}
      onChange={handleAddressSelect}
      height="500px"
      showSearch={true}
      mode="geoZonas"
    />
  );
}
```

## Normalización de Región

Ambos componentes normalizan automáticamente los nombres de región devueltos por Google Maps al nombre oficial del sistema chileno.

Ejemplo:
- Input: "Región Metropolitana" o "Santiago Metropolitan Region"
- Output: "Metropolitana de Santiago"

La normalización se hace en el siguiente orden:
1. Match exacto
2. Mapeo de variantes conocidas
3. Match parcial
4. Match por inicio (fuzzy)
5. Retorna original si no hay match

## Equivalencia con RentoQ

| RentoQ | Landing-tech |
|--------|-------------|
| RentalMapComponent | AddressMap |
| MapGeocoder (Angular) | google.maps.Geocoder |
| index.html script | index.html script (mismo) |
| normalizar-region.ts | normalizar-region.ts (exacto) |
| AddressResult interface | AddressResult interface (compatible) |

## API Key

La API Key se carga desde `index.html`:
```
AIzaSyDxqBjkkUsX03qfknnXZFpRFRPSKIU-0iM
```

Esta es la misma API Key que usa RentoQ, por lo que ambos proyectos comparten cuota de uso.

## Testing

Para verificar que todo funciona:

1. Componente busca una dirección como "Av. Apoquindo 1234, Las Condes"
2. Verifica que obtiene coordenadas correctas
3. Verifica que la región se normaliza a "Metropolitana de Santiago"
4. Verifica que el mapa (si se usa AddressMap) muestra el marcador en la ubicación correcta
5. Si hace click en el mapa, verifica geocodificación inversa

## Notas Importantes

1. **API Key Compartida**: Ambos proyectos (RentoQ y landing-tech) usan la misma API Key
2. **Normalización**: Es crucial para consistencia en los nombres de región
3. **Bibliotecas Cargadas**: El script carga dinámicamente según lo que se use
   - `maps` - siempre
   - `places` - cuando se usa autocompletar
   - `geocoding` - cuando se usa geocodificación
