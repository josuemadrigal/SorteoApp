import React, { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import "../../App.css";
import gifLoading from "../../../public/loading.gif";
import "animate.css";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import registrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";

interface FormValues {
  status: number;
  cedula: any;
  coment: string;
}

interface Registro {
  cedula: any;
  nombre: string;
}

interface GetRegistrosResponse {
  registros: Registro[];
}

const defaultValues: FormValues = {
  cedula: "",
  coment: "",
  status: 1,
};

const showError = (title: string) => {
  Swal.fire({
    position: "center",
    icon: "warning",
    title,
    showConfirmButton: false,
    timer: 2000,
  });
};

const success = (title: string) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 2000,
  });
};

const premios = [
  { premio: "Abanico", slug: "abanicos" },
  { premio: "Bono de $5 mil pesos", slug: "bonos_de_$5_mil_pesos" },
  { premio: "Cilindro de gas", slug: "cilindro_de_gas" },
  { premio: "Estufa de horno", slug: "estufa_de_horno" },
  { premio: "Estufa mesa 4 hornillas", slug: "estufa_mesa_4_hornillas" },
  { premio: "Freidora", slug: "freidoras" },
  { premio: "Juego de colcha", slug: "juego_de_colcha" },
  { premio: "Lavadora", slug: "lavadoras" },
  { premio: "Licuadora", slug: "licuadoras" },
  { premio: "Microonda", slug: "microondas" },
  { premio: "Nevera", slug: "nevera" },
  { premio: "Olla de presión", slug: "ollas_de_presion" },
  { premio: "Televisor", slug: "televisores" },
];

const municipios = [
  { municipio: "La Romana", slug: "la-romana" },
  { municipio: "Villa Hermosa", slug: "villa-hermosa" },
  { municipio: "Guaymate", slug: "guaymate" },
];

