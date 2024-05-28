import React, { useEffect, useState } from "react";
import "../../App.css";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
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
import TablePremios from "./components/TablePremios";

interface FormValues {
  municipio: string;
  premio: string;
  status: number;
  cantidad: number;
  ronda: string;
  cedula: string;
}

interface Registro {
  cedula: any;
  nombre: string;
}

interface GetRegistrosResponse {
  registros: Registro[];
}

const ViewPremios = () => {
  const { getValues, register } = useForm<FormValues>({
    defaultValues: {
      municipio: "",
      premio: "",
      status: 1,
      cantidad: 4,
      ronda: "1",
    },
  });
  const [ronda, setRonda] = useState("");
  const [checkList, setCheckList] = useState<Registro[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [unCheckList, setUnCheckList] = useState<string[]>([]);
  const [premio, setPremio] = useState("");
  const [premioTitle, setPremioTitle] = useState("");
  const [municipioT, setMunicipioT] = useState("");
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [premios, setPremios] = useState<
    {
      slug_premio: string;
      premio: string;
      la_romana: string;
      caleta: string;
      villa_hermosa: string;
      cumayasa: string;
      guaymate: string;
    }[]
  >([]);

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
      setPremioTitle(selectedPremio.premio);
      setPremio(selectedPremioValue);
    }
  };

  const { mutate: getRegistros } = useMutation<
    GetRegistrosResponse,
    Error,
    FormValues
  >(
    async (param: FormValues) => {
      const response = await registrosService.getRegistros(
        param.status,
        param.municipio,
        param.cantidad
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        const registros = data.registros || [];
        setCheckList(registros);
        const checkedNames = new Set(
          registros.map((registro) => registro.cedula)
        );
        setCheckedItems(checkedNames);
        setUnCheckList([]);
        setIsSearchButtonDisabled(true);
        setIsSaveButtonDisabled(false);
      },
      onError: () => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error al obtener los registros",
          showConfirmButton: false,
          timer: 7000,
        });
        setIsSearchButtonDisabled(false);
      },
    }
  );

  const CustomGetRegistros = async () => {
    const param: FormValues = getValues();
    param.municipio = municipioT;
    param.ronda = ronda;

    if (param.cantidad > 0 && param.municipio !== "") {
      getRegistros(param);
    } else {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "Verifique los parámetros",
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
      {/* <Grid item md={2} sm={10} sx={{ position: "fixed" }}>
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
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="7">7</MenuItem>
              <MenuItem value="8">8</MenuItem>
              <MenuItem value="9">9</MenuItem>
              <MenuItem value="10">10</MenuItem>
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
      </Grid> */}

      <Grid item md={12}>
        <Item
          sx={{
            height: "calc(100vh)",
            marginX: "250px",
            backgroundColor: "#06502a",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            columnSpacing={1}
            sx={{
              justifyContent: "center",

              flex: 1,
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
              Lista de premios
            </Typography>
            <TablePremios premios={premios} />
          </Grid>
        </Item>
      </Grid>
    </Grid>
  );
};

export default ViewPremios;
