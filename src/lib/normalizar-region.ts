/**
 * Normaliza el nombre de región devuelto por Google Maps Geocoder
 * al nombre oficial usado en el sistema (REGIONES_CHILE).
 *
 * Google devuelve variantes como:
 * - "Región Metropolitana" → "Metropolitana de Santiago"
 * - "Biobío Region" → "Biobío"
 * - "Valparaíso Region" → "Valparaíso"
 */

const REGIONES_CHILE = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana de Santiago',
  "Libertador General Bernardo O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén del General Carlos Ibáñez del Campo',
  'Magallanes y de la Antártica Chilena',
];

// Mapeo de variantes conocidas de Google → nombre oficial
const GOOGLE_TO_REGION: Record<string, string> = {
  'región metropolitana': 'Metropolitana de Santiago',
  'region metropolitana': 'Metropolitana de Santiago',
  'santiago metropolitan region': 'Metropolitana de Santiago',
  'metropolitan region': 'Metropolitana de Santiago',
  'rm': 'Metropolitana de Santiago',
  'biobío region': 'Biobío',
  'bio-bio': 'Biobío',
  'biobio': 'Biobío',
  'bío-bío': 'Biobío',
  'valparaíso region': 'Valparaíso',
  'valparaiso': 'Valparaíso',
  'antofagasta region': 'Antofagasta',
  'atacama region': 'Atacama',
  'coquimbo region': 'Coquimbo',
  'tarapacá region': 'Tarapacá',
  'tarapaca': 'Tarapacá',
  'arica y parinacota region': 'Arica y Parinacota',
  'maule region': 'Maule',
  'ñuble region': 'Ñuble',
  'nuble': 'Ñuble',
  'la araucanía region': 'La Araucanía',
  'la araucania': 'La Araucanía',
  'araucanía': 'La Araucanía',
  'los ríos region': 'Los Ríos',
  'los rios': 'Los Ríos',
  'los lagos region': 'Los Lagos',
  'aysén region': 'Aysén del General Carlos Ibáñez del Campo',
  'aysen': 'Aysén del General Carlos Ibáñez del Campo',
  'aisén': 'Aysén del General Carlos Ibáñez del Campo',
  'magallanes region': 'Magallanes y de la Antártica Chilena',
  'magallanes': 'Magallanes y de la Antártica Chilena',
  "o'higgins region": "Libertador General Bernardo O'Higgins",
  'ohiggins': "Libertador General Bernardo O'Higgins",
  "libertador general bernardo o'higgins": "Libertador General Bernardo O'Higgins",
};

/**
 * Normaliza una región devuelta por Google Maps al nombre oficial del sistema.
 * Si no encuentra match, retorna el valor original.
 */
export function normalizarRegionGoogle(regionGoogle: string): string {
  if (!regionGoogle) return '';

  const input = regionGoogle.trim();

  // Match exacto con las regiones del sistema
  const exacto = REGIONES_CHILE.find(r => r === input);
  if (exacto) return exacto;

  // Match por mapeo de variantes conocidas
  const lower = input.toLowerCase().replace(/\s+/g, ' ');
  const mapped = GOOGLE_TO_REGION[lower];
  if (mapped) return mapped;

  // Match parcial: buscar si alguna región del sistema está contenida o contiene
  const lowerInput = lower
    .replace('region ', '')
    .replace('región ', '')
    .replace(' region', '')
    .replace(' región', '');

  const parcial = REGIONES_CHILE.find(r => {
    const rLower = r.toLowerCase();
    return rLower.includes(lowerInput) || lowerInput.includes(rLower);
  });
  if (parcial) return parcial;

  // Último intento: fuzzy por inicio
  const inicio = REGIONES_CHILE.find(r =>
    r.toLowerCase().startsWith(lowerInput.slice(0, 4))
  );
  if (inicio) return inicio;

  // No se encontró match, devolver original
  return input;
}
