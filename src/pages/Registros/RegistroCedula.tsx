import * as React from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useEffect, useRef } from "react";
import RegistrosService from "../../services/RegistrosService";

const modelo = {
  defaultValues: {
    nombre: "",
    cedula: "",
    status: 1,
  },
};

export const RegistroCedula = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm(modelo);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(registerSubmit)();
    }
  };

  const registerSubmit = async (objeto: any) => {
    const errorMessages = {
      duplicateBoleta: "Esta cédula ya ha sido registrada",
      emptyFields: "Todos los campos son obligatorios",
    };

    const showError = (title: string) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title,
        showConfirmButton: false,
        timer: 2000,
      });
      reset({ cedula: "" });
    };

    if (!objeto.cedula || !objeto.nombre) {
      showError(errorMessages.emptyFields);
      return;
    }

    try {
      const payload = {
        ...objeto,
        nombre: objeto.nombre.toUpperCase(),
        status: 1,
      };

      const response = await RegistrosService.regCedula(payload);

      if (response.status === 203) {
        showError(errorMessages.duplicateBoleta);
        reset({ cedula: "" });
      }

      if (response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Registro de la cédula ${objeto.cedula} COMPLETADO`,
          showConfirmButton: false,
          timer: 2000,
        });

        reset({
          cedula: "",
          nombre: "",
        });
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error(error);
      showError("Intente más tarde");
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Registro de cédula
        </h1>

        <form onSubmit={handleSubmit(registerSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cédula
            </label>
            <InputMask
              mask="999-9999999-9"
              maskChar=""
              {...register("cedula", { required: true, maxLength: 13 })}
              onChange={(e) => setValue("cedula", e.target.value)}
            >
              {(inputProps: any) => (
                <input
                  {...inputProps}
                  type="text"
                  className={`w-full p-3 rounded-lg border ${
                    errors.cedula ? "border-red-500" : "border-gray-300"
                  } bg-gray-50 focus:ring-2 focus:ring-green-500`}
                  placeholder="000-0000000-0"
                  ref={inputRef}
                  onKeyDown={handleKeyPress}
                />
              )}
            </InputMask>
            {errors.cedula && (
              <p className="mt-1 text-sm text-red-500">Cédula es requerida</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-lg border ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              } bg-gray-50 focus:ring-2 focus:ring-green-500 uppercase`}
              {...register("nombre", {
                required: "Debe indicar el nombre",
                maxLength: 80,
                minLength: 1,
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
              onKeyDown={handleKeyPress}
              maxLength={160}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-500">
                {errors.nombre.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};
