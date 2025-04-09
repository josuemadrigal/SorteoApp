import React from "react";
import { UseFormRegister } from "react-hook-form";

interface MunicipioSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  register: UseFormRegister<any>;
  disabled?: boolean;
}

const MunicipioSelect: React.FC<MunicipioSelectProps> = ({
  value,
  onChange,
  register,
  disabled,
}) => {
  return (
    <div className="w-full mt-5">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Municipio / Distrito
      </label>
      <select
        value={value}
        {...register("municipio", { required: true, maxLength: 10 })}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
        }`}
      >
        <option value="">Seleccione un municipio</option>
        <option value="caleta">Caleta</option>
        <option value="cumayasa">Cumayasa</option>
        <option value="guaymate">Guaymate</option>
        <option value="la-romana">La Romana</option>
        <option value="villa-hermosa">Villa Hermosa</option>
      </select>
    </div>
  );
};

export default MunicipioSelect;
