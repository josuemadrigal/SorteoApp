import React from "react";

interface CustomButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  color: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  disabled?: boolean;
}

const colorClasses = {
  primary: "bg-blue-600 hover:bg-blue-700",
  secondary: "bg-purple-600 hover:bg-purple-700",
  success: "bg-green-600 hover:bg-green-700",
  info: "bg-cyan-500 hover:bg-cyan-600",
  warning: "bg-yellow-500 hover:bg-yellow-600",
  error: "bg-red-600 hover:bg-red-700",
};

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  icon,
  text,
  color,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-3 px-4 mb-4 mt-2 
        rounded-md text-white font-medium
        transition-colors duration-200
        flex items-center justify-center
        ${colorClasses[color]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {text}
      <span className="ml-2">{icon}</span>
    </button>
  );
};

export default CustomButton;
