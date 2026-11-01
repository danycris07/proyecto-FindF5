import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FORMOSA_CENTER = [-26.1853, -58.1745];
const FIELD_PIN = L.divIcon({
  className: "",
  html: '<div style="width:24px;height:24px;border:3px solid white;border-radius:50% 50% 50% 0;background:#dc2626;transform:rotate(-45deg);box-shadow:0 2px 6px #0008"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function MapClickHandler({ onSelectLocation }) {
  useMapEvents({
    click(event) {
      onSelectLocation({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });
  return null;
}

function MapRecenter({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.setView([latitude, longitude], map.getZoom());
    }
  }, [map, latitude, longitude]);

  return null;
}

function DraggableFieldPin({ position, onSelectLocation }) {
  const markerRef = useRef(null);
  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (!marker) return;
      const { lat, lng } = marker.getLatLng();
      onSelectLocation({ latitude: lat, longitude: lng });
    },
  };

  return (
    <Marker
      position={position}
      icon={FIELD_PIN}
      draggable
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  );
}

function AdminFieldMap({
  latitude,
  longitude,
  onSelectLocation,
}) {
  const parsedLatitude = latitude === "" ? null : Number(latitude);
  const parsedLongitude = longitude === "" ? null : Number(longitude);
  const hasCoordinates =
    Number.isFinite(parsedLatitude) &&
    Number.isFinite(parsedLongitude) &&
    parsedLatitude >= -90 &&
    parsedLatitude <= 90 &&
    parsedLongitude >= -180 &&
    parsedLongitude <= 180;
  const position = hasCoordinates
    ? [parsedLatitude, parsedLongitude]
    : null;

  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <p className="bg-background px-3 py-2 text-sm text-text-secondary">
        Tocá el mapa para ubicar la cancha o arrastrá el pin. El mapa inicia
        centrado en Formosa.
      </p>
      <MapContainer
        center={position ?? FORMOSA_CENTER}
        zoom={position ? 16 : 13}
        scrollWheelZoom
        className="z-0 h-64 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onSelectLocation={onSelectLocation} />
        {position ? (
          <>
            <MapRecenter
              latitude={parsedLatitude}
              longitude={parsedLongitude}
            />
            <DraggableFieldPin
              position={position}
              onSelectLocation={onSelectLocation}
            />
          </>
        ) : (
          <>
            <MapRecenter
              latitude={FORMOSA_CENTER[0]}
              longitude={FORMOSA_CENTER[1]}
            />
          </>
        )}
      </MapContainer>
      <p className="bg-background px-3 py-2 text-xs text-text-secondary">
        {hasCoordinates
          ? `Coordenadas: ${parsedLatitude.toFixed(6)}, ${parsedLongitude.toFixed(6)}`
          : "Todavía no seleccionaste una ubicación."}
      </p>
    </div>
  );
}

export default AdminFieldMap;
