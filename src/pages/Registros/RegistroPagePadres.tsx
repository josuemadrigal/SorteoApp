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
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import RegistrosService from "../../services/RegistrosService";

interface FormValues {
  nombre: string;
  cedula: string;
  municipio: string;
  boleto: string;
  telefono: string;
  status: number;
  premio: string;
}

const defaultValues: FormValues = {
  nombre: "",
  cedula: "",
  municipio: "",
  boleto: "",
  telefono: "",
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

const RegistroPadres: React.FC = () => {
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
  const [buttonText, setButtonText] = useState("Buscar");
  const [modalOpen, setModalOpen] = useState(false);

  const errorMessages = {
    invalidMunicipio: "Seleccione un municipio o distrito válido",
    invalidBoleta: "Ingrese una cédula válida",
    duplicateBoleta: "Esta cédula ya ha sido registrada",
    cedulaNotFound: "No se encontró un registro con esa cédula",
    cedulaNoValida: "Ingrese un numero de cedula valido",
    cedulaParticipando: `Esta cédula ya está participando`,
    nombreRequerido: "El nombre y apellido son obligatorios",
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
        setButtonText("Buscar");
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
        setButtonText("Registrar");
      }

      if (!cedulaParti && response.data.ok === false) {
        setNombreDB(nombre);
        setCedulaNotFound(true);
        setNombre("");
        setCedula(cedula);
        setIsSubmitting(false);
        setButtonText("Registrar");
        if (nombre) {
          await handleRegister({
            nombre,
            cedula,
            municipio: municipioNombre,
            boleto: "",
            telefono: "",
            premio: "-",
            status: 1,
          });
        }
      }
    } catch (error) {
      console.error(error);
      setButtonText("Buscar");
    }
  };

  const handleRegister = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log(data);
      ``;
      const municipioValido =
        data.municipio === "la-romana" ||
        data.municipio === "caleta" ||
        data.municipio === "villa-hermosa" ||
        data.municipio === "cumayasa" ||
        data.municipio === "guaymate";

      const codigoBoleta = data.boleto.slice(0, 2).toUpperCase();

      const validarMunicipio = (municipio: string, codigo: string) => {
        if (data.municipio === municipio && codigoBoleta !== codigo) {
          showError(`Boleta no pertenece a ${municipio.split("-").join(" ")}`);
          return false;
        }
        return true;
      };

      if (!municipioValido) {
        showError(errorMessages.invalidMunicipio);
        return;
      }

      // if (!validarMunicipio("la-romana", "LR")) return;
      // if (!validarMunicipio("caleta", "CA")) return;
      // if (!validarMunicipio("villa-hermosa", "VH")) return;
      // if (!validarMunicipio("cumayasa", "CU")) return;
      // if (!validarMunicipio("guaymate", "GU")) return;

      Swal.fire({
        title: "¿Están correctos sus datos?",
        html: ` <p> Nombre: <b>${data.nombre}</b></p>
                <p> Cédula: <b>${data.cedula}</b></p>
                
                <p> Municipio: <b>${data.municipio}</b></p>
                
                `,

        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Editar datos",
        confirmButtonColor: "#2e7d32",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await RegistrosService.crearRegistrosPadres(data);
          if (response.status !== 203) {
            const responseCedula = await RegistrosService.regCedula(data);
            console.log(responseCedula);
            reset({ ...defaultValues, municipio: municipioNombre });
            setNombre("");
            setCedula("");
            setCedulaNotFound(false);
            setCedulaParticipando(false);
            setButtonText("Buscar");
          }

          if (response.status === 203) {
            showError(errorMessages.cedulaParticipando);
            reset({ ...defaultValues, municipio: municipioNombre });
            setNombre("");
            setCedula("");
            setCedulaNotFound(false);
            setCedulaParticipando(false);
            setButtonText("Buscar");
          } else if (response.status === 206) {
            showError("Esta participando");
            //reset({ ...defaultValues, municipio: municipioNombre });
            //setNombre("");
            //setCedula("");
            //setCedulaNotFound(false);
            // setCedulaParticipando(false);
            // setButtonText("Buscar");
          } else if (response.status === 201) {
            showSuccess(
              `Registro de la cédula ${data.cedula} COMPLETADO (${data.nombre})`
            );
            reset({ ...defaultValues, municipio: municipioNombre });
            setNombre("");
            setCedula("");
            setCedulaNotFound(false);
            setCedulaParticipando(false);
            setButtonText("Buscar");
            return setTimeout(() => {
              window.location.replace(
                "https://www.instagram.com/eduardespiritusanto/"
              );
            }, 2000);
          }
        }
      });
    } catch (error) {
      console.error(error);
      showError(`Intente más tarde ${municipioNombre}`);
      setButtonText("Buscar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cedulaValue = event.target.value;
    if (cedulaValue.length === 13) {
      const serieCedula = cedulaValue.slice(0, 3);
      console.log(serieCedula);

      if (
        serieCedula === "402" ||
        serieCedula === "026" ||
        serieCedula === "295" ||
        serieCedula === "103"

      ) {

        setIsSubmitting(true);
        await checkCedula(cedulaValue);
      } else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Cédula no permitida",
          text: "Debe dirigirse a un centro de registración.",
          showConfirmButton: false,
          timer: 6000,
        });

        reset({ ...defaultValues, municipio: municipioNombre });
        setNombre("");
        setCedula("");
        setCedulaNotFound(false);
        setCedulaParticipando(false);
        setButtonText("Buscar");
      }
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

  const handleBoletoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const boletoValue = event.target.value.toUpperCase();

    setValue("boleto", boletoValue);

    // if (boletoValue.length === 5) {
    //   setIsSubmitting(true);
    //   setTimeout(() => {
    //     window.open("https://www.instagram.com/eduardespiritusanto/", "_blank");
    //     // Esperar 5 segundos y luego restablecer el estado o redirigir de vuelta
    //     setTimeout(() => {
    //       setIsSubmitting(false);
    //       window.open("https://app.eduardespiritusanto.com/", "_blank");
    //       // Código para volver a la página original o actualizar el estado necesario
    //     }, 5000);
    //   }, 2000);
    // }

    // setValue("boleto", boletoValue);
    // if (boletoValue.startsWith("LR")) {
    //   setMunicipio("la-romana");
    //   setValue("municipio", "la-romana");
    // } else if (boletoValue.startsWith("CA")) {
    //   setMunicipio("caleta");
    //   setValue("municipio", "caleta");
    // } else if (boletoValue.startsWith("VH")) {
    //   setMunicipio("villa-hermosa");
    //   setValue("municipio", "villa-hermosa");
    // } else if (boletoValue.startsWith("CU")) {
    //   setMunicipio("cumayasa");
    //   setValue("municipio", "cumayasa");
    // } else if (boletoValue.startsWith("GU")) {
    //   setMunicipio("guaymate");
    //   setValue("municipio", "guaymate");
    // } else {
    //   setMunicipio("");
    //   setValue("municipio", "ERROR");
    // }
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
            src="/padre-portada.jpg"
            alt="Padres banner"
            sx={{
              height: "auto",
              width: "100%",

              borderRadius: "10px",
            }}
          />

          <CardContent>
            <form onSubmit={handleSubmit(registerSubmit)}>
              {/* <InputMask
                //mask="aa999999"
                mask="99999"
                placeholder="XXXXX"
                maskChar=""
                maskPlaceholder={null}
                required
                {...register("boleto", {
                  required: "El número de boleta es obligatorio",
                  pattern: {
                    //value: /^[A-Za-z]{2}\d{6}$/,
                    value: /^\d{5}$/,
                    message: "Formato de boleta inválido",
                  },
                  minLength: 5,
                  maxLength: 5,
                })}
                // inputRef={(node) => {
                //   register(node);
                //   inputRef.current = node;
                // }}
                onKeyDown={handleKeyPress}
                onChange={handleBoletoChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    variant="filled"
                    color="success"
                    type="text"
                    error={!!errors.boleto}
                    helperText={
                      errors.boleto ? "Numero de boleto incorrecto" : ""
                    }
                    label="Número de boleta"
                    sx={{
                      minWidth: "100%",
                      margin: "5px 5px 15px 0px",
                      "& input": {
                        textTransform: "uppercase",
                      },
                      minLength: 5,
                      maxLength: 5,
                    }}
                    //inputRef={inputRef}
                  />
                )}
              </InputMask> */}
              <InputMask
                mask="999-9999999-9"
                placeholder="___-_______-_"
                maskChar=""
                {...register("cedula", {
                  required: "La cédula obligatoria",

                  pattern: {
                    value: /^\d{3}-\d{7}-\d{1}$/,
                    //value: /^(402|026)-\d{7}-\d{1}$/,
                    message: "Formato de cédula inválido",
                  },
                  minLength: 13,
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
                    sx={{
                      minWidth: "100%",
                      margin: "5px 5px 15px 0px",
                      minLength: 13,
                      maxLength: 13,
                    }}
                    onKeyDown={handleKeyPress}
                  />
                )}
              </InputMask>
              {isSubmitting && (
                <Typography
                  variant="h6"
                  sx={{
                    margin: "5px 5px 15px 0px",
                    fontSize: "13px",
                    color: "sandybrown",
                  }}
                >
                  Estamos buscando su cédula en la base de datos. Mientras puede
                  ir llenando los demás datos del formulario.
                </Typography>
              )}
              {nombre && !cedulaNotFound && !cedulaParticipando && (
                <Typography variant="h6" sx={{ margin: "5px 5px 15px 0px" }}>
                  Nombre: {nombre}
                </Typography>
              )}
              {cedulaNotFound && (
                <TextField
                  {...register("nombre", {
                    required: errorMessages.nombreRequerido,
                    validate: (value) =>
                      /^[A-Za-z\s]{3,}(\s[A-Za-z\s]{3,})+$/.test(value) ||
                      "Debe ingresar nombre y apellido, o nombre completo",
                  })}
                  variant="filled"
                  color="success"
                  type="text"
                  label="Nombre y Apellido"
                  sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                  inputRef={nombreRef}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^a-zA-Z\s]/g, "");
                  }}
                  disabled={isSubmitting}
                  error={!!errors.nombre}
                  helperText={errors.nombre ? errors.nombre.message : ""}
                />
              )}
              <InputMask
                mask="(999) 999-9999"
                maskChar=""
                maskPlaceholder={null}
                required
                {...register("telefono", {
                  required: "El número de teléfono es obligatorio",
                  pattern: {
                    value: /^\(\d{3}\) \d{3}-\d{4}$/,
                    message: "Formato de número de teléfono inválido",
                  },
                  minLength: 14,
                  maxLength: 14,
                })}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    variant="filled"
                    color="success"
                    type="text"
                    error={!!errors.telefono}
                    helperText={errors.telefono ? errors.telefono.message : ""}
                    label="Número de celular"
                    sx={{
                      minWidth: "100%",
                      margin: "5px 5px 15px 0px",
                      "& input": {
                        textTransform: "uppercase",
                      },
                      minLength: 8,
                      maxLength: 8,
                    }}
                  />
                )}
              </InputMask>

              <Select
                value={municipio}
                onChange={handleMunicipioChange}
                displayEmpty
                variant="filled"
                color="success"
                sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                inputProps={{ "aria-label": "Without label" }}
                //disabled
              >
                <MenuItem value="" disabled>
                  Seleccione el municipio
                </MenuItem>
                <MenuItem value="la-romana">La Romana</MenuItem>
                <MenuItem value="caleta">Caleta</MenuItem>
                <MenuItem value="guaymate">Guaymate</MenuItem>
                <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
                <MenuItem value="cumayasa">Cumayasa</MenuItem>
              </Select>
              <Button
                variant="contained"
                color={buttonText === "Buscar" ? "info" : "success"}
                type="submit"
                sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                disabled={isSubmitting || cedulaParticipando}
              >
                {buttonText}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={2}
          >
            <Card style={{ width: "80%", maxHeight: "80vh", overflow: "auto" }}>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Redireccionando a Instagram...
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Modal>
      </Grid>
    </Grid>
  );
};

export default RegistroPadres;
