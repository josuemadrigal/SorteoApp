import React from "react";

interface MunicipioSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
}

const MUNICIPIOS = [
  { label: "Caleta", value: "caleta" },
  { label: "Cumayasa", value: "cumayasa" },
  { label: "Guaymate", value: "guaymate" },
  { label: "La Romana", value: "la-romana" },
  { label: "Villa Hermosa", value: "villa-hermosa" },
];

const MunicipioSelectReport: React.FC<MunicipioSelectProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`w-60 mt-5 ${className}`}>
      <label
        htmlFor="municipio"
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        Municipio / Distrito
      </label>
      <select
        id="municipio"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
        }`}
      >
        <option value="">Seleccione un municipio</option>
        {MUNICIPIOS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MunicipioSelectReport;
