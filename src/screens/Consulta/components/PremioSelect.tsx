import React from "react";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface Premio {
  premio: string;
  slug_premio: string;
}

interface PremioSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  premios: Premio[];
}

const PremioSelect: React.FC<PremioSelectProps> = ({
  value,
  onChange,
  premios,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      color="success"
      sx={{ minWidth: "40%", width: "100%", margin: "5px 5px 15px 0px" }}
    >
      {premios.map((e) => (
        <MenuItem key={e.slug_premio} value={e.slug_premio}>
          {e.premio}
        </MenuItem>
      ))}
    </Select>
  );
};

export default PremioSelect;
