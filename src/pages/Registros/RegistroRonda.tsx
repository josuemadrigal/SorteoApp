import { useEffect, useState, useRef } from "react";
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
import MunicipioSelect from "../../screens/ViewGanadores/components/MunicipioSelect";
import PremioSelect from "../../screens/Consulta/components/PremioSelect";

const modelo = {
  defaultValues: {
    municipio: "",
    premio: "",
    ronda: "",
    cantidad: 0,
    status: "activa",
  },
};

export const RegistroRonda = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(modelo);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [municipioT, setMunicipioT] = useState("");
  const [premio, setPremio] = useState("");
  const [rondaNum, setRondaNum] = useState(0);

  const [premios, setPremios] = useState<
    { slug_premio: string; premio: string }[]
  >([]);

  useEffect(() => {
    const fetchPremios = async () => {
      try {
        const response = await RegistrosService.getPremios();
        if (response.data.ok) {
          setPremios(response.data.premios);
        }
      } catch (error) {
        console.error("Error fetching premios", error);
      }
    };

    fetchPremios();
  }, [premio]);

  const fetchRonda = async (municipioT: string, premio: string) => {
    try {
      const response = await RegistrosService.getRondaNum(municipioT, premio);
      const rondaRegistrada = parseInt(response.data.ronda[0]?.ronda);
      const rondaSiguiente = rondaRegistrada ? rondaRegistrada + 1 : 1;
      setRondaNum(rondaSiguiente);
    } catch (error) {
      console.error("Error fetching premios", error);
    }
  };

  const registerSubmit = async (objeto: any) => {
    console.log("entro");
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
    objeto.premio = premio;
    objeto.ronda = rondaNum.toString();

    if (!objeto.premio || objeto.cantidad <= 0) {
      showError(errorMessages.emptyFields);
      return;
    }

    try {
      objeto.status = "activa";

      console.log("hola: ", objeto);

      const response = await RegistrosService.regRonda(objeto);

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
        reset({
          premio: "",
          cantidad: 0,
        });
      }
    } catch (error) {
      console.log(error);
      showError("Intente más tarde");
    }
  };

  const handleMunicipio = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log(event.target.value as string);
    setMunicipioT(event.target.value as string);
    if (premio !== "") {
      fetchRonda(event.target.value as string, premio);
    }
  };

  const handlePremio = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedPremioValue = event.target.value as string;
    const selectedPremio = premios.find(
      (item) => item.slug_premio === selectedPremioValue
    );
    if (selectedPremio) {
      setPremio(selectedPremioValue);
      fetchRonda(municipioT, selectedPremioValue);
      //fetchRonda();
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
              sx={{
                color: "#2e7d32",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {`Registro de ronda ${rondaNum ? `#${rondaNum}` : ``}`}
            </Typography>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()}>
                <MunicipioSelect
                  value={municipioT}
                  onChange={handleMunicipio}
                  register={register}
                />
                <PremioSelect
                  value={premio}
                  onChange={handlePremio}
                  premios={premios}
                  disabled={false}
                />

                <TextField
                  variant="filled"
                  type="number"
                  color="success"
                  placeholder="Cantidad"
                  label="Cantidad"
                  defaultValue={0}
                  inputProps={{ maxLength: 60, min: 1 }}
                  required
                  {...register("cantidad", {
                    required: true,
                    maxLength: 80,
                    min: 1,
                  })}
                  sx={{
                    width: "100%",
                    margin: "5px 5px 15px 0px",
                    marginTop: "25px",
                  }}
                  error={!!errors.cantidad}
                  helperText={errors.cantidad ? "Cantidad no puede ser 0" : ""}
                />

                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  sx={{ minWidth: "100%", margin: "5px 5px 15px 0px" }}
                  onClick={handleSubmit(registerSubmit)}
                >
                  Guardar
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
