import React from "react";

interface Premio {
  premio: string;
  slug_premio: string;
}

interface PremioSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  premios: Premio[];
  disabled: boolean;
}

const PremioSelect: React.FC<PremioSelectProps> = ({
  value,
  onChange,
  premios,
  disabled,
}) => {
  return (
    <div className="w-full mt-5">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Premio
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
        }`}
      >
        <option value="" disabled>
          Seleccione el premio
        </option>
        {premios.map((e) => (
          <option key={e.slug_premio} value={e.slug_premio}>
            {e.premio}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PremioSelect;
