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
  nombre: string;
  cedula: string;
  premio: string;
  ronda: string;
  municipio: string;
}
interface PremioSelectProps {
  premios: Premio[];
}

const TableGanadores: React.FC<PremioSelectProps> = ({ premios }) => {
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
            <TableCell>Nombre</TableCell>
            <TableCell>Cedula</TableCell>
            <TableCell>Premio</TableCell>
            <TableCell>Ronda</TableCell>
            <TableCell>Municipio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {premios.map((row) => (
            <TableRow key={row.cedula} sx={{ cursor: "pointer" }}>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.cedula}</TableCell>
              <TableCell>{row.premio}</TableCell>
              <TableCell>{row.ronda}</TableCell>
              <TableCell>{row.municipio}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableGanadores;
