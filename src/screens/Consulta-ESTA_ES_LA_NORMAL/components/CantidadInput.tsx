import React from "react";
import { UseFormRegister } from "react-hook-form";

interface CantidadInputProps {
  register: UseFormRegister<any>;
  disabled: boolean;
}

const CantidadInput: React.FC<CantidadInputProps> = ({
  register,
  disabled,
}) => {
  return (
    <div className="w-full mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cantidad
      </label>
      <input
        type="number"
        placeholder="Cantidad"
        {...register("cantidad", { required: true, min: 1 })}
        disabled={disabled}
        className={`w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 text-center focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
        }`}
      />
    </div>
  );
};

export default CantidadInput;
