import React from "react";
import { TextField } from "@mui/material";
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
    <TextField
      type="number"
      placeholder="Cantidad"
      label="Cantidad"
      color="success"
      {...register("cantidad", { required: true, min: 1 })}
      sx={{
        minWidth: "20%",
        width: "100%",
        margin: "5px 5px 5px 0px",
        textAlign: "center",
      }}
      disabled={disabled}
    />
  );
};

export default CantidadInput;
