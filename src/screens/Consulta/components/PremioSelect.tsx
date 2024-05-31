import React from "react";
import { Select, MenuItem, SelectChangeEvent, InputLabel } from "@mui/material";

interface Premio {
  premio: string;
  slug_premio: string;
}

interface PremioSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  premios: Premio[];
  disabled: boolean;
}

const PremioSelect: React.FC<PremioSelectProps> = ({
  value,
  onChange,
  premios,
  disabled,
}) => {
  return (
    <>
      <InputLabel sx={{ marginTop: "20px" }}>Premio</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        variant="filled"
        color="success"
        sx={{ minWidth: "40%", width: "100%", margin: "5px 5px 15px 0px" }}
        disabled={disabled}
      >
        <MenuItem value="" disabled>
          Seleccione el premio
        </MenuItem>
        {premios.map((e) => (
          <MenuItem key={e.slug_premio} value={e.slug_premio}>
            {e.premio}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default PremioSelect;
