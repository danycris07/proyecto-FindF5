import { lazy, Suspense, useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { adminButtonClass } from "./AdminResourceList.jsx";

const AdminFieldMap = lazy(() => import("./AdminFieldMap.jsx"));

function AdminFieldLocationMap({
  latitude,
  longitude,
  onSelectLocation,
  addressLookup,
}) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-label={
          mapOpen ? "Cerrar mapa de ubicación" : "Marcar ubicación en el mapa"
        }
        aria-expanded={mapOpen}
        onClick={() => setMapOpen((isOpen) => !isOpen)}
        className={`${adminButtonClass} border-border text-text-primary hover:border-status`}
      >
        <FaMapMarkedAlt aria-hidden="true" className="text-lg" />
      </button>
      <p className="mt-1 text-xs text-text-secondary">
        Marcá el punto para completar la dirección y las coordenadas.
      </p>
      {addressLookup.message && (
        <p
          role={addressLookup.status === "error" ? "alert" : "status"}
          className={`mt-2 text-sm ${
            addressLookup.status === "error"
              ? "text-danger"
              : addressLookup.status === "success"
                ? "text-status"
                : "text-text-secondary"
          }`}
        >
          {addressLookup.message}
        </p>
      )}
      {mapOpen && (
        <div className="mt-3">
          <Suspense
            fallback={
              <p role="status" className="p-3 text-sm text-text-secondary">
                Cargando mapa...
              </p>
            }
          >
            <AdminFieldMap
              latitude={latitude}
              longitude={longitude}
              onSelectLocation={onSelectLocation}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default AdminFieldLocationMap;
