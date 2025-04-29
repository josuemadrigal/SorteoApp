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
  const [activationStatus, setActivationStatus] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info" | null;
  }>({ message: "", type: null });

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

  const showWarning = (title: string) => {
    Swal.fire({
      position: "center",
      icon: "warning",
      title,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const activarCedula = async (cedula: string) => {
    try {
      setIsSubmitting(true);
      setActivationStatus({ message: "", type: null });

      const res = await RegistrosService.activarParticipante(cedula);

      if (res.data.ok) {
        if (res.data.msg === "Cédula activada") {
          showSuccess(res.data.msg + ": " + res.data.participante);
          setActivationStatus({ message: res.data.msg, type: "success" });
        } else if (res.data.msg === "Cédula ya ha sido activada") {
          showWarning(res.data.msg + ": " + res.data.participante.nombre);
          setActivationStatus({ message: res.data.msg, type: "warning" });
        }
      } else {
        if (res.data.msg === "Cédula no está participando") {
          showError(res.data.msg);
          setCedulaNotFound(true);
          setActivationStatus({ message: res.data.msg, type: "error" });
        } else {
          showError(res.data.msg);
          setActivationStatus({ message: res.data.msg, type: "error" });
        }
      }

      return res.data;
    } catch (error) {
      console.error("Error al activar cédula:", error);
      showError("Error al procesar la solicitud");
      setActivationStatus({
        message: "Error al procesar la solicitud",
        type: "error",
      });
      return { ok: false, msg: "Error al procesar la solicitud" };
    } finally {
      setIsSubmitting(false);
    }
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
      setIsSubmitting(true);

      // Intentar activar la cédula primero
      const activacionResult = await activarCedula(cedula);

      // Si la cédula no está registrada y necesitamos registrarla
      if (activacionResult.msg === "Cédula no registrada") {
        try {
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
          console.error("Error al verificar cédula:", err);
        }
      } else {
        // Cédula ya está registrada y fue activada o ya estaba activada
        reset({ ...defaultValues, municipio: municipioNombre });
        inputRef.current?.focus();
      }
    } catch (err) {
      console.error("Error al procesar cédula:", err);
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

        // Después de registrar, intentamos activar la cédula
        await activarCedula(data.cedula);
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

  // const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   if (value.length === 13) {
  //     await checkCedula(value);
  //   }
  // };

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
    if (data.cedula.length === 13) {
      await checkCedula(data.cedula);
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
                placeholder="___-_______-_"
                maskChar=""
                disabled={isSubmitting}
                {...register("cedula", {
                  required: "La cédula obligatoria",
                  pattern: {
                    value: /^\d{3}-\d{7}-\d{1}$/,
                    message: "Formato de cédula inválido",
                  },
                  minLength: 13,
                  maxLength: 13,
                })}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    onKeyDown={handleKeyPress}
                    className={`w-full p-3 rounded-lg border ${
                      errors.cedula ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    inputMode="numeric"
                  />
                )}
              </InputMask>
            </div>

            {isSubmitting && (
              <p className="text-sm text-yellow-600">Procesando cédula...</p>
            )}

            {activationStatus.type && (
              <div
                className={`p-3 rounded-lg ${
                  activationStatus.type === "success"
                    ? "bg-green-100 text-green-800"
                    : activationStatus.type === "warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : activationStatus.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                <p className="font-medium">{activationStatus.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || cedulaParticipando}
              className={`w-full p-3 rounded-lg font-medium text-white ${
                isSubmitting ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              } transition-colors`}
            >
              {isSubmitting ? "Procesando..." : "Activar Participante"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivarPersona;
