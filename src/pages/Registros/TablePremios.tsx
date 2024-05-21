import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import PlaylistService from "../../services/RegistrosService";
import { makeStyles } from "mui-styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  actionsColumn: {
    width: "150px",
  },
});

interface DataRow {
  id: number;
  playlistname: string;
  videos: string;
}

const TablePremios: React.FC = () => {
  const classes = useStyles();
  const [data, setData] = useState<DataRow[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const screens = async () => {
      const screen = await PlaylistService.getPlaylists();

      return setData(screen.data);
    };
    screens();
  }, []);

  const handleView = (row: DataRow) => {
    navigate(`/playlist-view/${row.id}`);
    console.log(`View item with ID: ${row.id}`);
  };

  const handleEdit = (row: DataRow) => {
    alert(`Editar lista: ${row.playlistname}`);
  };

  const handleDelete = (row: DataRow) => {
    alert(`Eliminar lista: ${row.playlistname}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#217594",
              "& th": {
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
              },
            }}
          >
            <TableCell>ID</TableCell>
            <TableCell>Premios</TableCell>
            <TableCell>La Romana</TableCell>
            <TableCell className={classes.actionsColumn}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} sx={{ cursor: "pointer" }}>
              <TableCell onClick={() => handleView(row)}>{row.id}</TableCell>
              <TableCell onClick={() => handleView(row)}>
                {row.playlistname}
              </TableCell>
              <TableCell onClick={() => handleView(row)}>
                {row.videos}
              </TableCell>
              <TableCell>
                <Tooltip title="Ver lista">
                  <IconButton onClick={() => handleView(row)}>
                    <VisibilityIcon
                      fontSize="small"
                      sx={{
                        color: "lightgrey",
                        ":hover": {
                          color: "dodgerblue",
                        },
                      }}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Editar">
                  <IconButton onClick={() => handleEdit(row)}>
                    <Edit
                      fontSize="small"
                      sx={{
                        color: "lightgrey",
                        ":hover": {
                          color: "burlywood",
                        },
                      }}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar">
                  <IconButton onClick={() => handleDelete(row)}>
                    <Delete
                      fontSize="small"
                      sx={{
                        color: "lightgrey",
                        ":hover": {
                          color: "tomato",
                        },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablePremios;
