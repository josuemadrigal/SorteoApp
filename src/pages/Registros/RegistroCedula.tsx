import * as React from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";

import RegistrosService from "../../services/RegistrosService";
import { useEffect, useRef } from "react";

const modelo = {
  defaultValues: {
    nombre: "",
    cedula: "",
    status: 1,
  },
};

export const RegistroCedula = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(modelo);
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
      duplicateBoleta: "Esta cédula ya ha sido registrada",
      emptyFields: "Todos los campos son obligatorios",
    };

    const showError = (title: string) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title,
        showConfirmButton: false,
        timer: 2000,
      });
      reset({ cedula: "" });
    };

    // Verificar campos vacíos
    if (!objeto.cedula || !objeto.nombre) {
      showError(errorMessages.emptyFields);
      return;
    }
    objeto.nombre = objeto.nombre.toUpperCase();
    try {
      objeto.status = 1;

      const response = await RegistrosService.regCedula(objeto);

      if (response.status === 203) {
        showError(errorMessages.duplicateBoleta);
        reset({ cedula: "" });
      }

      if (response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Registro de la cédula ${objeto.cedula} COMPLETADO`,
          showConfirmButton: false,
          timer: 2000,
        });

        if (inputRef.current) {
          inputRef.current.focus();
        }
        // Limpiar el campo del premio
        reset({
          cedula: "",
          nombre: "",
        });
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
            sx={{ color: "#2e7d32", fontWeight: "bold", textAlign: "center" }}
          >
            Registro de cédula
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit(registerSubmit)}>
              <InputMask
                mask="999-9999999-9"
                maskChar=""
                {...register("cedula", { required: true, maxLength: 13 })}
              >
                {(inputProps: TextFieldProps) => (
                  <TextField
                    {...inputProps}
                    variant="filled"
                    color="success"
                    type="text"
                    label="Cédula"
                    sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                    inputRef={inputRef}
                    error={!!errors.cedula}
                    helperText={errors.cedula ? "Cédula es requerida" : ""}
                    onKeyDown={handleKeyPress}
                  />
                )}
              </InputMask>

              <TextField
                variant="filled"
                type="text"
                color="success"
                placeholder="Nombre"
                label="Nombre"
                inputProps={{
                  maxLength: 160,
                  min: 1,
                  style: { textTransform: "uppercase" },
                }}
                {...register("nombre", {
                  required: "Debe indicar el nombre",
                  maxLength: 80,
                  minLength: 1,
                })}
                sx={{ width: "100%", margin: "5px 5px 15px 0px" }}
                onKeyDown={handleKeyPress}
                error={!!errors.nombre}
                helperText={errors.nombre ? errors.nombre.message : ""}
              />

              <Button
                variant="contained"
                color="success"
                type="submit"
                sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
              >
                Registrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
