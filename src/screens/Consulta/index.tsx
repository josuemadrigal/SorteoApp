import React, { useEffect, useState } from "react";
// import GifTombola from "../../../public/gif-TOMBOLA.gif";
import { useMutation } from "react-query";

import registrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";
import { RenderBoletas } from "../../components/RenderBoletas";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface Registro {
  cedula: any;
  nombre: string;
  telefono: string;
}

// Definir la interfaz local para evitar conflictos
interface ApiRegistrosResponse {
  ok: boolean;
  registro?: Registro; // Cambiado: ahora es un solo registro
  registros?: Registro[]; // Mantener por compatibilidad
  municipio?: string;
  msg?: string;
}

const Consulta = () => {
  const [guardado, setGuardado] = useState(true);
  const [checkList, setCheckList] = useState<Registro[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [unCheckList, setUnCheckList] = useState<string[]>([]);
  const [premio, setPremio] = useState("Motor");
  const [premioSlug, setPremioSlug] = useState("motor");
  const [municipioT, setMunicipioT] = useState("");
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [terminado, setTerminado] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Entrar en pantalla completa
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error al intentar pantalla completa: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      // Salir de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isFullscreen]);

  const FullscreenButton = ({
    isFullscreen,
    onClick,
  }: {
    isFullscreen: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
      title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
    >
      {isFullscreen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      )}
    </button>
  );

  const municipioHandle = (municipio: string) => {
    setMunicipioT(municipio);
    // Reset estados cuando se cambie municipio
    setTerminado(false);
    setIsSearchButtonDisabled(false);
    setCheckList([]);
    setCheckedItems(new Set());
  };

  const { mutate: getRegistros } = useMutation(
    async () => {
      if (!municipioT) {
        throw new Error("Debe seleccionar un municipio");
      }
      console.log("Buscando registros para municipio:", municipioT);
      const response = await registrosService.getRegistros(municipioT);
      console.log("Response completa:", response);
      console.log("Response.data:", response.data);
      return response.data as ApiRegistrosResponse;
    },
    {
      onSuccess: (data: ApiRegistrosResponse) => {
        console.log("Datos recibidos:", data);

        // Verificar si la respuesta es exitosa
        if (!data.ok) {
          throw new Error(data.msg || "Error en la respuesta del servidor");
        }

        // Manejar tanto el formato nuevo (un registro) como el viejo (múltiples)
        let registros: Registro[] = [];

        if (data.registro) {
          // Formato nuevo: un solo registro
          registros = [data.registro];
          console.log("Registro único encontrado:", data.registro);
        } else if (data.registros && Array.isArray(data.registros)) {
          // Formato viejo: múltiples registros
          registros = data.registros;
          console.log("Múltiples registros encontrados:", data.registros);
        }

        console.log("Registros procesados:", registros);

        if (registros.length === 0) {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: `No se encontraron registros para ${municipioT}`,
            text: "Intenta con otro municipio",
            showConfirmButton: true,
          });
          setIsLoading(false);
          setIsSearchButtonDisabled(false);
          return;
        }

        setCheckList(registros);
        const checkedNames = new Set(
          registros.map((registro) => String(registro.cedula))
        );
        setCheckedItems(checkedNames);

        setUnCheckList([]);
        setIsSearchButtonDisabled(true);
        setIsSaveButtonDisabled(false);
        autoActualizarRegistros(registros);
        setIsLoading(false);
        setTerminado(true);
      },
      onError: (error) => {
        console.error("Error en la consulta:", error);

        let errorMessage = "Error al obtener los registros";
        if (error.message.includes("404")) {
          errorMessage = `No hay registros disponibles para ${municipioT}`;
        } else if (error.message.includes("400")) {
          errorMessage = "Municipio no válido";
        } else if (error.message) {
          errorMessage = error.message;
        }

        Swal.fire({
          position: "center",
          icon: "error",
          title: errorMessage,
          showConfirmButton: true,
        });

        setIsSearchButtonDisabled(false);
        setIsLoading(false);
      },
    }
  );

  const buscarRegistros = async () => {
    if (!municipioT) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Selecciona un municipio",
        text: "Haz clic en uno de los cuadros de colores",
        showConfirmButton: true,
      });
      return;
    }

    setIsLoading(true);
    setGuardado(true);
    setCheckList([]); // Limpiar lista anterior
    setCheckedItems(new Set()); // Limpiar checked items

    console.log("Iniciando búsqueda para municipio:", municipioT);
    getRegistros();
  };

  const autoActualizarRegistros = async (registros: Registro[]) => {
    console.log("GUARDANDO ----");
    console.log(registros);
    if (registros.length > 0) {
      for (const element of registros) {
        const status = 3;
        const premioText = premio;

        try {
          await registrosService.startUpdate(
            String(element.cedula),
            status,
            premioText,
            "-",
            premioSlug,
            String(element.telefono),
            String(element.nombre),
            municipioT
          );
          console.log(`Registro actualizado: ${element.nombre}`);
        } catch (error) {
          console.error(
            `Error actualizando registro ${element.cedula}:`,
            error
          );
        }
      }
    }
  };

  const actualizarRegistrosMujer = async (registros: Registro[]) => {
    console.log("GUARDANDO ----");
    console.log(registros);
    if (registros.length > 0) {
      for (const element of registros) {
        const status = 1;

        try {
          await registrosService.startUpdate(
            String(element.cedula),
            status,
            "mujer",
            "-",
            "mujer",
            String(element.telefono),
            String(element.nombre),
            municipioT
          );
          console.log(`Registro actualizado: ${element.nombre}`);
        } catch (error) {
          console.error(
            `Error actualizando registro ${element.cedula}:`,
            error
          );
        }
      }
    }
  };

  const filteredCheckList = checkList.filter((item) =>
    checkedItems.has(String(item.cedula))
  );

  // Función para obtener el nombre del municipio
  const getMunicipioNombre = (municipio: string) => {
    const nombres = {
      "la-romana": "La Romana",
      "villa-hermosa": "Villa Hermosa",
      guaymate: "Guaymate",
      caleta: "Caleta",
      cumayasa: "Cumayasa",
    };
    return nombres[municipio as keyof typeof nombres] || municipio;
  };

  return (
    <div className="flex flex-col md:flex-row p-2 bg-emerald-900 min-h-screen max-h-screen overflow-hidden">
      {/* Sidebar */}
      <FullscreenButton
        isFullscreen={isFullscreen}
        onClick={toggleFullscreen}
      />
      <div className="w-16 md:w-56 sm:h-[94vh] bg-white shadow-md rounded-lg p-4  md:relative overflow-hidden sticky">
        <img src="/gif-TOMBOLA.gif" alt="TOMBOLA" className="w-[90%] mx-auto" />

        {/* Mostrar municipio seleccionado */}

        <button
          disabled={isLoading || terminado || !municipioT}
          onClick={buscarRegistros}
          className={`
        ${
          isLoading || terminado || !municipioT
            ? "bg-gray-400 cursor-not-allowed opacity-50"
            : "bg-lime-500 hover:bg-lime-600 cursor-pointer"
        } 
        text-emerald-50 mt-10 font-black items-center flex flex-col justify-center h-36 w-44 rounded-xl shadow-xl transition-all duration-200
      `}
        >
          {isLoading ? (
            <>
              BUSCANDO...
              <div className="animate-spin h-8 w-8 border-2 border-emerald-50 border-t-transparent rounded-full mt-1"></div>
            </>
          ) : terminado ? (
            <> FINALIZADO</>
          ) : (
            <>
              SORTEAR
              <MagnifyingGlassIcon className="h-8 w-8 font-black" />
            </>
          )}
        </button>

        {/* Botón de reinicio */}
        {terminado && (
          <>
            <button
              onClick={() => {
                setTerminado(false);
                setIsSearchButtonDisabled(false);
                setCheckList([]);
                setCheckedItems(new Set());
                setMunicipioT("");
              }}
              className="bg-green-700 hover:bg-green-800 text-white mt-4 font-bold py-2 px-4 rounded-lg w-44 transition-all duration-200"
            >
              NUEVO SORTEO
            </button>
            <button
              onClick={() => {
                actualizarRegistrosMujer(checkList);
                setTerminado(false);
                setIsSearchButtonDisabled(false);
                setCheckList([]);
                setCheckedItems(new Set());
                setMunicipioT("");
              }}
              className="bg-red-900 hover:bg-red-950 text-white mt-4 font-bold py-2 px-4 rounded-lg w-44 transition-all duration-200"
            >
              No valido{" "}
            </button>
          </>
        )}

        <div className="flex space-x-3 bottom-0 right-0 absolute">
          <div
            className={`w-5 h-5 rounded-md cursor-pointer transition-all bg-gray-200 `}
            onClick={() => municipioHandle("la-romana")}
            title="La Romana"
          />
          <div
            className={`w-5 h-5 rounded-md cursor-pointer transition-all bg-gray-200 `}
            onClick={() => municipioHandle("villa-hermosa")}
            title="Villa Hermosa"
          />
          <div
            className={`w-5 h-5 rounded-md cursor-pointer transition-all bg-gray-200 `}
            onClick={() => municipioHandle("guaymate")}
            title="Guaymate"
          />
          <div
            className={`w-5 h-5 rounded-md cursor-pointer transition-all bg-gray-200 `}
            onClick={() => municipioHandle("caleta")}
            title="Caleta"
          />
          <div
            className={`w-5 h-5 rounded-md cursor-pointer transition-all bg-gray-200 `}
            onClick={() => municipioHandle("cumayasa")}
            title="Cumayasa"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-5 w-80 md:w-[calc(100%-10rem)] min-h-full  bg-green-800 rounded-lg p-4 overflow-hidden sticky pb-20">
        <div className="w-full bg-blue-600 min-h-[50px] py-2 px-0 rounded-t-lg">
          <div className="text-white text-center uppercase font-bold text-xl md:text-3xl flex flex-row items-center justify-center">
            GANADOR DE UN MOTOR
          </div>
        </div>

        <div className="flex justify-center w-full bg-green-800 rounded-b-lg max-h-[100%] overflow-y -scroll pb-60">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center mt-40">
              <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
              <p className="text-white mt-4">Buscando ganador...</p>
            </div>
          ) : filteredCheckList.length <= 0 && !terminado ? (
            <p className="opacity-25 uppercase tracking-wider mt-40 text-gray-300">
              Presiona sortear
            </p>
          ) : filteredCheckList.length > 0 ? (
            <RenderBoletas items={filteredCheckList} />
          ) : terminado && filteredCheckList.length === 0 ? (
            <p className="opacity-50 uppercase tracking-wider mt-40 text-gray-300">
              No se encontraron registros
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Consulta;
