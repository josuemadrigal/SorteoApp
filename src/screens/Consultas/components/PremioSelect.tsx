import React from "react";
import { Select, MenuItem } from "@mui/material";

const premiosData = [
  { premioText: "Nevera", premioValue: "Nevera" },
  { premioText: "Televisor", premioValue: "Televisor" },
  { premioText: "Estufa de horno", premioValue: "Estufa-Horno" },
  { premioText: "Estufa de mesa", premioValue: "Estufa-Mesa" },
  { premioText: "Licuadora", premioValue: "Licuadora" },
  { premioText: "Horno", premioValue: "Horno" },
  { premioText: "Abanico", premioValue: "Abanico" },
  { premioText: "Tanque de Gas", premioValue: "Tanque-Gas" },
  { premioText: "Olla de Presion", premioValue: "Olla-Presion" },
  { premioText: "Juego de Colcha", premioValue: "Juego-Colcha" },
  { premioText: "Lavadora", premioValue: "Lavadora" },
  { premioText: "Microonda", premioValue: "Microonda" },
  { premioText: "Freidora", premioValue: "Freidora" },
];

interface PremioSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

const PremioSelect: React.FC<PremioSelectProps> = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      color="success"
      sx={{ minWidth: "40%", width: "100%", margin: "5px 5px 15px 0px" }}
    >
      {premiosData.map((e) => (
        <MenuItem key={e.premioValue} value={e.premioValue}>
          {e.premioText}
        </MenuItem>
      ))}
    </Select>
  );
};

export default PremioSelect;
