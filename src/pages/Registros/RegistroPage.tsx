import React, { useEffect, useRef, useState } from "react";
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
  Typography,
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
  premio: "-",
};

const errorMessages = {
  invalidMunicipio: "Seleccione un municipio o distrito válido",
  invalidBoleta: "Ingrese una cédula válida",
  duplicateBoleta: "Esta cédula ya ha sido registrada",
  cedulaNotFound: "No se encontró un registro con esa cédula",
  cedulaParticipando: "Esta cédula ya está participando",
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

const showSuccess = (title: string) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 2000,
  });
};

const Registro: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const checkCedula = async (cedula: string) => {
    try {
      const response = await RegistrosService.getCedula(cedula);
      if (response.data.registro && response.data.registro.nombre) {
        const nombre = response.data.registro.nombre.toUpperCase();
        setNombre(nombre);
        setCedula(cedula);
        setIsSubmitting(false);
      } else {
        setNombre("");
        setCedula("");
        setIsSubmitting(false);
        showError(errorMessages.cedulaNotFound);
      }
    } catch (error) {
      console.log(error);
      setNombre("");
      setCedula("");
      setIsSubmitting(false);
      showError(errorMessages.cedulaNotFound);
    }
  };

  const handleRegister = async () => {
    const data = {
      cedula,
      nombre,
      municipio: municipioNombre,
      status: 1,
      premio: "-",
    };

    try {
      setIsSubmitting(true);
      const response = await RegistrosService.crearRegistros(data);
      if (response.status === 203) {
        showError(errorMessages.cedulaParticipando);
      } else if (response.status === 201) {
        showSuccess(`Registro de la cédula ${cedula} COMPLETADO (${nombre})`);
        reset({ cedula: "" });
        setNombre("");
      }
    } catch (error) {
      console.error(error);
      showError(`Intente más tarde ${municipioNombre}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cedulaValue = event.target.value;
    if (cedulaValue.length === 13) {
      setIsSubmitting(true);
      await checkCedula(cedulaValue);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value.length === 13) {
      event.preventDefault();
      handleBlur(event as any);
    }
  };

  const registerSubmit: SubmitHandler<FormValues> = async () => {
    if (cedula.length === 13 && nombre) {
      await handleRegister();
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
            //src="/mujer-portada.jpg"
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
                {...register("cedula", {
                  required: true,
                  maxLength: 13,
                  onBlur: handleBlur,
                })}
                disabled={isSubmitting}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    variant="filled"
                    color="success"
                    type="text"
                    label="Cédula"
                    sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                    inputRef={inputRef}
                    onKeyDown={handleKeyPress}
                  />
                )}
              </InputMask>

              {nombre && (
                <Typography variant="h6" sx={{ margin: "5px 5px 15px 0px" }}>
                  Nombre: {nombre}
                </Typography>
              )}

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
