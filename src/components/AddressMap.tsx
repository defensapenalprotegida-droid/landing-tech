import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { normalizarRegionGoogle } from "@/lib/normalizar-region";

export interface AddressResult {
  address: string;
  latitude: number;
  longitude: number;
  components?: {
    street?: string;
    streetNumber?: string;
    city?: string;
    region?: string;
    country?: string;
  };
}

export interface AddressMapProps {
  value?: string;
  onChange: (result: AddressResult) => void;
  height?: string;
  showSearch?: boolean;
  disabled?: boolean;
  mode?: 'geoZonas' | 'marcacion' | 'biometrico';
}

const AddressMap: React.FC<AddressMapProps> = ({
  value = "",
  onChange,
  height = "400px",
  showSearch = true,
  disabled = false,
  mode = 'geoZonas'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const [searchQuery, setSearchQuery] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: -33.4489,
    lng: -70.6693
  });
  const [zoom, setZoom] = useState(15);
  const radius = 18;

  // Initialize Google Maps
  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        if (!window.google || !window.google.maps) {
          // Wait for Google Maps to be loaded
          const checkGoogle = () => {
            if (window.google && window.google.maps) {
              if (isMounted) initializeMap();
            } else {
              setTimeout(checkGoogle, 100);
            }
          };
          checkGoogle();
          return;
        }

        if (!mapContainerRef.current) return;

        // Create geocoder
        if (!geocoderRef.current) {
          geocoderRef.current = new google.maps.Geocoder();
        }

        // Create map
        if (!mapRef.current) {
          const mapOptions: google.maps.MapOptions = {
            disableDefaultUI: false,
            clickableIcons: true,
            streetViewControl: false,
            center,
            zoom,
          };

          mapRef.current = new google.maps.Map(mapContainerRef.current, mapOptions);

          // Add click listener to map
          mapRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (!disabled && mode === 'geoZonas' && event.latLng) {
              handleMapClick(event.latLng);
            }
          });
        }

        // Create info window
        if (!infoWindowRef.current) {
          infoWindowRef.current = new google.maps.InfoWindow();
        }

        setApiError("");
      } catch (err) {
        console.error("Error initializing map:", err);
        setApiError("Error al inicializar el mapa");
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
    };
  }, [disabled, mode, center, zoom]);

  // Handle map click for reverse geocoding
  const handleMapClick = useCallback(async (latLng: google.maps.LatLng) => {
    if (!geocoderRef.current) return;

    setIsLoading(true);

    try {
      const lat = latLng.lat();
      const lng = latLng.lng();

      const results = await geocoderRef.current.geocode({ location: { lat, lng } });

      if (!results.results || results.results.length === 0) {
        setApiError("No se encontró dirección para esta ubicación");
        return;
      }

      const result = results.results[0];
      const cleanAddress = removePostalCode(result.formatted_address);
      const components = extractComponents(result.address_components);

      // Update map
      updateMapMarker(lat, lng, cleanAddress);

      // Update center and zoom
      setCenter({ lat, lng });
      setZoom(17);

      // Emit result
      onChange({
        address: cleanAddress,
        latitude: lat,
        longitude: lng,
        components
      });

      setApiError("");
    } catch (err) {
      console.error("Error reverse geocoding:", err);
      setApiError("Error al obtener dirección");
    } finally {
      setIsLoading(false);
    }
  }, [onChange]);

  // Handle address search
  const handleSearchAddress = useCallback(async () => {
    if (!searchQuery.trim() || !geocoderRef.current) {
      return;
    }

    setIsLoading(true);

    try {
      const results = await geocoderRef.current.geocode({ address: searchQuery });

      if (!results.results || results.results.length === 0) {
        setApiError("Dirección no encontrada");
        return;
      }

      const result = results.results[0];
      const location = result.geometry.location;
      const lat = location.lat();
      const lng = location.lng();
      const cleanAddress = removePostalCode(result.formatted_address);
      const components = extractComponents(result.address_components);

      // Update map
      updateMapMarker(lat, lng, cleanAddress);

      // Update center and zoom
      setCenter({ lat, lng });
      setZoom(17);

      // Emit result
      onChange({
        address: cleanAddress,
        latitude: lat,
        longitude: lng,
        components
      });

      setApiError("");
    } catch (err) {
      console.error("Error searching address:", err);
      setApiError("Error al buscar dirección");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, onChange]);

  // Update map marker and circle
  const updateMapMarker = useCallback((lat: number, lng: number, title: string) => {
    if (!mapRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Remove existing circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    if (mode === 'geoZonas' || mode === 'marcacion') {
      // Create marker
      markerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title: title
      });

      // Create circle
      circleRef.current = new google.maps.Circle({
        center: { lat, lng },
        radius: radius * 1000, // Convert to meters (radius is in km)
        map: mapRef.current,
        strokeColor: mode === 'geoZonas' ? '#000000' : '#4285F4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: mode === 'geoZonas' ? '#000000' : '#4285F4',
        fillOpacity: mode === 'geoZonas' ? 0.2 : 0.15
      });

      // Add click listener to marker to show info
      markerRef.current.addListener('click', () => {
        if (infoWindowRef.current && mapRef.current) {
          infoWindowRef.current.setContent(`
            <div style="padding: 8px; max-width: 300px;">
              <h4 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${title}</h4>
            </div>
          `);
          infoWindowRef.current.open(mapRef.current, markerRef.current);
        }
      });
    } else if (mode === 'biometrico') {
      // Create marker for biometric mode
      markerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title: 'Ubicación Biométrico'
      });

      // Create circle for biometric radius
      circleRef.current = new google.maps.Circle({
        center: { lat, lng },
        radius: 50000, // 50km
        map: mapRef.current,
        strokeColor: '#4285F4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4285F4',
        fillOpacity: 0.15
      });
    }
  }, [mode, radius]);

  // Extract address components from Google Geocoder result
  const extractComponents = (components: google.maps.GeocoderAddressComponent[]) => {
    let street = '';
    let streetNumber = '';
    let city = '';
    let region = '';
    let country = '';

    for (const c of components) {
      if (c.types.includes('route')) {
        street = c.long_name;
      } else if (c.types.includes('street_number')) {
        streetNumber = c.long_name;
      } else if (
        c.types.includes('locality') ||
        c.types.includes('administrative_area_level_3')
      ) {
        city = c.long_name;
      } else if (c.types.includes('administrative_area_level_1')) {
        region = c.long_name;
      } else if (c.types.includes('country')) {
        country = c.long_name;
      }
    }

    // Normalize region name to Chilean standard
    region = normalizarRegionGoogle(region);

    return {
      street,
      streetNumber,
      city,
      region,
      country
    };
  };

  // Remove postal code from formatted address
  const removePostalCode = (address: string): string => {
    if (!address) return '';
    return address
      .replace(/,\s*\d{7},|^\d{7},|\s+\d{7}\s+/g, ',')
      .replace(/,\s*,/g, ',')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleSearchKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchAddress();
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Bar */}
      {showSearch && !disabled && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeydown}
              placeholder="Buscar dirección... (Ej: Av. Apoquindo 1234, Las Condes)"
              disabled={isLoading}
              className="pl-9"
              autoComplete="off"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 animate-pulse text-primary" />
              </div>
            )}
          </div>
          <Button
            onClick={handleSearchAddress}
            disabled={isLoading || !searchQuery.trim()}
            size="icon"
            variant="outline"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full rounded-lg border border-input overflow-hidden"
        style={{ height }}
      />

      {/* Error Messages */}
      {apiError && (
        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 text-xs">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Info Message */}
      {!apiError && mode === 'geoZonas' && (
        <p className="text-xs text-muted-foreground">
          Haz clic en el mapa o busca una dirección para seleccionar una ubicación
        </p>
      )}
    </div>
  );
};

export default AddressMap;
