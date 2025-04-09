import React, { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import RegistrosService from "../../services/RegistrosService";
import { useLocation, useParams } from "react-router-dom";

interface FormValues {
  nombre: string;
  cedula: string;
  municipio: string;
  status: number;
  premio: string;
}

const defaultValues: FormValues = {
  nombre: "",
  cedula: "",
  municipio: "",
  status: 1,
  premio: "-",
};

const showError = (title: string) => {
  Swal.fire({
    position: "center",
    icon: "error",
    title,
    showConfirmButton: false,
    timer: 2000,
  });
};

const showSuccess = (title: string) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 2000,
  });
};

const Registro: React.FC = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cedulaNotFound, setCedulaNotFound] = useState(false);
  const [cedulaParticipando, setCedulaParticipando] = useState(false);

  const errorMessages = {
    invalidMunicipio: "Seleccione un municipio o distrito válido",
    invalidBoleta: "Ingrese una cédula válida",
    duplicateBoleta: "Esta cédula ya ha sido registrada",
    cedulaNotFound: "No se encontró un registro con esa cédula",
    cedulaNoValida: "Ingrese un numero de cedula valido",
    cedulaParticipando: `Esta cédula ya está participando`,
    nombreRequerido: "El nombre es necesario",
  };

  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const municipioNombre = id || "";
  const objeto = location.state?.parametros || {};
  const municipio = objeto.municipio || "";

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

      if (cedulaParti) {
        setNombreDB("");
        setNombre("");
        setCedula("");
        reset({ ...defaultValues, municipio: municipioNombre });
        setCedulaParticipando(false);
        setCedulaNotFound(false);
        setIsSubmitting(false);
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
      }

      if (!cedulaParti && response.data.ok === false) {
        setNombreDB(nombre);
        setCedulaNotFound(true);
        setNombre("");
        setCedula(cedula);
        setIsSubmitting(false);
        if (nombre) {
          await handleRegister({
            nombre,
            cedula,
            municipio: municipioNombre,
            premio: "-",
            status: 1,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const response = await RegistrosService.crearRegistros(data);
      if (response.status === 203) {
        showError(errorMessages.cedulaParticipando);
        reset({ ...defaultValues, municipio: municipioNombre });
        setNombre("");
        setCedula("");
        setCedulaNotFound(false);
        setCedulaParticipando(false);
      } else if (response.status === 201) {
        showSuccess(
          `Registro de la cédula ${data.cedula} COMPLETADO (${data.nombre})`
        );
        reset({ ...defaultValues, municipio: municipioNombre });
        setNombre("");
        setCedula("");
        setCedulaNotFound(false);
        setCedulaParticipando(false);
      }
    } catch (error) {
      console.error(error);
      showError(`Intente más tarde ${municipioNombre}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cedulaValue = event.target.value;
    if (cedulaValue.length === 13) {
      setIsSubmitting(true);
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
    <div className="min-h-screen flex items-center justify-center bg-green-900 p-4">
      <div className="w-full md:max-w-xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Image removed since src was commented out in original */}

        <div className="p-6">
          <img
            src="/registrate-aqui-app.jpeg"
            alt="Padres banner"
            className="w-full h-auto rounded-lg mb-6"
          />
          <h1 className="text-2xl text-center uppercase font-black mb-4 text-green-900">
            {municipio}
          </h1>

          <form onSubmit={handleSubmit(registerSubmit)} className="space-y-4">
            <div>
              <InputMask
                mask="999-9999999-9"
                maskChar=""
                {...register("cedula", {
                  required: true,
                  maxLength: 13,
                  onBlur: handleBlur,
                })}
                disabled={isSubmitting}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    ref={inputRef}
                    onKeyDown={handleKeyPress}
                    className={`w-full p-3 rounded-lg border ${
                      errors.cedula ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    placeholder="Cédula (___-_______-_)"
                  />
                )}
              </InputMask>
            </div>

            {isSubmitting && (
              <p className="text-sm text-yellow-600">
                Buscando cédula en la base de datos...
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
                  })}
                  ref={nombreRef}
                  disabled={isSubmitting}
                  className={`w-full p-3 rounded-lg border ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.nombre.message}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || cedulaParticipando}
              className={`w-full p-3 rounded-lg font-medium text-white ${
                isSubmitting ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              } transition-colors`}
            >
              {isSubmitting ? "Procesando..." : "Registrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;
