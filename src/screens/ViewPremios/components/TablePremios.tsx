import React from "react";

interface Premio {
  slug_premio: string;
  premio: string;
  la_romana: string;
  caleta: string;
  villa_hermosa: string;
  cumayasa: string;
  guaymate: string;
}

interface PremioSelectProps {
  premios: Premio[];
}

const TablePremios: React.FC<PremioSelectProps> = ({ premios }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-600">
          <tr>
            <th className="px-4 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
              Premios
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
              La Romana
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
              Villa Hermosa
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
              Caleta
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
              Guaymate
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
              Cumayasa
            </th>
            <th className="px-4 py-3 text-center text-sm font-bold text-white uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {premios.map((row) => {
            const total =
              parseInt(row.la_romana) +
              parseInt(row.villa_hermosa) +
              parseInt(row.caleta) +
              parseInt(row.guaymate) +
              parseInt(row.cumayasa);

            return (
              <tr key={row.premio} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-white bg-green-600 uppercase">
                  {row.premio}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  {row.la_romana}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  {row.villa_hermosa}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  {row.caleta}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  {row.guaymate}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  {row.cumayasa}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-white bg-green-800 text-center">
                  {total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablePremios;
