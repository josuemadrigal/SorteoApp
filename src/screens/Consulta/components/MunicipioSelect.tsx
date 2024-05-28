import React from "react";
import { Select, MenuItem, InputLabel } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

interface MunicipioSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  register: UseFormRegister<any>;
  disabled: boolean;
}

const MunicipioSelect: React.FC<MunicipioSelectProps> = ({
  value,
  onChange,
  register,
  disabled,
}) => {
  return (
    <>
      <InputLabel sx={{ marginTop: "20px" }}>Municipio / Distrito</InputLabel>
      <Select
        value={value}
        {...register("municipio", { required: true, maxLength: 10 })}
        color="success"
        onChange={onChange}
        sx={{ minWidth: "40%", width: "100%", margin: "5px 5px 15px 0px" }}
        disabled={disabled}
      >
        <MenuItem value="caleta">Caleta</MenuItem>
        <MenuItem value="cumayasa">Cumayasa</MenuItem>
        <MenuItem value="guaymate">Guaymate</MenuItem>
        <MenuItem value="la-romana">La Romana</MenuItem>
        <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
      </Select>
    </>
  );
};

export default MunicipioSelect;
