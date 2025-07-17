import React, { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import RegistrosService from "../../services/RegistrosService";
import WhatsAppButton from "../../components/WhatsAppButton";
import { useLocation } from "react-router-dom";

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
  boleto: "N/A",
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
  const [buttonText, setButtonText] = useState("Buscar cédula");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMunicipio, setSelectedMunicipio] = useState("");

  const errorMessages = {
    invalidMunicipio: "Seleccione el color de su boleta",
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

  const municipios = [
    {
      id: "la-romana",
      name: "La Romana",
      color: "bg-[#f86e51]",
      textColor: "text-[#fff]",
    },
    {
      id: "villa-hermosa",
      name: "Villa Hermosa",
      color: "bg-[#1c9143]",
      textColor: "text-[#fff]",
    },
    {
      id: "caleta",
      name: "Caleta",
      color: "bg-[#81360d]",
      textColor: "text-[#fff]",
    },
    {
      id: "cumayasa",
      name: "Cumayasa",
      color: "bg-[#14348e]",
      textColor: "text-[#fff]",
    },
    {
      id: "guaymate",
      name: "Guaymate",
      color: "bg-[#7b827e]",
      textColor: "text-[#fff]",
    },
  ];

  const resetMunicipioButtons = () => {
    setSelectedMunicipio("");
    setMunicipio("");
    setValue("municipio", "");
  };

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
        setButtonText("Buscar cédula");
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
        setButtonText("Buscar cédula");
      }
    } catch (error) {
      console.error(error);
      setButtonText("Buscar cédula");
    }
  };

  const location = useLocation();

  const noRedirectURL = ["/registroLocal", "/registrolocal"];

  const noRedirect = noRedirectURL.includes(location.pathname);

  const handleRegister = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
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
                <p> Municipio: <b>${data.municipio
                  .split("-")
                  .join(" ")
                  .toUpperCase()}</b></p>`,
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
            reset({ ...defaultValues, municipio: municipioNombre });
            setNombre("");
            setCedula("");
            setCedulaNotFound(false);
            setCedulaParticipando(false);
            setButtonText("Buscar cédula");
            resetMunicipioButtons();
          }

          if (response.status === 203) {
            showError(errorMessages.cedulaParticipando);
            reset({ ...defaultValues, municipio: municipioNombre });
            setNombre("");
            setCedula("");
            setCedulaNotFound(false);
            setCedulaParticipando(false);
            setButtonText("Buscar cédula");
            resetMunicipioButtons();
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
            setButtonText("Buscar cédula");
            resetMunicipioButtons();
            return setTimeout(() => {
              noRedirect
                ? ""
                : window.location.replace(
                    "https://www.instagram.com/eduardespiritusanto/"
                  );
            }, 2000);
          }
        } else {
          // Si el usuario elige "Editar datos", resetear los botones de municipio
          resetMunicipioButtons();
        }
      });
    } catch (error) {
      console.error(error);
      showError(`Intente más tarde ${municipioNombre}`);
      setButtonText("Buscar cédula");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cedulaValue = event.target.value;
    if (cedulaValue.length === 13) {
      const serieCedula = cedulaValue.slice(0, 3);
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

  const handleMunicipioSelect = (municipioId: string) => {
    setSelectedMunicipio(municipioId);
    setMunicipio(municipioId);
    setValue("municipio", municipioId);
  };

  const handleBoletoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const boletoValue = event.target.value.toUpperCase();
    setValue("boleto", boletoValue);
  };

  const registerSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.cedula.length === 13 && (nombre || cedulaNotFound)) {
      if (!data.municipio) {
        showError(errorMessages.invalidMunicipio);
        return;
      }
      await handleRegister({
        ...data,
        nombre: nombre || data.nombre,
        municipio: data.municipio,
        premio: "-",
        status: 1,
      });
    } else {
      showError(errorMessages.cedulaNoValida);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900 p-4 ">
      {/* <WhatsAppButton /> */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden p-6">
          <img
            src="/registrate-aqui-app.jpeg"
            alt="Padres banner"
            className="w-full h-auto rounded-lg mb-3"
          />
          <form onSubmit={handleSubmit(registerSubmit)} className="space-y-4">
            <div className="relative">
              <div className="relative mb-5">
                <label className="block text-lg font-bold text-gray-900 mb-2 uppercase">
                  Seleccione el color de su boleta:
                </label>

                {selectedMunicipio && (
                  <h2 className="text-center text-gray-900 text-2xl font-black uppercase mb-3">
                    {municipios.find((muni) => muni.id === selectedMunicipio)
                      ?.name || ""}
                  </h2>
                )}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {
                    municipios.map((muni) => (
                      <button
                        key={muni.id}
                        type="button"
                        className={`p-3 rounded-md uppercase font-bold ${
                          selectedMunicipio === muni.id
                            ? `${muni.color}  text-white`
                            : selectedMunicipio
                            ? "bg-gray-300 text-gray-300" // Deshabilitado si hay otro seleccionado
                            : `${muni.color} text-white`
                        } transition-colors`}
                        onClick={() => handleMunicipioSelect(muni.id)}
                        disabled={
                          selectedMunicipio !== "" &&
                          selectedMunicipio !== muni.id
                        }
                      >
                        {muni.name}
                      </button>
                    ))
                    // .sort(() => Math.random() - 0.5)
                  }
                </div>

                {errors.municipio && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.municipio.message || errorMessages.invalidMunicipio}
                  </p>
                )}
              </div>
              <div className="flex">
                <div className="flex-grow relative">
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
                        inputMode="numeric"
                        onKeyDown={handleKeyPress}
                        ref={inputRef}
                      />
                    )}
                  </InputMask>
                  <label className="absolute left-3 -top-2 bg-white px-1 text-sm font-bold uppercase text-gray-700">
                    Cédula
                  </label>
                </div>
                <button
                  type="button"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg ml-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  onClick={() => {
                    const cedulaValue = (
                      document.querySelector(
                        'input[name="cedula"]'
                      ) as HTMLInputElement
                    )?.value;
                    if (cedulaValue && cedulaValue.length === 13) {
                      checkCedula(cedulaValue);
                    } else {
                      showError(errorMessages.cedulaNoValida);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
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
              <div>
                <input
                  {...register("nombre", {
                    required: errorMessages.nombreRequerido,
                    pattern: {
                      value:
                        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,})+$/,
                      message:
                        "Debe ingresar al menos nombre y apellido (sin números/símbolos)",
                    },
                  })}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNombre(value); // Actualiza el estado local
                    setValue("nombre", value); // Actualiza react-hook-form
                  }}
                  onInput={(e) => {
                    // Permite letras, espacios y caracteres acentuados
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "")
                      .replace(/\s+/g, " ")
                      .trimStart();
                  }}
                  // onInput={(e) => {
                  //   // Elimina todo excepto letras, espacios y caracteres acentuados
                  //   e.currentTarget.value = e.currentTarget.value.replace(
                  //     /[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,
                  //     ""
                  //   );
                  // }}
                  disabled={isSubmitting}
                  className={`w-full p-3 rounded-lg border ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="NOMBRE Y APELLIDO"
                  ref={nombreRef}
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
                    placeholder="(000) 000-0000"
                    inputMode="numeric"
                  />
                )}
              </InputMask>
              <label className="absolute left-3 -top-2 bg-white px-1 text-sm text-gray-700 uppercase font-bold">
                Celular
              </label>
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-500 ">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full p-3 uppercase rounded-lg font-medium text-white ${
                buttonText === "Buscar cédula"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-500 hover:bg-green-600"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                buttonText === "Buscar cédula"
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
              <h3 className="text-lg font-medium mb-4 uppercase">
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
