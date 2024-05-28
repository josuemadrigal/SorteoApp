import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface Premio {
  slug_premio: string;
  premio: string;
  la_romana: string;
  caleta: string;
  villa_hermosa: string;
  cumayasa: string;
  guaymate: string;
}
interface PremioSelectProps {
  premios: Premio[];
}

const TablePremios: React.FC<PremioSelectProps> = ({ premios }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "seagreen",
              "& th": {
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
              },
            }}
          >
            <TableCell>Premios</TableCell>
            <TableCell>La Romana</TableCell>
            <TableCell>Caleta</TableCell>
            <TableCell>Cumayasa</TableCell>
            <TableCell>Villa Hermosa</TableCell>
            <TableCell>Guaymate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {premios.map((row) => (
            <TableRow key={row.premio} sx={{ cursor: "pointer" }}>
              <TableCell>{row.premio}</TableCell>
              <TableCell>{row.la_romana}</TableCell>
              <TableCell>{row.villa_hermosa}</TableCell>
              <TableCell>{row.caleta}</TableCell>
              <TableCell>{row.guaymate}</TableCell>
              <TableCell>{row.cumayasa}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablePremios;
