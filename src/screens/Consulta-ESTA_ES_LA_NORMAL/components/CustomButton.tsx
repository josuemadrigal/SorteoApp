import React from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

interface CustomButtonProps {
  onClick: () => void;
  icon: "search" | "save"; // Updated to use string literals
  text: string;
  color: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  disabled?: boolean;
}

const colorClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
  success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  info: "bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-500",
  warning: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500",
  error: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
};

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  icon,
  text,
  color,
  disabled = false,
}) => {
  const baseClasses =
    "w-full py-3 px-4 mb-4 mt-2 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  // Choose the correct icon component
  const IconComponent =
    icon === "search" ? MagnifyingGlassIcon : ArrowDownTrayIcon;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${colorClasses[color]} ${
        disabled ? disabledClasses : ""
      }`}
    >
      {text}
      <IconComponent className="h-5 w-5 ml-2" />
    </button>
  );
};

export default CustomButton;
