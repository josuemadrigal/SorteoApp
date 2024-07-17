import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import ViewRegistros from "./ViewRegistros"; // Ajusta la importación según tu estructura de archivos

const Codigo = () => {
  const [showView, setShowView] = useState(false);
  const [codigo, setCodigo] = useState("");
  const codigoCorrecto = "es2024"; // Código correcto que debe ingresar el usuario

  const handleCodigoSubmit = () => {
    if (codigo === codigoCorrecto) {
      setShowView(true);
    } else {
      alert("Código incorrecto. Inténtelo de nuevo.");
    }
  };

  const handleCodigoChange = (event) => {
    setCodigo(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleCodigoSubmit();
    }
  };

  return (
    <div>
      {!showView && (
        <Dialog open={!showView} onClose={() => setShowView(false)}>
          <DialogTitle>Ingrese un código para continuar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ingrese el código para acceder a la vista de registros:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="codigo"
              label="Código"
              type="password"
              fullWidth
              value={codigo}
              onChange={handleCodigoChange}
              onKeyPress={handleKeyPress} // Maneja la tecla Enter
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCodigoSubmit}>Aceptar</Button>
          </DialogActions>
        </Dialog>
      )}

      {showView && <ViewRegistros />}
    </div>
  );
};

export default Codigo;
