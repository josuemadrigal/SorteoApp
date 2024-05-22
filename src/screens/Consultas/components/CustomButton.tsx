import React from "react";
import { Button } from "@mui/material";

interface CustomButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
  color: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  disabled?: boolean; // Añadir la propiedad disabled
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  icon,
  text,
  color,
  disabled = false, // Valor por defecto a false
}) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      color={color}
      size="large"
      sx={{ width: "100%", marginBottom: "90px", marginTop: "20px" }}
      endIcon={icon}
      disabled={disabled} // Usar la propiedad disabled
    >
      {text}
    </Button>
  );
};

export default CustomButton;
