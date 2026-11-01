import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import AdminFormField, { adminInputClass } from "./AdminFormField.jsx";
import AdminFieldLocationMap from "./AdminFieldLocationMap.jsx";
import { adminButtonClass } from "./AdminResourceList.jsx";
import { reverseGeocodeAdminField } from "../../services/adminService.js";

const EMPTY_FIELD = {
  name: "",
  address: "",
  ownerId: "",
  latitude: "",
  longitude: "",
  price: "",
  imageUrl: "",
  description: "",
};

function AdminFieldForm({ field, owners, ownersError, onSave, onCancel }) {
  const [saving, setSaving] = useState(false);
  const [addressLookup, setAddressLookup] = useState({
    status: "idle",
    message: "",
  });
  const addressLookupId = useRef(0);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: field
      ? {
          name: field.name,
          address: field.address,
          ownerId: field.ownerId ?? "",
          latitude: field.latitude ?? "",
          longitude: field.longitude ?? "",
          price: field.price ?? "",
          imageUrl: field.imageUrl ?? "",
          description: field.description ?? "",
        }
      : EMPTY_FIELD,
  });

  const selectLocation = async ({ latitude, longitude }) => {
    const lookupId = ++addressLookupId.current;
    setValue("latitude", latitude, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("longitude", longitude, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("address", "", { shouldDirty: true, shouldValidate: true });
    setAddressLookup({ status: "loading", message: "Buscando dirección..." });

    try {
      const { address } = await reverseGeocodeAdminField(latitude, longitude);
      if (lookupId !== addressLookupId.current) return;
      if (!address) {
        setAddressLookup({
          status: "error",
          message:
            "No se encontró una dirección para este punto. Podés ingresarla manualmente.",
        });
        return;
      }
      setValue("address", address, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setAddressLookup({
        status: "success",
        message: "Dirección completada. Podés corregirla manualmente.",
      });
    } catch (error) {
      if (lookupId !== addressLookupId.current) return;
      setAddressLookup({
        status: "error",
        message:
          error instanceof Error
            ? `${error.message} Podés completar la dirección manualmente.`
            : "No se pudo buscar la dirección; ingresala manualmente.",
      });
    }
  };
  const addressRegistration = register("address", {
    required: "Ingresá la dirección.",
  });
  const latitude = useWatch({ control, name: "latitude" });
  const longitude = useWatch({ control, name: "longitude" });

  const submit = async (data) => {
    setSaving(true);
    await onSave({
      name: data.name,
      address: data.address,
      ownerId: data.ownerId ? Number(data.ownerId) : null,
      latitude: data.latitude === "" ? null : Number(data.latitude),
      longitude: data.longitude === "" ? null : Number(data.longitude),
      price: data.price === "" ? null : Number(data.price),
      imageUrl: data.imageUrl || null,
      description: data.description || null,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-5 grid gap-4">
      <h3 className="font-bold">{field ? `Editar ${field.name}` : "Crear cancha"}</h3>
      {ownersError && <p role="alert" className="text-sm text-danger">{ownersError}</p>}
      <AdminFormField
        id="admin-field-name"
        label="Nombre"
        registration={register("name", { required: "Ingresá el nombre." })}
      />
      {errors.name && <p role="alert" className="text-sm text-danger">{errors.name.message}</p>}
      <AdminFormField
        id="admin-field-address"
        label="Dirección"
        registration={{
          ...addressRegistration,
          onChange: (event) => {
            addressLookupId.current += 1;
            setAddressLookup({ status: "idle", message: "" });
            return addressRegistration.onChange(event);
          },
        }}
      />
      {errors.address && <p role="alert" className="text-sm text-danger">{errors.address.message}</p>}
      <AdminFormField id="admin-field-owner" label="Dueño de cancha">
        <select id="admin-field-owner" className={adminInputClass} {...register("ownerId")}>
          <option value="">Sin asignar</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>{owner.name}</option>
          ))}
        </select>
      </AdminFormField>
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminFormField
          id="admin-field-latitude"
          label="Latitud"
          type="number"
          registration={register("latitude")}
          step="any"
        />
        <AdminFormField
          id="admin-field-longitude"
          label="Longitud"
          type="number"
          registration={register("longitude")}
          step="any"
        />
      </div>
      <AdminFieldLocationMap
        latitude={latitude}
        longitude={longitude}
        onSelectLocation={selectLocation}
        addressLookup={addressLookup}
      />
      <AdminFormField
        id="admin-field-price"
        label="Precio de referencia"
        type="number"
        registration={register("price")}
        min="0"
        step="0.01"
      />
      <AdminFormField
        id="admin-field-image"
        label="URL de imagen"
        type="url"
        registration={register("imageUrl")}
      />
      <AdminFormField id="admin-field-description" label="Descripción">
        <textarea
          id="admin-field-description"
          className={adminInputClass}
          rows={3}
          {...register("description")}
        />
      </AdminFormField>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={saving} className={`${adminButtonClass} border-primary bg-primary text-primary-foreground`}>
          {saving ? "Guardando..." : field ? "Guardar cambios" : "Crear cancha"}
        </button>
        {field && (
          <button type="button" onClick={onCancel} className={`${adminButtonClass} border-border text-text-primary`}>
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}

export default AdminFieldForm;
