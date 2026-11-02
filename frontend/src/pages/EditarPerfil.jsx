import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthField } from "../components/auth/AuthField.jsx";
import { useSession } from "../context/useSession.js";
import { updateCurrentUser } from "../services/sessionService.js";
import { uploadProfilePhoto } from "../services/userProfileService.js";
import { resolveProfilePhotoUrl } from "../utils/profilePhoto.js";

const SUBMIT_CLASS =
  "min-h-12 rounded-sm bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:brightness-95 disabled:cursor-wait disabled:opacity-60";

function EditarPerfil() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState("");
  const [saved, setSaved] = useState(false);
  const [profilePhotoFailed, setProfilePhotoFailed] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoError, setPhotoError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      position: user?.position ?? "",
      dominantFoot: user?.dominantFoot ?? "",
      phone: user?.phone ?? "",
      isPhoneVisible: user?.isPhoneVisible ?? true,
      address: user?.address ?? "",
      isAddressVisible: user?.isAddressVisible ?? false,
    },
  });
  const isPlayer = user?.role === "PLAYER";
  const profilePhotoUrl = resolveProfilePhotoUrl(user?.profilePhotoUrl);

  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview],
  );

  useEffect(() => {
    reset({
      position: user?.position ?? "",
      dominantFoot: user?.dominantFoot ?? "",
      phone: user?.phone ?? "",
      isPhoneVisible: user?.isPhoneVisible ?? true,
      address: user?.address ?? "",
      isAddressVisible: user?.isAddressVisible ?? false,
    });
  }, [reset, user]);

  const onSubmit = async (values) => {
    setRequestError("");
    setSaved(false);
    const payload = {
      phone: values.phone.trim(),
      isPhoneVisible: values.isPhoneVisible,
      address: values.address.trim(),
      isAddressVisible: values.isAddressVisible,
      ...(isPlayer
        ? {
            position: values.position || null,
            dominantFoot: values.dominantFoot || null,
          }
        : {}),
    };

    try {
      await updateCurrentUser(payload);
      if (photoFile) {
        await uploadProfilePhoto(photoFile);
        setPhotoFile(null);
        setPhotoPreview("");
      }
      setSaved(true);
    } catch (error) {
      for (const fieldError of error?.errors ?? []) {
        if (["position", "dominantFoot", "phone", "isPhoneVisible", "address", "isAddressVisible"].includes(fieldError.field)) {
          setError(fieldError.field, {
            type: "server",
            message: fieldError.message,
          });
        }
      }
      setRequestError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el perfil. Intentá nuevamente.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-24 text-text-primary md:px-8 md:pb-20 md:pt-28">
      <div className="mx-auto w-full max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-sm text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-status"
        >
          ← Volver
        </button>
        <section className="overflow-hidden rounded-md bg-surface">
          <header className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Editar perfil
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-text-secondary">
              Actualizá tus datos de contacto y la información que ven otros jugadores.
            </p>
          </header>

          <form className="grid gap-8 px-5 pb-6 sm:gap-9 sm:px-8 sm:pb-8" onSubmit={handleSubmit(onSubmit)} noValidate>
            <section aria-labelledby="photo-profile-title" className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-5">
              {(photoPreview || profilePhotoUrl) && !profilePhotoFailed ? (
                <img
                  src={photoPreview || profilePhotoUrl}
                  alt="Vista previa de tu foto de perfil"
                  className="h-20 w-20 rounded-full bg-background object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    setProfilePhotoFailed(true);
                  }}
                />
              ) : (
                <div aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full bg-background text-2xl font-semibold text-text-secondary">
                  {user?.name?.trim()?.charAt(0)?.toLocaleUpperCase() ?? "?"}
                </div>
              )}
              <div className="grid gap-3">
                <div>
                  <h2 id="photo-profile-title" className="text-lg font-semibold">
                    Foto de perfil
                  </h2>
                  <p id="profile-photo-help" className="mt-1 text-sm leading-6 text-text-secondary">
                    Elegí una foto JPG, PNG o WebP de hasta 2 MB.
                  </p>
                </div>
                <label
                  htmlFor="profile-photo-file"
                  className="text-sm font-medium text-text-secondary"
                >
                  Archivo de imagen
                </label>
                <input
                  id="profile-photo-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="block w-full text-sm text-text-secondary file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-sm file:border-0 file:bg-background file:px-4 file:py-2 file:font-semibold file:text-text-primary"
                  aria-describedby={
                    photoError
                      ? "profile-photo-help profile-photo-error"
                      : "profile-photo-help"
                  }
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setPhotoError("");
                    if (!file) return;
                    const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
                    if (!acceptedTypes.includes(file.type)) {
                      setPhotoError("Elegí una imagen JPG, PNG o WebP.");
                      event.target.value = "";
                      return;
                    }
                    if (file.size > 2 * 1024 * 1024) {
                      setPhotoError("La foto no puede superar los 2 MB.");
                      event.target.value = "";
                      return;
                    }
                    setPhotoFile(file);
                    setPhotoPreview(URL.createObjectURL(file));
                    setProfilePhotoFailed(false);
                    setSaved(false);
                    event.target.value = "";
                  }}
                />
                <div className="flex flex-wrap items-center gap-3">
                  {photoFile && (
                    <span className="max-w-full break-all text-sm text-text-secondary">
                      {photoFile.name}
                    </span>
                  )}
                </div>
                {photoError && (
                  <p id="profile-photo-error" role="alert" className="text-sm text-danger">
                    {photoError}
                  </p>
                )}
              </div>
            </section>
            {isPlayer && (
              <section aria-labelledby="playing-profile-title" className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <h2 id="playing-profile-title" className="sm:col-span-2 text-lg font-semibold">
                  Tu juego
                </h2>
                <AuthField
                  id="profile-position"
                  label="Posición"
                  labelClassName="block text-sm font-medium text-text-secondary"
                  error={errors.position?.message}
                  registration={register("position")}
                  as="select"
                >
                  <option value="">Elegí tu posición</option>
                  <option value="FIELD_PLAYER">Jugador de campo</option>
                  <option value="GOALKEEPER">Arquero</option>
                </AuthField>
                <AuthField
                  id="profile-dominant-foot"
                  label="Pierna hábil"
                  labelClassName="block text-sm font-medium text-text-secondary"
                  error={errors.dominantFoot?.message}
                  registration={register("dominantFoot")}
                  as="select"
                >
                  <option value="">Elegí tu pierna hábil</option>
                  <option value="RIGHT">Derecha</option>
                  <option value="LEFT">Izquierda</option>
                </AuthField>
              </section>
            )}

            <section aria-labelledby="contact-profile-title" className="grid gap-5">
              <div>
                <h2 id="contact-profile-title" className="text-lg font-semibold">
                  Contacto y privacidad
                </h2>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Elegí qué dato pueden usar otros jugadores para contactarte.
                </p>
              </div>
              <AuthField
                id="profile-phone"
                label="Teléfono"
                labelClassName="block text-sm font-medium text-text-secondary"
                type="tel"
                autoComplete="tel"
                maxLength={30}
                error={errors.phone?.message}
                registration={register("phone", {
                  validate: (value) => {
                    const phone = value.trim();
                    if (!phone) return true;
                    const digits = phone.replace(/\D/g, "").length;
                    return (
                      (/^[+\d][\d\s()-]*$/.test(phone) && digits >= 7 && digits <= 15) ||
                      "Ingresá un teléfono válido con entre 7 y 15 dígitos."
                    );
                  },
                })}
              />

              <AuthField
                id="profile-address"
                label="Zona de referencia"
                labelClassName="block text-sm font-medium text-text-secondary"
                maxLength={160}
                error={errors.address?.message}
                registration={register("address")}
              />

              <label className="flex cursor-pointer items-start gap-3 rounded-sm bg-background p-4 sm:p-5">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status"
                  {...register("isPhoneVisible")}
                />
                <span>
                  <span className="block text-sm font-semibold">
                    Mostrar mi teléfono en mi perfil
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-text-secondary">
                    Si lo ocultás, otros jugadores no podrán verlo ni contactarte por WhatsApp.
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-sm bg-background p-4 sm:p-5">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status"
                  {...register("isAddressVisible")}
                />
                <span>
                  <span className="block text-sm font-semibold">Compartir mi zona con otros jugadores</span>
                  <span className="mt-1 block text-sm leading-6 text-text-secondary">
                    Usá solo barrio o localidad, nunca tu dirección exacta. Está oculto hasta que lo habilites.
                  </span>
                </span>
              </label>
            </section>


            {requestError && (
              <p role="alert" className="rounded-sm bg-danger/10 p-3 text-sm text-danger">
                {requestError}
              </p>
            )}
            {saved && (
              <p role="status" className="text-sm font-semibold text-status">
                Perfil actualizado.
              </p>
            )}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="min-h-12 rounded-sm px-5 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-background hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status"
              >
                Cancelar
              </button>
              <button className={SUBMIT_CLASS} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default EditarPerfil;
