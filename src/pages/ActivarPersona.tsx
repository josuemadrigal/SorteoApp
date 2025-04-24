import React, { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import RegistrosService from "../services/RegistrosService";
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

const ActivarPersona: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [nombre, setNombre] = useState("");
  const [nombreDB, setNombreDB] = useState("");
  const [cedula, setCedula] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cedulaNotFound, setCedulaNotFound] = useState(false);
  const [cedulaParticipando, setCedulaParticipando] = useState(false);

  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const municipioNombre = id || "";
  const objeto = location.state?.parametros || {};
  const municipio = objeto.municipio || "";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cedulaNotFound) {
      setFocus("nombre");
    }
  }, [cedulaNotFound, setFocus]);

  const errorMessages = {
    cedulaParticipando: "Esta cédula ya está participando",
    nombreRequerido: "El nombre es obligatorio",
    cedulaNoValida: "Ingrese un número de cédula válido",
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

  const checkParticipando = async (cedula: string) => {
    const res = await RegistrosService.checkParticipando(cedula);
    if (res.data.participando) {
      showError(errorMessages.cedulaParticipando);
      return true;
    }
    return false;
  };

  const checkCedula = async (cedula: string) => {
    try {
      const participando = await checkParticipando(cedula);
      if (participando) {
        reset({ ...defaultValues, municipio: municipioNombre });
        setNombre("");
        setCedula("");
        setCedulaNotFound(false);
        setCedulaParticipando(false);
        setIsSubmitting(false);
        return;
      }

      const res = await RegistrosService.getCedula(cedula);
      const reg = res.data.registro;

      if (reg?.nombre) {
        const nombre = reg.nombre.toUpperCase();
        setNombre(nombre);
        setNombreDB(nombre);
        setCedula(cedula);
        setCedulaNotFound(false);
      } else {
        setNombreDB(nombre);
        setCedulaNotFound(true);
        setNombre("");
        setCedula(cedula);
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const res = await RegistrosService.crearRegistros(data);
      if (res.status === 203) {
        showError(errorMessages.cedulaParticipando);
      } else if (res.status === 201) {
        showSuccess(`Registro de ${data.cedula} COMPLETADO (${data.nombre})`);
      }
      reset({ ...defaultValues, municipio: municipioNombre });
      setNombre("");
      setCedula("");
      setCedulaNotFound(false);
      setCedulaParticipando(false);
    } catch (error) {
      console.error(error);
      showError(`Intente más tarde (${municipioNombre})`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 13) {
      setIsSubmitting(true);
      await checkCedula(value);
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
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
        <div className="p-6">
          <img
            src="/registrate-aqui-app.jpeg"
            alt="Padres banner"
            className="w-full h-auto rounded-lg mb-6"
          />
          <h1 className="text-2xl text-center uppercase font-black mb-4 text-green-900">
            ACTIVAR PARTICIPANTE{" "}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <InputMask
                mask="999-9999999-9"
                maskChar=""
                disabled={isSubmitting}
                {...register("cedula", {
                  required: true,
                  maxLength: 13,
                  onBlur: handleBlur,
                })}
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
                    pattern: {
                      value:
                        /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,})+$/,
                      message: "Debe ingresar al menos nombre y apellido",
                    },
                  })}
                  onInput={(e) => {
                    // Elimina todo excepto letras, espacios y caracteres acentuados
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,
                      ""
                    );
                  }}
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

export default ActivarPersona;
