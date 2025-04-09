import React, { useEffect, useState } from "react";
import registrosService from "../../services/RegistrosService";

interface RegistroCountByMunicipioProps {
  registros: { municipio: string; count: number }[];
}

const RegistroCountByMunicipio: React.FC<RegistroCountByMunicipioProps> = ({
  registros,
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

  return (
    <div className="space-y-4">
      <h2 className="font-bold uppercase text-xl text-center bg-gray-300 p-3 rounded-lg">
        Conteo de Registros por Municipio
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {registros.map((registro) => (
          <div
            key={registro.municipio}
            className="bg-gray-100 p-4 rounded-lg text-center shadow-sm"
          >
            <h3 className="text-lg font-semibold">
              {formatMunicipioName(registro.municipio)}
            </h3>
            <p className="text-gray-700">Cantidad: {registro.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewRegistros = () => {
  const [registrosCountByMunicipio, setRegistrosCountByMunicipio] = useState<
    { municipio: string; count: number }[]
  >([]);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);

  useEffect(() => {
    const fetchRegistrosCountByMunicipio = async () => {
      try {
        const response = await registrosService.getRegistrosCountByMunicipio();
        if (response.data.ok) {
          setRegistrosCountByMunicipio(response.data.registros);
          const total = response.data.registros.reduce(
            (accumulator, current) => accumulator + current.count,
            0
          );
          setTotalRegistros(total);
        }
      } catch (error) {
        console.error("Error fetching registros count by municipio", error);
      }
    };

    fetchRegistrosCountByMunicipio();
    const interval = setInterval(fetchRegistrosCountByMunicipio, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4  ">
      <div className="bg-green-800 rounded-xl p-6 mx-auto max-w-7xl min-h-[80vh] flex flex-col items-center justify-center">
        <div className="flex flex-col space-y-6 ">
          <RegistroCountByMunicipio registros={registrosCountByMunicipio} />
          <h2 className="text-3xl font-bold text-white">
            Total de Registros: {totalRegistros}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ViewRegistros;
