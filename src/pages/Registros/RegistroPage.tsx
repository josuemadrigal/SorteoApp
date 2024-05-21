import React, { useEffect, useRef } from "react";
import InputMask from "react-input-mask";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
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
import { useLocation, useParams } from "react-router-dom";

interface FormValues {
  nombre: string;
  cedula: string;
  municipio: string;
  status: number;
  premio: string;
}

const defaultValues: FormValues = {
  nombre: "",
  cedula: "",
  municipio: "",
  status: 1,
  premio: "",
};

const errorMessages = {
  invalidMunicipio: "Seleccione un municipio o distrito válido",
  invalidBoleta: "Ingrese una boleta válida",
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
};

const Registro: React.FC = () => {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const municipioNombre = id || "";
  const objeto = location.state?.parametros || {};
  const municipio = objeto.municipio || "";

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const registerSubmit: SubmitHandler<FormValues> = async (data) => {
    data.municipio = municipioNombre;

    try {
      if (!data.municipio) {
        showError(errorMessages.invalidMunicipio);
        return;
      }

      data.status = 1;
      data.premio = "";
      data.nombre = "test";

      const response = await RegistrosService.crearRegistros(data);

      if (response.status === 203) {
        showError(errorMessages.duplicateBoleta);
        reset({ cedula: "" });
      }

      if (response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Registro de la boleta ${data.cedula} COMPLETADO`,
          showConfirmButton: false,
          timer: 2000,
        });

        reset({ cedula: "" });
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error(error);
      showError(`Intente más tarde ${data.municipio}`);
    }
  };

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
          <Box
            component="img"
            src="/mujer-portada.jpg"
            alt="Mujer Portada"
            sx={{
              height: "auto",
              width: "100%",
              borderRadius: "10px",
            }}
          />

          <CardContent>
            <h1>{municipio}</h1>

            <form onSubmit={handleSubmit(registerSubmit)}>
              <InputMask
                mask="999-9999999-9"
                maskChar=""
                required
                {...register("cedula", { required: true, maxLength: 13 })}
                inputRef={(node) => {
                  register(node);
                  inputRef.current = node;
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSubmit(registerSubmit)();
                  }
                }}
              >
                {(inputProps: TextFieldProps) => (
                  <TextField
                    {...inputProps}
                    variant="filled"
                    color="success"
                    type="text"
                    label="Cédula"
                    sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                  />
                )}
              </InputMask>

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

export default Registro;
