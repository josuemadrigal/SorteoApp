import React, { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import RegistrosService from "../../services/RegistrosService";
import WhatsAppButton from "../../components/WhatsAppButton";

interface FormValues {
  nombre: string;
  cedula: string;
  municipio: string;
  boleto: string;
  telefono: string;
  status: number;
  premio: string;
}

const defaultValues: FormValues = {
  nombre: "",
  cedula: "",
  municipio: "",
  boleto: "",
  telefono: "",
  status: 1,
  premio: "-",
};

const showError = (title: string) => {
  Swal.fire({
    position: "center",
    icon: "error",
    title,
    showConfirmButton: false,
    timer: 1000,
  });
};

const showSuccess = (title: string) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 3000,
  });
};

const RegistroPadres: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nombreRef = useRef<HTMLInputElement | null>(null);
  const [nombre, setNombre] = useState("");
  const [nombreDB, setNombreDB] = useState("");
  const [cedula, setCedula] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cedulaNotFound, setCedulaNotFound] = useState(false);
  const [cedulaParticipando, setCedulaParticipando] = useState(false);
  const [buttonText, setButtonText] = useState("Buscar");
  const [modalOpen, setModalOpen] = useState(false);

  const errorMessages = {
    invalidMunicipio: "Seleccione un municipio o distrito válido",
    invalidBoleta: "Ingrese una cédula válida",
    duplicateBoleta: "Esta cédula ya ha sido registrada",
    cedulaNotFound: "No se encontró un registro con esa cédula",
    cedulaNoValida: "Ingrese un numero de cedula valido",
    cedulaParticipando: `Esta cédula ya está participando`,
    nombreRequerido: "El nombre y apellido son obligatorios",
  };

  const municipioNombre = municipio || "";

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (cedulaNotFound && nombreRef.current) {
      nombreRef.current.focus();
    }
  }, [cedulaNotFound]);

  const checkParticipando = async (cedula: string) => {
    const participandoResponse = await RegistrosService.checkParticipando(
      cedula
    );
    if (participandoResponse.data.participando) {
      showError(errorMessages.cedulaParticipando);
      return true;
    } else {
      return false;
    }
  };

  const checkCedula = async (cedula: string) => {
    try {
      const response = await RegistrosService.getCedula(cedula);

      const cedulaParti = await checkParticipando(cedula);

      const serieCedula = cedula.slice(0, 3);

      if (cedulaParti) {
        setNombreDB("");
        setNombre("");
        setCedula("");
        reset({ ...defaultValues, municipio: municipioNombre });
        setCedulaParticipando(false);
        setCedulaNotFound(false);
        setIsSubmitting(false);
        setButtonText("Buscar");
        return;
      }

      if (
        response.data.registro &&
        response.data.registro.nombre &&
        !cedulaParti
      ) {
        const nombre = response.data.registro.nombre.toUpperCase();
        setNombre(nombre);
        setNombreDB(nombre);
        setCedula(cedula);
        setCedulaNotFound(false);
        setIsSubmitting(false);
        setButtonText("Registrar");
      }

      if (!cedulaParti && response.data.ok === false) {
        if (
          serieCedula === "402" ||
          serieCedula === "026" ||
          serieCedula === "295" ||
          serieCedula === "103"
        ) {
          setNombreDB(nombre);
          setCedulaNotFound(true);
          setNombre("");
          setCedula(cedula);
          setIsSubmitting(false);
          setButtonText("Registrar");

          if (nombre) {
            await handleRegister({
              nombre,
              cedula,
              municipio: municipioNombre,
              boleto: "",
              telefono: "",
              premio: "-",
              status: 1,
            });
          }
        } else {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Cédula no permitida",
            text: "Debe dirigirse a un centro de registración.",
            showConfirmButton: false,
            timer: 30000,
          });

          reset({ ...defaultValues, municipio: municipioNombre });
          setNombre("");
          setCedula("");
          setCedulaNotFound(false);
          setCedulaParticipando(false);
          setButtonText("Buscar");
        }
      }
    } catch (error) {
      console.error(error);
      setButtonText("Buscar");
    }
  };

  const handleRegister = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log(data);
      const municipioValido =
        data.municipio === "la-romana" ||
        data.municipio === "caleta" ||
        data.municipio === "villa-hermosa" ||
        data.municipio === "cumayasa" ||
        data.municipio === "guaymate";

      const codigoBoleta = data.boleto.slice(0, 2).toUpperCase();

      const validarMunicipio = (municipio: string, codigo: string) => {
        if (data.municipio === municipio && codigoBoleta !== codigo) {
          showError(`Boleta no pertenece a ${municipio.split("-").join(" ")}`);
          return false;
        }
        return true;
      };

      if (!municipioValido) {
        showError(errorMessages.invalidMunicipio);
        return;
      }

      Swal.fire({
        title: "¿Están correctos sus datos?",
        html: ` <p> Nombre: <b>${data.nombre}</b></p>
                <p> Cédula: <b>${data.cedula}</b></p>
                <p> Municipio: <b>${data.municipio}</b></p>`,
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Editar datos",
        confirmButtonColor: "#2e7d32",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await RegistrosService.crearRegistrosPadres(data);
          if (response.status !== 203) {
            const responseCedula = await RegistrosService.regCedula(data);
            console.log(responseCedula);
            reset({ ...defaultValues, municipio: municipioNombre });
            setNombre("");
            setCedula("");
            setCedulaNotFound(false);
            setCedulaParticipando(false);
            setButtonText("Buscar");
          }

          if (response.status === 203) {
            showError(errorMessages.cedulaParticipando);
            reset({ ...defaultValues, municipio: municipioNombre });
            setNombre("");
            setCedula("");
            setCedulaNotFound(false);
            setCedulaParticipando(false);
            setButtonText("Buscar");
          } else if (response.status === 206) {
            showError("Esta participando");
          } else if (response.status === 201) {
            showSuccess(
              `Registro de la cédula ${data.cedula} COMPLETADO (${data.nombre})`
            );
            reset({ ...defaultValues, municipio: municipioNombre });
            setNombre("");
            setCedula("");
            setCedulaNotFound(false);
            setCedulaParticipando(false);
            setButtonText("Buscar");
            return setTimeout(() => {
              window.location.replace(
                "https://www.instagram.com/eduardespiritusanto/"
              );
            }, 2000);
          }
        }
      });
    } catch (error) {
      console.error(error);
      showError(`Intente más tarde ${municipioNombre}`);
      setButtonText("Buscar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cedulaValue = event.target.value;
    if (cedulaValue.length === 13) {
      const serieCedula = cedulaValue.slice(0, 3);
      console.log(serieCedula);

      await checkCedula(cedulaValue);
    }
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const cedulaValue = (event.target as HTMLInputElement).value;
      if (cedulaValue.length === 13) {
        await checkCedula(cedulaValue);
      }
    }
  };

  const handleMunicipioChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMunicipio(event.target.value);
    setValue("municipio", event.target.value);
  };

  const handleBoletoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const boletoValue = event.target.value.toUpperCase();
    setValue("boleto", boletoValue);
  };

  const registerSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.cedula.length === 13 && (nombre || cedulaNotFound)) {
      await handleRegister({
        ...data,
        nombre: nombre || data.nombre,
        municipio: municipioNombre,
        premio: "-",
        status: 1,
      });
    } else {
      showError(errorMessages.cedulaNoValida);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* <WhatsAppButton /> */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden p-6">
          <img
            src="/registrate-aqui-ap.jpeg"
            alt="Padres banner"
            className="w-full h-auto rounded-lg mb-6"
          />

          <form onSubmit={handleSubmit(registerSubmit)} className="space-y-4">
            <div className="relative">
              <InputMask
                mask="999-9999999-9"
                placeholder="___-_______-_"
                maskChar=""
                {...register("cedula", {
                  required: "La cédula obligatoria",
                  pattern: {
                    value: /^\d{3}-\d{7}-\d{1}$/,
                    message: "Formato de cédula inválido",
                  },
                  minLength: 13,
                  maxLength: 13,
                  onBlur: handleBlur,
                })}
                disabled={isSubmitting}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    className={`w-full p-3 rounded-lg border ${
                      errors.cedula ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    onKeyDown={handleKeyPress}
                  />
                )}
              </InputMask>
              <label className="absolute left-3 -top-2 bg-white px-1 text-sm text-gray-500">
                Cédula
              </label>
              {errors.cedula && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.cedula.message}
                </p>
              )}
            </div>

            {isSubmitting && (
              <p className="text-sm text-yellow-600">
                Estamos buscando su cédula en la base de datos. Mientras puede
                ir llenando los demás datos del formulario.
              </p>
            )}

            {nombre && !cedulaNotFound && !cedulaParticipando && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="font-medium">Nombre: {nombre}</p>
              </div>
            )}

            {cedulaNotFound && (
              <div className="relative">
                <input
                  {...register("nombre", {
                    required: errorMessages.nombreRequerido,
                    validate: (value) =>
                      /^[A-Za-z\s]{3,}(\s[A-Za-z\s]{3,})+$/.test(value) ||
                      "Debe ingresar nombre y apellido, o nombre completo",
                  })}
                  className={`w-full p-3 rounded-lg border ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Nombre y Apellido"
                  ref={nombreRef}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^a-zA-Z\s]/g, "");
                  }}
                  disabled={isSubmitting}
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.nombre.message}
                  </p>
                )}
              </div>
            )}

            <div className="relative">
              <InputMask
                mask="(999) 999-9999"
                maskChar=""
                {...register("telefono", {
                  required: "El número de teléfono es obligatorio",
                  pattern: {
                    value: /^\(\d{3}\) \d{3}-\d{4}$/,
                    message: "Formato de número de teléfono inválido",
                  },
                  minLength: 14,
                  maxLength: 14,
                })}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    className={`w-full p-3 rounded-lg border ${
                      errors.telefono ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    placeholder="Número de celular"
                  />
                )}
              </InputMask>
              <label className="absolute left-3 -top-2 bg-white px-1 text-sm text-gray-500">
                Teléfono
              </label>
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <div className="relative">
              <select
                value={municipio}
                onChange={handleMunicipioChange}
                className={`w-full p-3 rounded-lg border ${
                  errors.municipio ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white`}
              >
                <option value="" disabled>
                  Seleccione el municipio
                </option>
                <option value="la-romana">La Romana</option>
                <option value="caleta">Caleta</option>
                <option value="guaymate">Guaymate</option>
                <option value="villa-hermosa">Villa Hermosa</option>
                <option value="cumayasa">Cumayasa</option>
              </select>
              <label className="absolute left-3 -top-2 bg-white px-1 text-sm text-gray-500">
                Municipio
              </label>
            </div>

            <button
              type="submit"
              className={`w-full p-3 rounded-lg font-medium text-white ${
                buttonText === "Buscar"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-500 hover:bg-green-600"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                buttonText === "Buscar"
                  ? "focus:ring-blue-500"
                  : "focus:ring-green-500"
              } disabled:opacity-50`}
              disabled={isSubmitting || cedulaParticipando}
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-auto">
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium mb-4">
                Redireccionando a Instagram...
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroPadres;
