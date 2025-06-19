
"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY, SECTORS_QUITO } from "@/lib/constants";
import type { Sector } from "@/lib/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface MapDisplayProps {
  selectedSectorValue: string | null;
}

const DEFAULT_CENTER = { lat: -0.1807, lng: -78.4678 }; // Quito center
const DEFAULT_ZOOM = 11;

export function MapDisplay({ selectedSectorValue }: MapDisplayProps) {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    if (selectedSectorValue) {
      const sector = SECTORS_QUITO.find(s => s.value === selectedSectorValue) || null;
      setSelectedSector(sector);
      if (sector) {
        setMapCenter({ lat: sector.lat, lng: sector.lng });
        setMapZoom(14);
      } else {
        setMapCenter(DEFAULT_CENTER);
        setMapZoom(DEFAULT_ZOOM);
      }
    } else {
      setSelectedSector(null);
      setMapCenter(DEFAULT_CENTER);
      setMapZoom(DEFAULT_ZOOM);
    }
  }, [selectedSectorValue]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <MapPin className="mr-2 h-6 w-6 text-muted-foreground" />
            Visualización del Sector
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-destructive text-center">La clave API de Google Maps no está configurada. El mapa no se puede mostrar.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <MapPin className="mr-2 h-6 w-6 text-muted-foreground" />
          Visualización del Sector: {selectedSector?.label || "Norte de Quito"}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)] p-0"> {/* Adjust height based on CardHeader's actual height */}
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            mapId="qgas-map"
            style={{ width: "100%", height: "100%", minHeight: "300px", borderRadius: "0 0 var(--radius) var(--radius)"}}
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={DEFAULT_ZOOM}
            center={mapCenter}
            zoom={mapZoom}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          >
            {selectedSector && (
              <AdvancedMarker position={{ lat: selectedSector.lat, lng: selectedSector.lng }} title={selectedSector.label} />
            )}
          </Map>
        </APIProvider>
      </CardContent>
    </Card>
  );
}

