import React from "react";

interface Premio {
  nombre: string;
  cedula: string;
  premio: string;
  ronda: string;
  municipio: string;
}

interface PremioSelectProps {
  premios: Premio[];
}

const TableGanadores: React.FC<PremioSelectProps> = ({ premios }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Cédula
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Premio
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Ronda
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Municipio
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {premios.map((row) => (
            <tr
              key={row.cedula}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.nombre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.cedula}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.premio}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.ronda}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.municipio}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableGanadores;
