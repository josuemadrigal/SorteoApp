import React, { useEffect, useState } from "react";
import "../../App.css";
import SearchIcon from "@mui/icons-material/Search";
import { useMutation } from "react-query";
import "animate.css";
import {
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  styled,
} from "@mui/material";
import { useForm } from "react-hook-form";
import registrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";
import PremioSelect from "./components/PremioSelect";
import MunicipioSelect from "./components/MunicipioSelect";
import CustomButton from "./components/CustomButton";
import TableGanadores from "../ViewPremios/components/TableGanadores";

interface FormValues {
  nombre: string;
  cedula: string;
  premio: string;
  ronda: string;
  municipio: string;
}

interface Registro {
  nombre: string;
  cedula: string;
  premio: string;
  ronda: string;
  municipio: string;
}

interface GetRegistrosResponse {
  registros: Registro[];
}

interface Premio {
  slug_premio: string;
  premio: string;
  la_romana: string;
  caleta: string;
  villa_hermosa: string;
  cumayasa: string;
  guaymate: string;
}

const ViewGanadores: React.FC = () => {
  const { getValues, register } = useForm<FormValues>({
    defaultValues: {
      premio: "",
      ronda: "",
      municipio: "",
    },
  });
  const [ronda, setRonda] = useState<string>("");
  const [premio, setPremio] = useState<string>("");
  const [municipioT, setMunicipioT] = useState<string>("");
  const [premios, setPremios] = useState<Premio[]>([]);
  const [ganadores, setGanadores] = useState<Registro[]>([]);

  useEffect(() => {
    const fetchPremios = async () => {
      try {
        const response = await registrosService.getPremios();
        if (response.data.ok) {
          setPremios(response.data.premios);
        }
      } catch (error) {
        console.error("Error fetching premios", error);
      }
    };

    fetchPremios();
  }, []);

  const handleMunicipio = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMunicipioT(event.target.value as string);
  };

  const handlePremio = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedPremioValue = event.target.value as string;
    const selectedPremio = premios.find(
      (item) => item.slug_premio === selectedPremioValue
    );
    if (selectedPremio) {
      setPremio(selectedPremioValue);
    }
  };

  const { mutate: getRegistros } = useMutation<
    GetRegistrosResponse,
    Error,
    FormValues
  >(
    async (param: FormValues) => {
      const response = await registrosService.getRegistrosGanadores(
        param.municipio,
        param.ronda,
        param.premio
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        const registros = data.registros || [];
        setGanadores(registros);
      },
      onError: () => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error al obtener los registros",
          showConfirmButton: false,
          timer: 7000,
        });
      },
    }
  );

  const CustomGetRegistros = async () => {
    const param: FormValues = getValues();
    param.municipio = municipioT;
    param.ronda = ronda;
    param.premio = premio;

    if (param.ronda !== "" && param.municipio !== "" && param.premio !== "") {
      getRegistros(param);
    } else {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "Verifique los filtros",
        showConfirmButton: false,
        timer: 7000,
      });
    }
  };

  const handleRondaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRonda(event.target.value as string);
  };

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: "center",
  }));

  return (
    <Grid container my={1} rowSpacing={1} columnSpacing={1}>
      <Grid item md={2} sm={10} sx={{ position: "fixed" }}>
        <Item sx={{ height: "40vh", width: "220px" }}>
          <MunicipioSelect
            value={municipioT}
            onChange={handleMunicipio}
            register={register}
          />
          <div style={{ display: "flex" }}>
            <InputLabel sx={{ marginTop: "20px", width: "40%" }}>
              RONDA #
            </InputLabel>
            <Select
              value={ronda}
              onChange={handleRondaChange}
              displayEmpty
              variant="filled"
              color="success"
              sx={{ margin: "5px 5px 15px 0px", width: "58%" }}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>
                Seleccione la ronda
              </MenuItem>
              {[...Array(10).keys()].map((n) => (
                <MenuItem key={n + 1} value={n + 1}>
                  {n + 1}
                </MenuItem>
              ))}
            </Select>
          </div>
          <PremioSelect
            value={premio}
            onChange={handlePremio}
            premios={premios}
          />

          <CustomButton
            onClick={CustomGetRegistros}
            icon={<SearchIcon />}
            text="Buscar"
            color="success"
          />
        </Item>
      </Grid>

      <Grid item md={12}>
        <Item
          sx={{
            height: "calc(100vh)",
            marginLeft: "250px",
            backgroundColor: "#06502a",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            columnSpacing={1}
            sx={{
              justifyContent: "center",

              // flex: 1,
              width: "100%",
              minHeight: "200px",
            }}
          >
            <Typography
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "25px",
                marginTop: "55px",
                color: "white",
                backgroundColor: "seagreen",
                padding: "10px",
                borderRadius: "10px",
              }}
              gutterBottom
              textAlign="center"
            >
              Lista de ganadores
            </Typography>

            <TableGanadores premios={ganadores} />
          </Grid>
        </Item>
      </Grid>
    </Grid>
  );
};

export default ViewGanadores;
