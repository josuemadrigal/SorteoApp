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
  InputLabel,
  MenuItem,
  TextField,
  TextFieldProps,
} from "@mui/material";

import Select from "@mui/material/Select";
import RegistrosService from "../../services/RegistrosService";
import { useRef } from "react";
import { useLocation, useParams } from "react-router-dom";

// import BarcodeScanner from "../../components/BarcodeScanner";

const modelo = {
  defaultValues: {
    boleta: "",
    municipio: "",
    status: 1,
    premio: "",
  },
};

export const Registro = (props: any) => {
  //const { formState, setValue, getValues, register} = useForm(modelo);
  const { getValues, register, setValue } = useForm(modelo);
  const [boleta, setBoleta] = React.useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const municipioNombre = id || "";
  const location = useLocation();
  const objeto = location.state?.parametros;

  const municipio = objeto.municipio || "";

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Lógica que deseas ejecutar al presionar Enter
      registerSubmit(event);
    }
  };

  const handleClic = (event) => {
    event.key = "Enter";
    registerSubmit(event);
  };

  const registerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const objeto = getValues();

      objeto.municipio = municipioNombre;

      if (!objeto.municipio) {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: "Seleccione el municipio o distrito",
          showConfirmButton: false,
          timer: 7000,
        });
      }

      if (objeto.municipio.length < 1) {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: "Seleccione el municipio o distrito",
          showConfirmButton: false,
          timer: 7000,
        });
      }

      if (objeto.boleta.length < 8 || objeto.boleta.length > 8) {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: "Ingrese una boleta valida",
          showConfirmButton: false,
          timer: 7000,
        });
      }
      objeto.status = 1;
      objeto.premio = "";

      Swal.fire({
        title: "¿Están correctos sus datos?",
        html: `<h4> Municipio: <b>${municipio}</b></h4>
              <h4> # Boleta: <b>${objeto.boleta}</b></h4>`,

        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Editar datos",
        confirmButtonColor: "#2e7d32",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await RegistrosService.crearRegistros(objeto);

          if (response.status == 203) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Intente más tarde",
              showConfirmButton: false,
              timer: 7000,
            });
          }

          if (response.status == 201) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: `Registro de la boleta ${objeto.boleta} COMPLETADO`,
              showConfirmButton: false,
              timer: 3000,
            });

            if (inputRef.current) {
              inputRef.current.focus();
              setValue("boleta", "");
            }
            // return setTimeout(() => {
            //   window.location.replace(
            //     "https://www.instagram.com/eduardespiritusanto/"
            //   );
            // }, 2000);
          }

          if (response.status == 203) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Esta boleta ya ha sido registrada",
              showConfirmButton: false,
              timer: 7000,
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "Intente más tarde",
        showConfirmButton: false,
        timer: 9000,
      });
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
          // minWidth: "",
          // backgroundImage: `url(/fondoE.jpg)`,
          // backgroundSize: "cover",
          // backgroundPosition: "center",

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
              {/* <InputLabel id="demo-multiple-name-label">
                Municipio / Distrito
              </InputLabel>
              <Select
                variant="filled"
                {...register("municipio", { required: true })}
                color="success"
                sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
              >
                <MenuItem value="caleta">Caleta</MenuItem>
                <MenuItem value="cumayasa">Cumayasa</MenuItem>
                <MenuItem value="guaymate">Guaymate</MenuItem>
                <MenuItem value="la-romana">La Romana</MenuItem>
                <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
              </Select> */}

              <InputMask
                // alwaysShowMask
                {...props}
                mask="aa999999"
                maskChar=""
                maskPlaceholder={null}
                value={boleta}
                required
                {...register("boleta", { required: true, maxLength: 11 })}
                sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                onChange={(e) => setBoleta(e.target.value)}
              >
                {(inputProps: Props & TextFieldProps) => (
                  <TextField
                    {...inputProps}
                    variant="filled"
                    color="success"
                    type="text"
                    label="Número de boleta"
                    inputRef={register("boleta")}
                    ref={inputRef}
                    onKeyDown={handleKeyPress}
                  />
                )}
              </InputMask>
              {/* <BarcodeScanner /> */}
              <Button
                variant="contained"
                color="success"
                type="submit"
                onClick={handleClic}
                sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
              >
                Registrar
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

//export default Registro;
