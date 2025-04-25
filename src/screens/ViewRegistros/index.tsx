import React, { useEffect, useState } from "react";
import registrosService from "../../services/RegistrosService";

interface RegistroCountByMunicipioProps {
  registros: { municipio: string; count: number }[];
  title: string;
  totalRegistros: number;
}

const RegistroCountByMunicipio: React.FC<RegistroCountByMunicipioProps> = ({
  registros,
  title,
  totalRegistros,
}) => {
  const formatMunicipioName = (municipio: string) => {
    switch (municipio) {
      case "la-romana":
        return "La Romana";
      case "villa-hermosa":
        return "Villa Hermosa";
      case "caleta":
        return "Caleta";
      case "cumayasa":
        return "Cumayasa";
      case "guaymate":
        return "Guaymate";
      default:
        return municipio;
    }
  };

  // Obtener el color del card según el municipio
  const getMunicipioColor = (municipio: string) => {
    switch (municipio) {
      case "la-romana":
        return "bg-blue-100 border-blue-300";
      case "villa-hermosa":
        return "bg-green-100 border-green-300";
      case "caleta":
        return "bg-yellow-100 border-yellow-300";
      case "cumayasa":
        return "bg-purple-100 border-purple-300";
      case "guaymate":
        return "bg-red-100 border-red-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  // Calcular el porcentaje para cada municipio
  const calculatePercentage = (count: number) => {
    if (totalRegistros === 0) return 0;
    return ((count / totalRegistros) * 100).toFixed(1);
  };

  return (
    <div className="w-full">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {registros.map((registro) => (
            <div
              key={registro.municipio}
              className={`p-4 rounded-lg border-2 ${getMunicipioColor(
                registro.municipio
              )} transition-transform hover:scale-105`}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {formatMunicipioName(registro.municipio)}
              </h3>
              <p className="text-3xl font-bold text-gray-700">
                {registro.count}
              </p>
              <p className="text-sm text-gray-500">
                {calculatePercentage(registro.count)}% del total
              </p>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${calculatePercentage(registro.count)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-lg px-6 py-3 inline-block">
            <h2 className="text-2xl font-bold text-gray-800">
              Total: <span className="text-green-600">{totalRegistros}</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewRegistros = () => {
  const [registrosCountByMunicipio, setRegistrosCountByMunicipio] = useState<
    { municipio: string; count: number }[]
  >([]);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);

  const [
    registrosCountByMunicipioActivos,
    setRegistrosCountByMunicipioActivos,
  ] = useState<{ municipio: string; count: number }[]>([]);
  const [totalRegistrosActivos, setTotalRegistrosActivos] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch total registros
        const response = await registrosService.getRegistrosCountByMunicipio();
        if (response.data.ok) {
          setRegistrosCountByMunicipio(response.data.registros);
          const total = response.data.registros.reduce(
            (accumulator, current) => accumulator + current.count,
            0
          );
          setTotalRegistros(total);
        }

        // Fetch registros activos
        const responseActivos =
          await registrosService.getRegistrosCountByMunicipioActivo();
        if (responseActivos.data.ok) {
          setRegistrosCountByMunicipioActivos(responseActivos.data.registros);
          const total = responseActivos.data.registros.reduce(
            (accumulator, current) => accumulator + current.count,
            0
          );
          setTotalRegistrosActivos(total);
        }

        // Set last update time
        const now = new Date();
        setLastUpdate(now.toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-green-950 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-50">
            Dashboard de Registros
          </h1>
          <p className="text-gray-100">
            Última actualización: {lastUpdate || "Cargando..."}
            {loading && (
              <span className="ml-2 inline-block">
                <svg
                  className="animate-spin h-4 w-4 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <RegistroCountByMunicipio
            registros={registrosCountByMunicipio}
            title="Registros Totales por Municipio"
            totalRegistros={totalRegistros}
          />

          <RegistroCountByMunicipio
            registros={registrosCountByMunicipioActivos}
            title="Registros Activos por Municipio"
            totalRegistros={totalRegistrosActivos}
          />
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Resumen General
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-600">Total de Registros</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalRegistros}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-gray-600">Registros Activos</p>
              <p className="text-3xl font-bold text-green-600">
                {totalRegistrosActivos}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-gray-600">Porcentaje Activos</p>
              <p className="text-3xl font-bold text-lime-600">
                {totalRegistros > 0
                  ? ((totalRegistrosActivos / totalRegistros) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-gray-600">Registros Inactivos</p>
              <p className="text-3xl font-bold text-orange-600">
                {totalRegistros - totalRegistrosActivos}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRegistros;
