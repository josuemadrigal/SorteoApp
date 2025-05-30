import React, { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { SubmitHandler, useForm } from "react-hook-form";
import registrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";
import { generarActaEntregaPDF } from "./components/generateWinnerPdf";
// import gifLoading from "../../../public/loading.gif";

interface FormValues {
  status: number;
  cedula: any;
  coment: string;
}

interface Registro {
  cedula: any;
  nombre: string;
}

const defaultValues: FormValues = {
  cedula: "",
  coment: "",
  status: 1,
};
const premios = [
  { premio: "Abanico", slug: "abanico" },
  { premio: "Bono de RD$2,000 pesos", slug: "bono-de-rd2000-pesos" },
  { premio: "Bono de RD$1,500 pesos", slug: "bono-de-rd1500-pesos" },
  { premio: "Cilindro de gas", slug: "cilindro-de-gas-50lb" },
  { premio: "Estufa de horno", slug: "estufa-de-horno" },
  { premio: "Estufa mesa 4 hornillas", slug: "estufa-de-mesa-4-hornillas" },
  { premio: "Freidora", slug: "freidora" },
  { premio: "Lavadora", slug: "lavadora" },
  { premio: "Licuadora", slug: "licuadora" },
  { premio: "Microonda", slug: "microondas" },
  { premio: "Nevera", slug: "nevera" },
  { premio: "Olla de presión", slug: "olla-de-presion" },
  { premio: "Televisor", slug: "televisor" },
];

const municipios = [
  { municipio: "La Romana", slug: "la-romana" },
  { municipio: "Villa Hermosa", slug: "villa-hermosa" },
  { municipio: "Guaymate", slug: "guaymate" },
  { municipio: "Caleta", slug: "caleta" },
  { municipio: "Cumayasa", slug: "cumayasa" },
];

const Verificar = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const errorMessages = {
    invalidMunicipio: "Seleccione un municipio o distrito válido",
    invalidBoleta: "Ingrese una cédula válida",
    duplicateBoleta: "Esta cédula ya ha sido registrada",
    cedulaNotFound: "No se encontró un registro con esa cédula",
    cedulaNoValida: "Ingrese un numero de cedula valido",
    cedulaParticipando: `Esta cédula ya está participando`,
    nombreRequerido: "El nombre es necesario",
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entregadoTrue, setEntregadoTrue] = useState(false);
  const [cedula, setCedula] = useState("");
  const [persona, setPersona] = useState<
    {
      nombre: string;
      cedula: string;
      premio: string;
      municipio: string;
      coment: string;
      status: string;
    }[]
  >([]);
  const [text, setText] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const showError = (title: string) => {
    Swal.fire({
      position: "center",
      icon: "warning",
      title,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const success = (title: string) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const getByCedula = async (cedula: string) => {
    setPersona([]);
    setIsSubmitting(true);
    try {
      const response = await registrosService.getRegistroByCedula(3, cedula);

      if (response.data.registros.length < 1) {
        showError("Esta cedula no fue ganadora");
        return;
      }

      setEntregadoTrue(response.data.registros[0]?.status === "4");
      setText(response.data.registros[0].coment);
      setPersona(response.data.registros);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ActualizarRegistros = async () => {
    if (!text) {
      showError("Debe escribir un comentario");
      return;
    }

    setIsSubmitting(true);
    const reponse = await registrosService.startUpdateByCedula(cedula, text, 4);
    if (reponse.status === 200) {
      success("Listo!");
      setText("");
      setPersona([]);
    } else {
      showError("Intente nuevamente");
      setPersona([]);
    }
    setIsSubmitting(false);
  };

  const openSwalForNumber = async () => {
    if (!text) {
      showError("Debe escribir un comentario");
      return;
    }
    const expectedCode = "2569";
    const { value: number } = await Swal.fire({
      title: "Código de autorización",
      input: "password",
      inputLabel: "Sólo guarde cuando entregue el premio (no revele su codigo)",
      inputPlaceholder: "Ingrese su código",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Abortar",
      confirmButtonColor: "#06502a",
      cancelButtonColor: "red",
      inputAttributes: {
        maxlength: 4,
        inputmode: "numeric",
      },
      inputValidator: (value) => {
        if (!value) {
          return "Debe ingresar su código";
        }
        if (isNaN(Number(value))) {
          return "Ingrese un código válido!";
        }
        if (value !== expectedCode) {
          return "Ingrese un código válido!";
        }
        return null;
      },
    });

    if (number === expectedCode) {
      await ActualizarRegistros();
    }
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const cedulaValue = (event.target as HTMLInputElement).value;
      if (cedulaValue.length === 13) {
        await getByCedula(cedulaValue);
      }
    }
  };

  const registerSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.cedula.length === 13) {
      setCedula(data.cedula);
      await getByCedula(data.cedula);
    } else {
      showError(errorMessages.cedulaNoValida);
    }
    reset({ ...defaultValues, cedula: "" });
  };

  return (
    <div className="flex flex-col justify-center items-center bg-green-950 h-dvh p-4 gap-4">
      {/* Search Form */}
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(registerSubmit)} className="flex gap-2">
          <InputMask
            mask="999-9999999-9"
            maskChar=""
            {...register("cedula", {
              required: true,
              maxLength: 13,
            })}
            disabled={isSubmitting}
          >
            {(inputProps: any) => (
              <input
                {...inputProps}
                type="text"
                className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500 ${
                  errors.cedula ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="000-0000000-0"
                ref={inputRef}
                onKeyDown={handleKeyPress}
                disabled={isSubmitting}
              />
            )}
          </InputMask>
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              isSubmitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isSubmitting}
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-md">
        {persona.length > 0 ? (
          <div className="flex flex-col gap-4">
            {/* Winner Info Card */}
            <div className="bg-green-600 p-4 rounded-lg shadow-md text-center">
              {persona.map((e) => (
                <div key={e.cedula} className="space-y-3">
                  {/* <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
                    onClick={() =>
                      generarActaEntregaPDF({
                        nombre: persona[0].nombre,
                        cedula: persona[0].cedula,
                        premio:
                          premios.find((p) => p.slug === persona[0].premio)
                            ?.premio || "N/A",
                        municipio:
                          municipios.find(
                            (m) => m.slug === persona[0].municipio
                          )?.municipio || "N/A",
                      })
                    }
                  >
                    Descargar PDF
                  </button> */}
                  <h2 className="text-3xl font-bold uppercase text-yellow-200">
                    {e.nombre}
                  </h2>
                  <p className="text-lg bg-green-700 rounded px-2 py-1 text-white font-bold">
                    {e.cedula}
                  </p>
                  <p className="text-lg bg-or-400 rounded px-2 py-1 text-white font-bold">
                    {premios.find((premio) => premio.slug === e.premio)?.premio}
                  </p>
                  <p className="text-lg bg-green-800 rounded px-2 py-1 text-white font-bold">
                    {municipios.find((m) => m.slug === e.municipio)?.municipio}
                  </p>
                  <p
                    className={`text-lg rounded px-2 py-1 font-bold ${
                      e.status === "3"
                        ? "bg-green-400 text-black"
                        : "bg-red-800 text-white"
                    }`}
                  >
                    {e.status === "3"
                      ? "Premio no entregado"
                      : "Premio entregado"}
                  </p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <label className="block mb-2">
                <span className="text-lg font-semibold">
                  Ingrese algún comentario:
                </span>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded mt-2 h-24"
                  value={text}
                  onChange={handleTextChange}
                  disabled={isSubmitting || entregadoTrue}
                />
              </label>
              <button
                className={`w-full py-2 px-4 rounded text-white ${
                  isSubmitting || entregadoTrue
                    ? "bg-gray-400"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={isSubmitting || entregadoTrue}
                onClick={openSwalForNumber}
                type="button"
              >
                Actualizar
              </button>
            </div>
          </div>
        ) : isSubmitting ? (
          <div className="flex flex-col items-center justify-center p-4">
            <img src="/loading.gif" alt="loading" className="w-24" />
            <p className="text-green-800 mt-2">Cargando...</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Verificar;
