import { useForm } from "react-hook-form";
import { mockUsers } from "../mocks/MockData";
import { useNavigate } from "react-router-dom";
export function Registro() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    mockUsers.push(data);
    console.log("Usuario registrados", mockUsers);
    reset();

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#100B14] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl border border-[#3B2947] bg-[#1A121F] p-7 shadow-2xl shadow-black/40"
      >
        {/* Encabezado */}
        <div className="mb-7">
          <h2 className="text-3xl font-bold tracking-tight text-[#F5EEF8]">
            Crear cuenta
          </h2>

          <p className="mt-2 text-sm text-[#A99BAF]">
            Completá tus datos para registrarte en FindF5.
          </p>
        </div>

        <div className="space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#D8CBDD]">
              Nombre
            </label>

            <input
              type="text"
              placeholder="Juan Pérez"
              {...register("name")}
              className="w-full rounded-lg border border-[#45334F] bg-[#130E17] px-4 py-3 text-[#F5EEF8] placeholder-[#75667B] outline-none transition focus:border-[#8B5BA8] focus:ring-2 focus:ring-[#8B5BA8]/20"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#D8CBDD]">
              Email
            </label>

            <input
              type="email"
              placeholder="juan@email.com"
              {...register("email")}
              className="w-full rounded-lg border border-[#45334F] bg-[#130E17] px-4 py-3 text-[#F5EEF8] placeholder-[#75667B] outline-none transition focus:border-[#8B5BA8] focus:ring-2 focus:ring-[#8B5BA8]/20"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#D8CBDD]">
              Teléfono
            </label>

            <input
              type="tel"
              placeholder="+54 9 3704..."
              {...register("phone")}
              className="w-full rounded-lg border border-[#45334F] bg-[#130E17] px-4 py-3 text-[#F5EEF8] placeholder-[#75667B] outline-none transition focus:border-[#8B5BA8] focus:ring-2 focus:ring-[#8B5BA8]/20"
            />
          </div>

          {/* contraseña */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#D8CBDD]">
              Contraseña
            </label>

            <input
              type="password"
              {...register("password")}
              className="w-full rounded-lg border border-[#45334F] bg-[#130E17] px-4 py-3 text-[#F5EEF8] placeholder-[#75667B] outline-none transition focus:border-[#8B5BA8] focus:ring-2 focus:ring-[#8B5BA8]/20"
            />
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#D8CBDD]">
              Tipo de cuenta
            </label>

            <select
              {...register("role")}
              defaultValue="PLAYER"
              className="w-full rounded-lg border border-[#45334F] bg-[#130E17] px-4 py-3 text-[#F5EEF8] outline-none transition focus:border-[#8B5BA8] focus:ring-2 focus:ring-[#8B5BA8]/20"
            >
              <option value="PLAYER">Jugador</option>
              <option value="FIELD_OWNER">Dueño de cancha</option>
            </select>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-[#6D3F82] px-4 py-3 font-semibold text-white shadow-lg shadow-[#6D3F82]/20 transition hover:bg-[#7B4A91] hover:shadow-[#6D3F82]/30 active:scale-[0.98]"
          >
            Crear cuenta
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-[#75667B]">
          Al registrarte podrás comenzar a buscar y reservar canchas.
        </p>
      </form>
    </div>
  );
}
