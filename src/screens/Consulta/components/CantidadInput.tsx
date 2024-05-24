import React from "react";
import { TextField } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

interface CantidadInputProps {
  register: UseFormRegister<any>;
}

const CantidadInput: React.FC<CantidadInputProps> = ({ register }) => {
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
        margin: "5px 5px 15px 0px",
        textAlign: "center",
      }}
    />
  );
};

export default CantidadInput;
