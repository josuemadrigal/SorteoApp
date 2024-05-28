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
  MenuItem,
  Select,
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

const RegistroGeneral: React.FC = () => {
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
  const nombreRef = useRef<HTMLInputElement | null>(null);
  const [nombre, setNombre] = useState("");
  const [nombreDB, setNombreDB] = useState("");
  const [cedula, setCedula] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cedulaNotFound, setCedulaNotFound] = useState(false);
  const [cedulaParticipando, setCedulaParticipando] = useState(false);

  const errorMessages = {
    invalidMunicipio: "Seleccione un municipio o distrito válido",
    invalidBoleta: "Ingrese una cédula válida",
    duplicateBoleta: "Esta cédula ya ha sido registrada",
    cedulaNotFound: "No se encontró un registro con esa cédula",
    cedulaNoValida: "Ingrese un numero de cedula valido",
    cedulaParticipando: `Esta cédula ya está participando`,
    nombreRequerido: "El nombre es necesario",
  };

  const municipioNombre = municipio || "";

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (cedulaNotFound && nombreRef.current) {
      nombreRef.current.focus();
    }
  }, [cedulaNotFound]);

  const checkParticipando = async (cedula: string) => {
    const participandoResponse = await RegistrosService.checkParticipando(
      cedula
    );
    if (participandoResponse.data.participando) {
      showError(errorMessages.cedulaParticipando);
      return true;
    } else {
      return false;
    }
  };

  const checkCedula = async (cedula: string) => {
    try {
      const response = await RegistrosService.getCedula(cedula);

      const cedulaParti = await checkParticipando(cedula);

      if (cedulaParti) {
        setNombreDB("");
        setNombre("");
        setCedula("");
        reset({ ...defaultValues, municipio: municipioNombre });
        setCedulaParticipando(false);
        setCedulaNotFound(false);
        setIsSubmitting(false);
        return;
      }

      if (
        response.data.registro &&
        response.data.registro.nombre &&
        !cedulaParti
      ) {
        const nombre = response.data.registro.nombre.toUpperCase();
        setNombre(nombre);
        setNombreDB(nombre);
        setCedula(cedula);
        setCedulaNotFound(false);
        setIsSubmitting(false);
      }

      if (!cedulaParti && response.data.ok === false) {
        setNombreDB(nombre);
        setCedulaNotFound(true);
        setNombre("");
        setCedula(cedula);
        setIsSubmitting(false);
        if (nombre) {
          await handleRegister({
            nombre,
            cedula,
            municipio: municipioNombre,
            premio: "-",
            status: 1,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log(data);

      const response = await RegistrosService.crearRegistros(data);
      if (response.status === 203) {
        showError(errorMessages.cedulaParticipando);
        reset({ ...defaultValues, municipio: municipioNombre });
        setNombre("");
        setCedula("");
        setCedulaNotFound(false);
        setCedulaParticipando(false);
      } else if (response.status === 201) {
        showSuccess(
          `Registro de la cédula ${data.cedula} COMPLETADO (${data.nombre})`
        );
        reset({ ...defaultValues, municipio: municipioNombre });
        setNombre("");
        setCedula("");
        setCedulaNotFound(false);
        setCedulaParticipando(false);
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

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const cedulaValue = (event.target as HTMLInputElement).value;
      if (cedulaValue.length === 13) {
        await checkCedula(cedulaValue);
      }
    }
  };

  const handleMunicipioChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setMunicipio(event.target.value as string);
    setValue("municipio", event.target.value as string);
  };

  const registerSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.cedula.length === 13 && (nombre || cedulaNotFound)) {
      await handleRegister({
        ...data,
        nombre: nombre || data.nombre,
        municipio: municipioNombre,
        premio: "-",
        status: 1,
      });
    } else {
      showError(errorMessages.cedulaNoValida);
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
            // alt="Mujer Portada"
            sx={{
              height: "auto",
              width: "100%",
              minWidth: "600px",
              borderRadius: "10px",
            }}
          />

          <CardContent>
            <form onSubmit={handleSubmit(registerSubmit)}>
              <Select
                value={municipio}
                onChange={handleMunicipioChange}
                displayEmpty
                variant="filled"
                color="success"
                sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="" disabled>
                  Seleccione un municipio
                </MenuItem>
                <MenuItem value="la-romana">La Romana</MenuItem>
                <MenuItem value="caleta">Caleta</MenuItem>
                <MenuItem value="guaymate">Guaymate</MenuItem>
                <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
                <MenuItem value="cumayasa">Cumayasa</MenuItem>
              </Select>
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

              {nombre && !cedulaNotFound && !cedulaParticipando && (
                <Typography variant="h6" sx={{ margin: "5px 5px 15px 0px" }}>
                  Nombre: {nombre}
                </Typography>
              )}

              {cedulaNotFound && (
                <TextField
                  {...register("nombre", {
                    required: errorMessages.nombreRequerido,
                  })}
                  variant="filled"
                  color="success"
                  type="text"
                  label="Nombre"
                  sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                  inputRef={nombreRef}
                  disabled={isSubmitting}
                  error={!!errors.nombre}
                  helperText={errors.nombre ? errors.nombre.message : ""}
                />
              )}

              <Button
                variant="contained"
                color="success"
                type="submit"
                sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                disabled={isSubmitting || cedulaParticipando}
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

export default RegistroGeneral;
