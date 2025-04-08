import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import RegistrosService from "../../services/RegistrosService";
import MunicipioSelect from "../../screens/ViewGanadores/components/MunicipioSelect";
import PremioSelect from "../../screens/Consulta/components/PremioSelect";

const modelo = {
  defaultValues: {
    municipio: "",
    premio: "",
    ronda: "",
    cantidad: 0,
    status: "activa",
  },
};

export const RegistroRonda = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(modelo);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [municipioT, setMunicipioT] = useState("");
  const [premio, setPremio] = useState("");
  const [rondaNum, setRondaNum] = useState(0);

  const [premios, setPremios] = useState<
    { slug_premio: string; premio: string }[]
  >([]);

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
  }, [premio]);

  const fetchRonda = async (municipioT: string, premio: string) => {
    try {
      const response = await RegistrosService.getRondaNum(municipioT, premio);
      const rondaRegistrada = parseInt(response.data.ronda[0]?.ronda);
      const rondaSiguiente = rondaRegistrada ? rondaRegistrada + 1 : 1;
      setRondaNum(rondaSiguiente);
    } catch (error) {
      console.error("Error fetching premios", error);
    }
  };

  const registerSubmit = async (objeto: any) => {
    const errorMessages = {
      invalidMunicipio: "Seleccione un municipio o distrito válido",
      invalidBoleta: "Ingrese un premio válido ",
      duplicateBoleta: "Este premio ya ha sido registrado",
      emptyFields: "Todos los campos son obligatorios",
      zeroQuantity: "La cantidad de ningun premio puede ser 0",
    };

    const showError = (title: string) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title,
        showConfirmButton: false,
        timer: 2000,
      });
      reset({ premio: "" });
    };
    objeto.premio = premio;
    objeto.ronda = rondaNum.toString();

    if (!objeto.premio || objeto.cantidad <= 0) {
      showError(errorMessages.emptyFields);
      return;
    }

    try {
      objeto.status = "activa";

      const response = await RegistrosService.regRonda(objeto);

      if (response.status === 203) {
        showError(errorMessages.duplicateBoleta);
        reset({ premio: "" });
      }

      if (response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Registro del premio ${objeto.premio} COMPLETADO`,
          showConfirmButton: false,
          timer: 2000,
        });

        if (inputRef.current) {
          inputRef.current.focus();
        }
        reset({
          premio: "",
          cantidad: 0,
        });
      }
    } catch (error) {
      console.log(error);
      showError("Intente más tarde");
    }
  };

  const handleMunicipio = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMunicipioT(event.target.value);
    if (premio !== "") {
      fetchRonda(event.target.value, premio);
    }
  };

  const handlePremio = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPremioValue = event.target.value;
    const selectedPremio = premios.find(
      (item) => item.slug_premio === selectedPremioValue
    );
    if (selectedPremio) {
      setPremio(selectedPremioValue);
      fetchRonda(municipioT, selectedPremioValue);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
          {`Registro de ronda ${rondaNum ? `#${rondaNum}` : ``}`}
        </h2>

        <form onSubmit={handleSubmit(registerSubmit)} className="space-y-4">
          <MunicipioSelect
            value={municipioT}
            onChange={handleMunicipio}
            register={register}
          />

          <PremioSelect
            value={premio}
            onChange={handlePremio}
            premios={premios}
            disabled={false}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              placeholder="Cantidad"
              defaultValue={0}
              min={1}
              maxLength={60}
              {...register("cantidad", {
                required: true,
                maxLength: 80,
                min: 1,
              })}
              className={`w-full p-3 rounded-lg border ${
                errors.cantidad ? "border-red-500" : "border-gray-300"
              } bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
            {errors.cantidad && (
              <p className="mt-1 text-sm text-red-500">
                Cantidad no puede ser 0
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};
