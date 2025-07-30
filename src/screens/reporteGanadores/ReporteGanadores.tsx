import { useState, useEffect } from "react";
import { GeneratePDF } from "./components/GeneratePDF";
import RegistrosService from "../../services/RegistrosService";
import { colorPremio, formatPremio } from "./components/utils";
import MunicipioSelectReport from "./components/MunicipioSelectReport";

interface Registro {
  id: number;
  nombre: string;
  cedula: string;
  municipio: string;
  premio: string;
  status: string;
  telefono: string;
}

export const ReporteGanadores = () => {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [municipio, setMunicipio] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RegistrosService.getRegistrosGanadoresMunicipio(
          municipio
        );

        setRegistros(response.data.registros);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [municipio]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMunicipio(e.target.value);
  };
  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte de Ganadores</h1>

      <div className="mb-4 flex justify-between">
        <MunicipioSelectReport value={municipio} onChange={handleChange} />

        <GeneratePDF
          registros={registros}
          title="Listado Oficial de Ganadores"
          municipio={municipio.toLocaleUpperCase()}
        />
      </div>

      {/* Opcional: Mostrar una tabla con los datos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Cédula</th>
              <th className="py-2 px-4 border">Premio</th>
              <th className="py-2 px-4 border">Municipio</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id} className={colorPremio(registro.premio)}>
                <td className="py-2 px-4 border uppercase">
                  {registro.nombre}
                </td>
                <td className="py-2 px-4 border">{registro.cedula}</td>
                <td className="py-2 px-4 border">
                  {formatPremio(registro.premio)}
                </td>
                <td className="py-2 px-4 border">{registro.municipio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
