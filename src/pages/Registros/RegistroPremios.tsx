import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import RegistrosService from "../../services/RegistrosService";

type FormValues = {
  premio: string;
  slug_premio: string;
  la_romana: number;
  villa_hermosa: number;
  caleta: number;
  cumayasa: number;
  guaymate: number;
};

// Tipo para los campos de municipios
type MunicipioField =
  | "la_romana"
  | "villa_hermosa"
  | "caleta"
  | "cumayasa"
  | "guaymate";

// Función generateSlug (asegúrate de que esta función exista en tus utils)
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const RegistroPremios = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      premio: "",
      slug_premio: "",
      la_romana: 1,
      villa_hermosa: 1,
      caleta: 1,
      cumayasa: 1,
      guaymate: 1,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [total, setTotal] = useState(5); // Inicializado con la suma de los valores predeterminados

  // Array de municipios con tipo explícito
  const municipios: { name: MunicipioField; label: string }[] = [
    { name: "la_romana", label: "La Romana" },
    { name: "villa_hermosa", label: "Villa Hermosa" },
    { name: "caleta", label: "Caleta" },
    { name: "cumayasa", label: "Cumayasa" },
    { name: "guaymate", label: "Guaymate" },
  ];

  const onSubmit = async (data: FormValues) => {
    try {
      // Genera el slug antes de enviar
      const slug_premio = generateSlug(data.premio);

      const payload = {
        ...data,
        status: 1,
        slug_premio,
      };
      try {
        const response = await RegistrosService.regPremio(payload);

        if (response.status === 203) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Este premio ya ha sido registrado",
            showConfirmButton: false,
            timer: 2000,
          });
          return;
        }

        if (response.status === 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Registro del premio ${data.premio} COMPLETADO`,
            showConfirmButton: false,
            timer: 2000,
          });

          reset({
            premio: "",
            slug_premio: "",
            la_romana: 1,
            villa_hermosa: 1,
            caleta: 1,
            cumayasa: 1,
            guaymate: 1,
          });

          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      } catch (error: any) {
        console.error("Error en la respuesta del servicio:", error);

        Swal.fire({
          position: "center",
          icon: "error",
          title: error.message || "Error al registrar premio",
          text: "Por favor, intente más tarde",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error general:", error);

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Intente más tarde",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Usar un useEffect para observar cambios en los campos de municipios
  useEffect(() => {
    const subscription = watch((formValues) => {
      // Calcular el total sumando los valores de todos los municipios
      let sum = 0;
      municipios.forEach(({ name }) => {
        // Asegurarse de que el valor es un número antes de sumarlo
        const value = formValues[name];
        sum += typeof value === "number" ? value : 0;
      });
      setTotal(sum);
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => subscription.unsubscribe();
  }, [watch, municipios]);

  // Enfocar el campo de premio al cargar el componente
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Registro de premios
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="premio"
              className="block text-sm font-medium text-gray-700"
            >
              Premio
            </label>
            <input
              id="premio"
              className={`mt-1 block w-full rounded-md border shadow-sm focus:border-green-500 focus:ring-green-500 p-2 ${
                errors.premio ? "border-red-500" : "border-gray-300"
              }`}
              {...register("premio", {
                required: "Campo obligatorio",
              })}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
              ref={(el) => {
                inputRef.current = el; // Para la referencia manual
                const { ref } = register("premio"); // Para react-hook-form
                if (typeof ref === "function") {
                  ref(el);
                }
              }}
            />
            {errors.premio && (
              <p className="mt-1 text-sm text-red-600">
                {errors.premio.message}
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-center text-green-800 mb-4">
              Cantidad de premios por municipio
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {municipios.map((municipio) => (
                <div key={municipio.name}>
                  <label
                    htmlFor={municipio.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {municipio.label}
                  </label>
                  <Controller
                    name={municipio.name}
                    control={control}
                    rules={{
                      required: "Campo obligatorio",
                      min: {
                        value: 1,
                        message: "Mínimo 1",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        id={municipio.name}
                        type="number"
                        min="1"
                        className={`mt-1 block w-full rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 p-2 ${
                          errors[municipio.name]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        {...field}
                        onChange={(e) => {
                          // Asegurarse de que el valor es un número
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value, 10);
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                  {errors[municipio.name] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[municipio.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Total: {total}
            </h2>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};
