import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Search, AlertCircle } from "lucide-react";
import { loadGoogleMapsScript } from "@/lib/googleMapsLoader";
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

export interface AddressSearchInputProps {
  value: string;
  onChange: (result: AddressResult) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const AddressSearchInput: React.FC<AddressSearchInputProps> = ({
  value,
  onChange,
  placeholder = "Busca una dirección...",
  label = "Dirección",
  required = false,
  error = "",
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  // Initialize Google Maps API - solo una vez
  useEffect(() => {
    let isMounted = true;

    const initializeGoogleMaps = async () => {
      try {
        await loadGoogleMapsScript();

        if (!isMounted) return;

        if (!window.google) {
          setApiError("Google Maps API no está disponible");
          return;
        }

        try {
          if (window.google.maps && typeof window.google.maps.importLibrary === 'function') {
            const placesLib = await window.google.maps.importLibrary('places') as any;
            autocompleteServiceRef.current = new placesLib.AutocompleteService();
            sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
          } else if (window.google.maps && window.google.maps.places) {
            autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
            sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
          }

          if (window.google.maps) {
            geocoderRef.current = new google.maps.Geocoder();
          }
        } catch (err) {
          console.error("Error initializing Places API:", err);
          setApiError("Error al inicializar Google Maps API");
        }
      } catch (err) {
        console.error("Error loading Google Maps script:", err);
      }
    };

    initializeGoogleMaps();

    return () => {
      isMounted = false;
    };
  }, []);

  // Obtener predicciones de Google
  const getMatches = useCallback(async (query: string) => {
    if (!query || query.length < 2 || !autocompleteServiceRef.current) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);

    try {
      const predictions = await autocompleteServiceRef.current.getPlacePredictions({
        input: query,
        sessionToken: sessionTokenRef.current,
        componentRestrictions: { country: "cl" },
        types: ["geocode"],
      });

      const preds = predictions.predictions || [];
      setSuggestions(preds);
      if (preds.length > 0) {
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching predictions:", err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manejar cambio de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    setApiError("");

    if (query.length >= 2) {
      getMatches(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Manejar selección de sugerencia
  const handleSelectSuggestion = useCallback(
    async (prediction: google.maps.places.AutocompletePrediction) => {
      if (!geocoderRef.current) {
        setApiError("Geocoder no disponible");
        return;
      }

      setIsLoading(true);
      setShowSuggestions(false);

      try {
        const results = await geocoderRef.current.geocode({
          placeId: prediction.place_id,
        });

        if (results.results.length === 0) {
          setApiError("No se encontraron coordenadas para esta dirección");
          return;
        }

        const result = results.results[0];
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();

        let street = "";
        let streetNumber = "";
        let city = "";
        let region = "";
        let country = "";

        result.address_components.forEach((component) => {
          if (component.types.includes("route")) {
            street = component.long_name;
          } else if (component.types.includes("street_number")) {
            streetNumber = component.long_name;
          } else if (
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_3")
          ) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            region = component.long_name;
          } else if (component.types.includes("country")) {
            country = component.long_name;
          }
        });

        region = normalizarRegionGoogle(region);
        const fullAddress = result.formatted_address;

        setInputValue(fullAddress);
        setSuggestions([]);

        // Nuevo token de sesión
        if (window.google?.maps?.places?.AutocompleteSessionToken) {
          sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        }

        onChange({
          address: fullAddress,
          latitude: lat,
          longitude: lng,
          components: {
            street,
            streetNumber,
            city,
            region,
            country,
          },
        });
      } catch (err) {
        console.error("Error selecting suggestion:", err);
        setApiError("Error al obtener detalles de la dirección");
      } finally {
        setIsLoading(false);
      }
    },
    [onChange]
  );

  // Cerrar sugerencias al clickear afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <label className="text-sm font-medium text-foreground mb-2 block">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="relative w-full">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          // Solo `disabled`, nunca `isLoading`: la consulta a Google se
          // dispara con cada tecla, y deshabilitar un input hace que el
          // navegador le quite el foco. Al rehabilitarlo el foco no vuelve, así
          // que el cursor desaparecía y se perdía lo que se siguiera
          // escribiendo. El estado de carga se comunica con el indicador de la
          // derecha, que no interrumpe la escritura.
          disabled={disabled}
          autoComplete="off"
          className="w-full px-9 py-2.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            <Search className="w-4 h-4 animate-pulse text-primary" />
          </div>
        )}
      </div>

      {/* Dropdown de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-background border border-input rounded-md shadow-lg max-h-72 overflow-y-auto top-full left-0"
        >
          {suggestions.map((prediction, index) => (
            <button
              key={`${prediction.place_id}-${index}`}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSuggestion(prediction);
              }}
              className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0 focus:outline-none cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {prediction.main_text || prediction.description?.split(",")[0] || "Dirección"}
                  </p>
                  {prediction.secondary_text && (
                    <p className="text-xs text-muted-foreground truncate">
                      {prediction.secondary_text}
                    </p>
                  )}
                  {!prediction.secondary_text && prediction.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {prediction.description.includes(",")
                        ? prediction.description.split(",").slice(1).join(",").trim()
                        : prediction.description
                      }
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensajes de error */}
      {error && (
        <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      {apiError && (
        <div className="flex items-center gap-1 mt-2 text-yellow-600 dark:text-yellow-500 text-xs">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {apiError}
        </div>
      )}
    </div>
  );
};

export default AddressSearchInput;
