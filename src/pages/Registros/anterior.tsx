import * as React from "react";
import InputMask, { Props } from "react-input-mask";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  TextFieldProps,
} from "@mui/material";
import RegistrosService from "../../services/RegistrosService";
import { useRef } from "react";
import { useLocation, useParams } from "react-router-dom";

const modelo = {
  defaultValues: {
    boleta: "",
    municipio: "",
    status: 1,
    premio: "",
  },
};

export const Registro = (props: any) => {
  const { getValues, register, handleSubmit, reset } = useForm(modelo);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const location = useLocation();

  const { id } = useParams<{ id: string }>();
  const municipioNombre = id || "";

  const objeto = location.state?.parametros;
  let municipio = objeto?.municipio || "";
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evitar envío automático del formulario
      handleSubmit(registerSubmit)();
    }
  };

  const registerSubmit = async (objeto: any) => {
    objeto.municipio = municipioNombre;
    // Mensajes de error centralizados
    const errorMessages = {
      invalidMunicipio: "Seleccione un municipio o distrito válido",
      invalidBoleta: "Ingrese una boleta válida",
      duplicateBoleta: "Esta boleta ya ha sido registrada",
    };

    // Función auxiliar para mostrar errores con Swal
    const showError = (title: string) => {
      Swal.fire({
        position: "center",
        icon: "error",
        title,
        showConfirmButton: false,
        timer: 3000,
      });
      reset({ boleta: "" });
    };
    try {
      if (!objeto.municipio || objeto.municipio.length < 1) {
        showError(errorMessages.invalidMunicipio);
        return;
      }
      if (objeto.boleta.length !== 8) {
        showError(errorMessages.invalidBoleta);
        return;
      }

      const municipioValido =
        objeto.municipio === "la-romana" ||
        objeto.municipio === "caleta" ||
        objeto.municipio === "villa-hermosa" ||
        objeto.municipio === "cumayasa" ||
        objeto.municipio === "guaymate";

      const codigoBoleta = objeto.boleta.slice(0, 2).toUpperCase();

      // Función auxiliar para validar municipio
      const validarMunicipio = (municipio: string, codigo: string) => {
        if (objeto.municipio === municipio && codigoBoleta !== codigo) {
          showError(`Boleta no pertenece a ${municipio.split("-").join(" ")}`);
          return false;
        }
        return true;
      };

      if (!municipioValido) {
        showError(errorMessages.invalidMunicipio);
        return;
      }

      if (!validarMunicipio("la-romana", "LR")) return;
      if (!validarMunicipio("caleta", "CA")) return;
      if (!validarMunicipio("villa-hermosa", "VH")) return;
      if (!validarMunicipio("cumayasa", "CU")) return;
      if (!validarMunicipio("guaymate", "GU")) return;

      objeto.status = 1;
      objeto.premio = "";

      const response = await RegistrosService.crearRegistros(objeto);
      if (response.status === 203) {
        showError(errorMessages.duplicateBoleta);
        reset({ boleta: "" });
      }
      if (response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Registro de la boleta ${objeto.boleta} COMPLETADO`,
          showConfirmButton: false,
          timer: 4000,
        });

        if (inputRef.current) {
          inputRef.current.focus();
          // Limpiar el campo de la boleta
        }
        reset({ boleta: "" });
      }
    } catch (error) {
      showError("Intente más tarde");
    }
  };

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
            <Box
              component="img"
              src="/mujer-portada.jpg"
              alt="hola"
              sx={{
                height: "auto",
                width: "100%",
                borderRadius: "10px",
              }}
            />

            <CardContent>
              <h1>{municipio}</h1>

              <form onSubmit={(e) => e.preventDefault()}>
                <InputMask
                  {...props}
                  mask="aa999999"
                  maskChar=""
                  maskPlaceholder={null}
                  required
                  {...register("boleta", { required: true, maxLength: 11 })}
                  sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                  inputRef={(node) => {
                    register(node);
                    inputRef.current = node;
                  }}
                  onKeyDown={handleKeyPress}
                >
                  {(inputProps: Props & TextFieldProps) => (
                    <TextField
                      {...inputProps}
                      variant="filled"
                      color="success"
                      type="text"
                      label="Número de boleta"
                    />
                  )}
                </InputMask>
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
