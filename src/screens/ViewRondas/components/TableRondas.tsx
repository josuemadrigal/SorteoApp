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

const TableRondas: React.FC<PremioSelectProps> = ({ premios }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table className="w-full border-collapse bg-white text-left text-sm">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="px-6 py-4 font-bold text-center">Premios</th>
            <th className="px-6 py-4 font-bold text-center">La Romana</th>
            <th className="px-6 py-4 font-bold text-center">Villa Hermosa</th>
            <th className="px-6 py-4 font-bold text-center">Caleta</th>
            <th className="px-6 py-4 font-bold text-center">Guaymate</th>
            <th className="px-6 py-4 font-bold text-center">Cumayasa</th>
            <th className="px-6 py-4 font-bold text-center">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {premios.map((row) => {
            const total =
              parseInt(row.la_romana) +
              parseInt(row.villa_hermosa) +
              parseInt(row.caleta) +
              parseInt(row.guaymate) +
              parseInt(row.cumayasa);

            return (
              <tr key={row.premio} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 bg-green-600 text-white font-bold uppercase">
                  {row.premio}
                </td>
                <td className="px-6 py-4 text-center">{row.la_romana}</td>
                <td className="px-6 py-4 text-center">{row.villa_hermosa}</td>
                <td className="px-6 py-4 text-center">{row.caleta}</td>
                <td className="px-6 py-4 text-center">{row.guaymate}</td>
                <td className="px-6 py-4 text-center">{row.cumayasa}</td>
                <td className="px-6 py-4 text-center bg-green-800 text-white font-bold">
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

export default TableRondas;
