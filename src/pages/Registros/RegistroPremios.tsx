import * as React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import RegistrosService from "../../services/RegistrosService";
import { useEffect, useRef } from "react";
import { generateSlug } from "../../utils";

const modelo = {
  defaultValues: {
    premio: "",
    slug_premio: "",
    la_romana: 0,
    villa_hermosa: 0,
    caleta: 0,
    cumayasa: 0,
    guaymate: 0,
  },
};

export const RegistroPremios = () => {
  const {
    getValues,
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
      invalidMunicipio: "Seleccione un municipio o distrito válido",
      invalidBoleta: "Ingrese un premio válido ",
      duplicateBoleta: "Este premio ya ha sido registrado",
      emptyFields: "Todos los campos son obligatorios",
      zeroQuantity: "La cantidad de ningun premio puede ser 0",
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

    // Verificar campos vacíos
    if (
      !objeto.premio ||
      !objeto.la_romana ||
      !objeto.villa_hermosa ||
      !objeto.caleta ||
      !objeto.cumayasa ||
      !objeto.guaymate
    ) {
      showError(errorMessages.emptyFields);
      return;
    }

    // Verificar cantidades no sean 0
    if (
      objeto.la_romana <= 0 ||
      objeto.villa_hermosa <= 0 ||
      objeto.caleta <= 0 ||
      objeto.cumayasa <= 0 ||
      objeto.guaymate <= 0
    ) {
      showError(errorMessages.zeroQuantity);
      return;
    }

    try {
      objeto.status = 1;
      objeto.slug_premio = generateSlug(objeto.premio);

      const response = await RegistrosService.regPremio(objeto);

      if (response.status === 203) {
        showError(errorMessages.duplicateBoleta);
        reset({ premio: "" });
      }

      if (response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Registro del premio ${objeto.premio} COMPLETADO`,
          showConfirmButton: false,
          timer: 2000,
        });

        if (inputRef.current) {
          inputRef.current.focus();
        }
        // Limpiar el campo del premio
        reset({
          premio: "",
          la_romana: 0,
          caleta: 0,
          cumayasa: 0,
          guaymate: 0,
          villa_hermosa: 0,
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
              Registro de premios
            </Typography>{" "}
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()}>
                <TextField
                  variant="filled"
                  type="text"
                  color="success"
                  placeholder="Premio"
                  label="Premio"
                  inputProps={{ maxLength: 60 }}
                  required
                  {...register("premio", { required: true, maxLength: 80 })}
                  sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                  error={!!errors.premio}
                  helperText={errors.premio ? "Campo obligatorio" : ""}
                />

                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    color: "#f69",
                    fontWeight: "bold",
                    textAlign: "center",
                    mt: 5,
                  }}
                >
                  {" "}
                  Cantidad de premios por municipio
                </Typography>
                <TextField
                  variant="filled"
                  type="number"
                  color="success"
                  placeholder="La Romana"
                  label="La Romana"
                  defaultValue={0}
                  inputProps={{ maxLength: 60, min: 1 }}
                  required
                  {...register("la_romana", {
                    required: true,
                    maxLength: 80,
                    min: 1,
                  })}
                  sx={{ width: "19%", margin: "5px 5px 15px 0px" }}
                  error={!!errors.la_romana}
                  helperText={errors.la_romana ? "Cantidad no puede ser 0" : ""}
                />
                <TextField
                  variant="filled"
                  type="number"
                  color="success"
                  placeholder="Caleta"
                  label="Caleta"
                  inputProps={{ maxLength: 60, min: 1 }}
                  required
                  {...register("caleta", {
                    required: true,
                    maxLength: 80,
                    min: 1,
                  })}
                  sx={{ width: "19%", margin: "5px 5px 15px 0px" }}
                  error={!!errors.caleta}
                  helperText={errors.caleta ? "Cantidad no puede ser 0" : ""}
                />

                <TextField
                  variant="filled"
                  type="number"
                  color="success"
                  placeholder="Cumayasa"
                  label="Cumayasa"
                  inputProps={{ maxLength: 60, min: 1 }}
                  required
                  {...register("cumayasa", {
                    required: true,
                    maxLength: 80,
                    min: 1,
                  })}
                  sx={{ width: "19%", margin: "5px 5px 15px 0px" }}
                  error={!!errors.cumayasa}
                  helperText={errors.cumayasa ? "Cantidad no puede ser 0" : ""}
                />
                <TextField
                  variant="filled"
                  type="number"
                  color="success"
                  placeholder="Guaymate"
                  label="Guaymate"
                  inputProps={{ maxLength: 60, min: 1 }}
                  required
                  {...register("guaymate", {
                    required: true,
                    maxLength: 80,
                    min: 1,
                  })}
                  sx={{ width: "19%", margin: "5px 5px 15px 0px" }}
                  error={!!errors.guaymate}
                  helperText={errors.guaymate ? "Cantidad no puede ser 0" : ""}
                />

                <TextField
                  variant="filled"
                  type="number"
                  color="success"
                  placeholder="Villa Hermosa"
                  label="Villa Hermosa"
                  inputProps={{ maxLength: 60, min: 1 }}
                  required
                  {...register("villa_hermosa", {
                    required: true,
                    maxLength: 80,
                    min: 1,
                  })}
                  sx={{ width: "19%", margin: "5px 5px 15px 0px" }}
                  onKeyDown={handleKeyPress}
                  error={!!errors.villa_hermosa}
                  helperText={
                    errors.villa_hermosa ? "Cantidad no puede ser 0" : ""
                  }
                />

                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                  onClick={handleSubmit(registerSubmit)}
                >
                  Registrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
