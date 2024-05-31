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

const TableRondas: React.FC<PremioSelectProps> = ({ premios }) => {
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
                textAlign: "center",
              },
            }}
          >
            <TableCell>Premios</TableCell>
            <TableCell>La Romana</TableCell>
            <TableCell>Villa Hermosa</TableCell>
            <TableCell>Caleta</TableCell>
            <TableCell>Guaymate</TableCell>
            <TableCell>Cumayasa</TableCell>

            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {premios.map((row) => (
            <TableRow key={row.premio} sx={{ cursor: "pointer" }}>
              <TableCell
                style={{
                  backgroundColor: "seagreen",
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {row.premio}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {row.la_romana}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {row.villa_hermosa}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {row.caleta}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {row.guaymate}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {row.cumayasa}
              </TableCell>
              <TableCell
                style={{
                  textAlign: "center",
                  backgroundColor: "darkgreen",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {parseInt(row.la_romana) +
                  parseInt(row.villa_hermosa) +
                  parseInt(row.caleta) +
                  parseInt(row.guaymate) +
                  parseInt(row.cumayasa)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableRondas;
