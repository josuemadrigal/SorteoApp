import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import RegistrosService from "../../services/RegistrosService";
import MunicipioSelect from "../../screens/ViewGanadores/components/MunicipioSelect";
import PremioSelect from "../../screens/Consulta/components/PremioSelect";

interface Premio {
  slug_premio: string;
  premio: string;
}

interface FormData {
  municipio: string;
  premio: string;
  ronda: string;
  cantidad: number;
  status: string;
}

export const RegistroRonda = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      municipio: "",
      premio: "",
      ronda: "",
      cantidad: 0,
      status: "activa",
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [premios, setPremios] = useState<Premio[]>([]);
  const [rondaNum, setRondaNum] = useState<number>(0);

  const municipio = watch("municipio");
  const premio = watch("premio");
  const cantidad = watch("cantidad");

  useEffect(() => {
    const fetchPremios = async () => {
      try {
        const response = await RegistrosService.getPremios();
        if (response.data.ok) {
          setPremios(response.data.premios);
        }
      } catch (error) {
        console.error("Error fetching premios", error);
      }
    };

    fetchPremios();
  }, []);

  useEffect(() => {
    const fetchRonda = async () => {
      if (!municipio || !premio) return;

      try {
        const response = await RegistrosService.getRondaNum(municipio, premio);
        const rondaRegistrada = parseInt(response.data.ronda[0]?.ronda || "0");
        const rondaSiguiente = rondaRegistrada + 1;
        setRondaNum(rondaSiguiente);
        setValue("ronda", rondaSiguiente.toString());
      } catch (error) {
        console.error("Error fetching ronda", error);
        setRondaNum(1);
        setValue("ronda", "1");
      }
    };

    fetchRonda();
  }, [municipio, premio, setValue]);

  const onSubmit = async (formData: FormData) => {
    const payload = {
      ...formData,
      cantidad: Number(formData.cantidad),
    };
    if (!payload.municipio || !formData.premio) {
      return Swal.fire({
        icon: "error",
        title: "Todos los campos son obligatorios",
        timer: 2000,
      });
    }

    if (isNaN(payload.cantidad)) {
      return Swal.fire({
        icon: "error",
        title: "La cantidad debe ser un número válido",
        timer: 2000,
      });
    }

    if (payload.cantidad <= 0) {
      return Swal.fire({
        icon: "error",
        title: "La cantidad debe ser mayor a 0",
        timer: 2000,
      });
    }

    try {
      const response = await RegistrosService.regRonda(payload);

      if (response.status === 203) {
        return Swal.fire({
          icon: "error",
          title: "Este premio ya ha sido registrado",
          timer: 2000,
        });
      }

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: `Ronda registrada para ${formData.premio}`,
          timer: 2000,
        });

        reset({
          municipio: formData.municipio,
          premio: "",
          ronda: "",
          cantidad: 0,
          status: "activa",
        });

        inputRef.current?.focus();
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        timer: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
          {rondaNum ? `Registro de ronda #${rondaNum}` : "Registro de ronda"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <MunicipioSelect
            value={municipio}
            onChange={(e) => setValue("municipio", e.target.value)}
            register={register}
          />

          <PremioSelect
            value={premio}
            onChange={(e) => setValue("premio", e.target.value)}
            premios={premios}
            disabled={!municipio}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min="1"
              step="1"
              {...register("cantidad", {
                required: "Cantidad es obligatoria",
                min: { value: 1, message: "Mínimo 1" },
                valueAsNumber: true,
              })}
              className={`w-full p-3 rounded-lg border ${
                errors.cantidad ? "border-red-500" : "border-gray-300"
              } bg-gray-50 focus:ring-2 focus:ring-green-500`}
              ref={inputRef}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setValue("cantidad", value);
              }}
            />
            {errors.cantidad && (
              <p className="mt-1 text-sm text-red-500">
                {errors.cantidad.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};
