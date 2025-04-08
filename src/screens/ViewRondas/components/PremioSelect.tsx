import React from "react";

interface Premio {
  premio: string;
  slug_premio: string;
}

interface PremioSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  premios: Premio[];
}

const PremioSelect: React.FC<PremioSelectProps> = ({
  value,
  onChange,
  premios,
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
  );
};

export default PremioSelect;
