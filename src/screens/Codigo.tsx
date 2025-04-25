import { useState, useEffect } from "react";
import ViewRegistros from "./ViewRegistros";
import Swal from "sweetalert2";

const Codigo = () => {
  const [showView, setShowView] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const codigoCorrecto = "es2025";
  const TOKEN_KEY = "view_registros_token";
  const TOKEN_EXPIRY_KEY = "view_registros_expiry";
  const TOKEN_DURATION = 2 * 60 * 1000; // 2 minutos en milisegundos

  useEffect(() => {
    // Comprobar si existe un token válido al cargar el componente
    checkExistingToken();

    // Configurar el temporizador para actualizar el tiempo restante
    let timer: NodeJS.Timeout | null = null;

    if (showView && timeLeft !== null) {
      timer = setInterval(() => {
        const currentTime = Date.now();
        const expiryTime = Number(localStorage.getItem(TOKEN_EXPIRY_KEY) || 0);
        const remaining = Math.max(0, expiryTime - currentTime);

        if (remaining <= 0) {
          clearInterval(timer!);
          handleSessionExpired();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showView, timeLeft]);

  const checkExistingToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiryTime = Number(localStorage.getItem(TOKEN_EXPIRY_KEY) || 0);
    const currentTime = Date.now();

    if (token && expiryTime > currentTime) {
      // Token válido, mostrar la vista y establecer el tiempo restante
      setShowView(true);
      setTimeLeft(expiryTime - currentTime);
    } else {
      // Token expirado o no existente, limpiar localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      setShowView(false);
      setTimeLeft(null);
    }
  };

  const createNewToken = () => {
    const currentTime = Date.now();
    const expiryTime = currentTime + TOKEN_DURATION;

    // Guardar token y tiempo de expiración
    localStorage.setItem(TOKEN_KEY, "valid_token");
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

    setShowView(true);
    setTimeLeft(TOKEN_DURATION);

    Swal.fire({
      icon: "success",
      title: "Acceso concedido",
      text: "Su sesión estará activa durante 2 minutos",
      timer: 5000,
      timerProgressBar: true,
      position: "top-end",
      toast: true,
      showConfirmButton: false,
    });
  };

  const handleCodigoSubmit = () => {
    if (codigo === codigoCorrecto) {
      createNewToken();
    } else {
      Swal.fire({
        icon: "error",
        title: "Código incorrecto",
        text: "Por favor, intente nuevamente",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleCodigoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodigo(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCodigoSubmit();
    }
  };

  const handleSessionExpired = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setShowView(false);
    setTimeLeft(null);
    setCodigo("");

    Swal.fire({
      icon: "warning",
      title: "Sesión expirada",
      text: "Su tiempo de acceso ha finalizado. Por favor ingrese el código nuevamente.",
      confirmButtonColor: "#3085d6",
    });
  };

  const handleManualLogout = () => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea cerrar la sesión actual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSessionExpired();
      }
    });
  };

  // Formatear el tiempo restante en minutos:segundos
  const formatTimeLeft = () => {
    if (timeLeft === null) return "";

    const totalSeconds = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Mostrar advertencia cuando quede menos de 30 segundos
  useEffect(() => {
    if (timeLeft !== null && timeLeft <= 30000 && timeLeft > 29000) {
      Swal.fire({
        icon: "warning",
        title: "¡Tiempo casi agotado!",
        text: "Su sesión expirará en 30 segundos",
        timer: 3000,
        timerProgressBar: true,
        position: "top-end",
        toast: true,
        showConfirmButton: false,
      });
    }
  }, [timeLeft]);

  return (
    <div>
      {!showView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Ingrese un código para continuar
              </h2>
              <p className="text-gray-600 mb-4">
                Ingrese el código para acceder a la vista de registros:
              </p>
              <input
                autoFocus
                type="password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                placeholder="Código"
                value={codigo}
                onChange={handleCodigoChange}
                onKeyPress={handleKeyPress}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleCodigoSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showView && (
        <div>
          <div className="bg-sky-800 text-white py-2 px-4 fixed top-0 left-0 right-0 z-10 flex justify-between items-center shadow-md">
            <div className="flex items-center">
              <div className="mr-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                Tiempo restante:{" "}
                <span
                  className={`font-bold ${
                    timeLeft && timeLeft < 30000 ? "text-red-300" : ""
                  }`}
                >
                  {formatTimeLeft()}
                </span>
              </div>
            </div>
            <button
              onClick={handleManualLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar sesión
            </button>
          </div>

          {/* Añadir un margen superior para compensar la barra de tiempo */}
          <div className="pt-12">
            <ViewRegistros />
          </div>
        </div>
      )}
    </div>
  );
};

export default Codigo;
