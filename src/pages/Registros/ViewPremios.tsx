import * as React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { Card, Grid, Typography } from "@mui/material";

import RegistrosService from "../../services/RegistrosService";
import { useEffect, useRef } from "react";
import TablePremios from "./TablePremios";

const modelo = {
  defaultValues: {
    premio: "",
    slug: "",
    laRomana: 0,
    villaHermosa: 0,
    caleta: 0,
    cumayasa: 0,
    guaymate: 0,
  },
};

export const ViewPremios = () => {
  const { getValues, register, handleSubmit, reset } = useForm(modelo);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(registerSubmit)();
    }
  };

  const registerSubmit = async (objeto: any) => {
    // Mensajes de error centralizados
    const errorMessages = {
      invalidMunicipio: "Seleccione un municipio o distrito válido",
      invalidBoleta: "Ingrese una boleta válida ",
      duplicateBoleta: "Esta boleta ya ha sido registrada",
    };

    const showError = (title: string) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title,
        showConfirmButton: false,
        timer: 2000,
      });
      reset({ premio: "" });
    };

    try {
      const codigoBoleta = objeto.boleta.slice(0, 2).toUpperCase();

      objeto.status = 1;
      objeto.premio = "";

      const response = await RegistrosService.crearRegistros(objeto);

      if (response.status === 203) {
        showError(errorMessages.duplicateBoleta);
        reset({ premio: "" });
      }

      if (response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Registro de la boleta ${objeto.boleta} COMPLETADO`,
          showConfirmButton: false,
          timer: 2000,
        });

        if (inputRef.current) {
          inputRef.current.focus();
        }
        // Limpiar el campo de la boleta
        reset({ premio: "" });
      }
    } catch (error) {
      console.log(error);
      showError("Intente más tarde");
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <Grid item>
          <Card
            sx={{
              padding: "5%",
              minWidth: "100px",
              maxWidth: "700px",
              boxShadow: 20,
            }}
          >
            <Typography
              gutterBottom
              variant="h3"
              component="div"
              sx={{ color: "#f098", fontWeight: "bold", textAlign: "center" }}
            >
              Lista de premios
            </Typography>{" "}
            <TablePremios />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
