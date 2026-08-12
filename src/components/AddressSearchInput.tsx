import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [apiError, setApiError] = useState<string>("");
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize Google Places API
  useEffect(() => {
    let isMounted = true;

    const initializeGoogleMaps = async () => {
      try {
        // Cargar script de Google Maps
        await loadGoogleMapsScript();

        if (!isMounted) return;

        if (!window.google || !window.google.maps) {
          setApiError("Google Maps API no está disponible");
          console.error("Google Maps API still not available after loading script");
          return;
        }

        try {
          autocompleteRef.current = new google.maps.places.AutocompleteService();
          sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
          geocoderRef.current = new google.maps.Geocoder();

          // Create a dummy div for PlacesService (required)
          const dummyDiv = document.createElement("div");
          placesServiceRef.current = new google.maps.places.PlacesService(dummyDiv);

          console.log("Google Places API initialized successfully");
        } catch (err) {
          setApiError("Error al inicializar Google Maps API");
          console.error("Error initializing Places API:", err);
        }
      } catch (err) {
        if (!isMounted) return;

        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        setApiError(`No se pudo cargar Google Maps: ${errorMessage}`);
        console.error("Error loading Google Maps script:", err);
      }
    };

    initializeGoogleMaps();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle input change and fetch predictions
  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setInputValue(query);
      setApiError("");

      if (!query || query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      if (!autocompleteRef.current) {
        setApiError("Servicio de autocomplete no disponible");
        return;
      }

      setIsLoading(true);

      try {
        const predictions = await autocompleteRef.current.getPlacePredictions({
          input: query,
          sessionToken: sessionTokenRef.current,
          componentRestrictions: { country: "cl" }, // Restrict to Chile
          types: ["geocode"], // Only address-type results
        });

        const preds = predictions.predictions || [];
        // Debug: Log prediction structure
        if (preds.length > 0) {
          console.log("Google Places prediction structure:", {
            main_text: preds[0].main_text,
            secondary_text: preds[0].secondary_text,
            description: preds[0].description,
            place_id: preds[0].place_id,
          });
        }
        setSuggestions(preds);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setApiError("Error al buscar direcciones");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback(
    async (prediction: google.maps.places.AutocompletePrediction) => {
      if (!geocoderRef.current) {
        setApiError("Geocoder no disponible");
        return;
      }

      setIsLoading(true);
      setShowSuggestions(false);

      try {
        // Use Geocoder to get detailed location and coordinates
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

        // Extract address components
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

        // Normalize region name to Chilean standard (same as RentoQ)
        region = normalizarRegionGoogle(region);

        const fullAddress = result.formatted_address;
        setInputValue(fullAddress);

        // Create new session token for next search
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();

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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
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

      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="pl-9"
            autoComplete="off"
            onFocus={() => inputValue && suggestions.length > 0 && setShowSuggestions(true)}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 animate-pulse text-primary" />
            </div>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((prediction, index) => (
              <button
                key={`${prediction.place_id}-${index}`}
                type="button"
                onClick={() => handleSelectSuggestion(prediction)}
                className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-start gap-2">
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

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}

        {apiError && (
          <div className="flex items-center gap-1 mt-1 text-yellow-600 dark:text-yellow-500 text-xs">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span>{apiError}</span>
              {apiError.includes("key") && (
                <span className="text-yellow-700 dark:text-yellow-400">
                  Ver docs/GOOGLE_MAPS_SETUP.md para configurar
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info message */}
      {!apiError && !error && (
        <p className="text-xs text-muted-foreground mt-1">
          Busca una dirección en Chile
        </p>
      )}
    </div>
  );
};

export default AddressSearchInput;