const Verificar = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const errorMessages = {
    invalidMunicipio: "Seleccione un municipio o distrito válido",
    invalidBoleta: "Ingrese una cédula válida",
    duplicateBoleta: "Esta cédula ya ha sido registrada",
    cedulaNotFound: "No se encontró un registro con esa cédula",
    cedulaNoValida: "Ingrese un numero de cedula valido",
    cedulaParticipando: `Esta cédula ya está participando`,
    nombreRequerido: "El nombre es necesario",
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entregadoTrue, setEntregadoTrue] = useState(false);
  const [cedula, setCedula] = useState("");
  const [persona, setPersona] = useState<
    {
      nombre: string;
      cedula: string;
      premio: string;
      municipio: string;
      coment: string;
      status: string;
    }[]
  >([]);

  const [text, setText] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getByCedula = async (cedula: string) => {
    setPersona([]); // Clear current persona before fetching new data
    setIsSubmitting(true); // Disable form while fetching
    try {
      const response = await registrosService.getRegistroByCedula(3, cedula);

      if (response.data.registros.length < 1) {
        console.log("no ganó");
        showError("Esta cedula no fue ganadora");
        return;
      }

      setEntregadoTrue(
        response.data.registros[0]?.status === "4" ? true : false
      );
      console.log(entregadoTrue);
      setText(response.data.registros[0].coment);
      setPersona(response.data.registros);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false); // Enable form after fetching
    }
  };

  const ActualizarRegistros = async () => {
    console.log("update: ", text);
    if (!text) {
      showError("Debe escribir un comentario");
      return;
    }

    setIsSubmitting(true);
    const reponse = await registrosService.startUpdateByCedula(cedula, text, 4);
    if (reponse.status === 200) {
      success("Listo!");
      setText("");
      setPersona([]);
      setIsSubmitting(false);
    } else {
      showError("Intente nuevamente");
      setPersona([]);
      setIsSubmitting(false);
    }
  };

  const openSwalForNumber = async () => {
    if (!text) {
      showError("Debe escribir un comentario");
      return;
    }
    const { value: number } = await Swal.fire({
      title: "Código de autorización",
      input: "password",
      inputLabel: "Sólo guarde cuando entregue el premio (no revele su codigo)",
      inputPlaceholder: "Ingrese su código",
      showCancelButton: true,
      confirmButtonText: "Guardar", // Texto del botón "Guardar"
      cancelButtonText: "Abortar",
      confirmButtonColor: "#06502a",
      cancelButtonColor: "red",
      inputAttributes: {
        maxlength: 4, // Limitar la longitud máxima si es necesario
        inputmode: "numeric", // Sugerir teclado numérico en dispositivos móviles
      },
      inputValidator: (value) => {
        if (!value) {
          return "Necesita ingresar un número!";
        }
        if (isNaN(Number(value))) {
          return "El valor debe ser un número válido!";
        }
        return null;
      },
    });

    if (number === "2569") {
      ActualizarRegistros();
    }
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const cedulaValue = (event.target as HTMLInputElement).value;
      if (cedulaValue.length === 13) {
        await getByCedula(cedulaValue);
      }
    }
  };

  const registerSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.cedula.length === 13) {
      setCedula(data.cedula);
      await getByCedula(data.cedula);
    } else {
      showError(errorMessages.cedulaNoValida);
    }
    reset({ ...defaultValues, cedula: "" });
  };

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: "center",
  }));

  return (
    <Grid
      container
      my={1}
      rowSpacing={2}
      columnSpacing={1}
      sx={{
        alignItems: "center",

        justifyContent: "center",
      }}
    >
      <Grid
        item
        md={12}
        sm={10}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Item
          sx={{
            minHeight: "100%",
            width: "400px",
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleSubmit(registerSubmit)}>
            <InputMask
              mask="999-9999999-9"
              maskChar=""
              {...register("cedula", {
                required: true,
                maxLength: 13,
              })}
              disabled={isSubmitting}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  variant="outlined"
                  color="success"
                  type="text"
                  label="Cédula"
                  sx={{ minWidth: "40%", margin: "5px 5px 15px 0px" }}
                  inputRef={inputRef}
                  onKeyDown={handleKeyPress}
                  disabled={isSubmitting}
                />
              )}
            </InputMask>
            <Button
              variant="contained"
              color="success"
              type="submit"
              sx={{ minWidth: "30%", margin: "5px 5px 15px 0px" }}
              disabled={isSubmitting}
            >
              Buscar
            </Button>
          </form>
        </Item>
      </Grid>

      <Grid
        item
        md={12}
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {persona && persona.length > 0 ? (
          <Grid style={{ justifyContent: "center", alignItems: "center" }}>
            <Item
              sx={{
                height: "70%",
                width: "400px",
                backgroundColor: "seagreen",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <Grid
                container
                columnSpacing={1}
                sx={{
                  flex: 1,
                  width: "100%",
                  minHeight: "200px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  maxHeight: "100%",
                }}
              >
                {persona.map((e) => (
                  <Grid item md={12} key={e.cedula}>
                    <Typography
                      variant="h2"
                      style={{
                        fontSize: "52px",
                        fontWeight: "bold",
                        color: "wheat",
                        textTransform: "uppercase",
                      }}
                    >
                      {e.nombre}
                    </Typography>
                    <Typography
                      variant="h5"
                      style={{
                        marginTop: 5,
                        backgroundColor: "darkseagreen",
                        borderRadius: 5,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {e.cedula}
                    </Typography>
                    <Typography
                      variant="h5"
                      style={{
                        marginTop: 5,
                        backgroundColor: "coral",
                        borderRadius: 5,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {
                        premios.find((premio) => premio.slug === e.premio)
                          ?.premio
                      }
                    </Typography>

                    <Typography
                      variant="h5"
                      style={{
                        marginTop: 5,
                        backgroundColor: "darkgreen",
                        borderRadius: 5,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {
                        municipios.find(
                          (municipio) => municipio.slug === e.municipio
                        )?.municipio
                      }
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontWeight: "bold",
                        borderRadius: 5,
                        marginTop: 10,
                        padding: 10,
                        backgroundColor:
                          e.status == "3" ? "greenyellow" : "darkred",
                      }}
                    >
                      {e.status == "3"
                        ? "Premio no entregado"
                        : "Premio entregado"}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Item>
            <form onSubmit={handleSubmit(ActualizarRegistros)}>
              <label style={{ width: "100%", marginTop: "15px" }}>
                <Typography variant="h6">Ingrese algún comentario:</Typography>
                <textarea
                  style={{
                    width: "100%",
                    height: "100px",
                    fontSize: "16px",
                    padding: "10px",
                    boxSizing: "border-box",
                    marginTop: "20px",
                  }}
                  value={text}
                  onChange={handleTextChange}
                  disabled={isSubmitting || entregadoTrue}
                />
              </label>
              <Button
                variant="contained"
                color="error"
                type="submit"
                sx={{ width: "100%", margin: "5px 5px 15px 0px" }}
                disabled={isSubmitting || entregadoTrue}
                onClick={openSwalForNumber}
              >
                Actualizar
              </Button>
            </form>
          </Grid>
        ) : (
          <>
            {isSubmitting ? (
              <Grid
                style={{
                  display: "block",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={gifLoading}
                  alt="loading"
                  style={{ width: "100px" }}
                />
                <Typography style={{ color: "darkgreen" }}>
                  Cargando...
                </Typography>
              </Grid>
            ) : (
              ""
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Verificar;
