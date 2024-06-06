import React, { useEffect, useState } from "react";
import "../../App.css";
import GifTombola from "../../../public/gif-TOMBOLA.gif";
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
import { RenderBoletas } from "../../components/RenderBoletas";
import PremioSelect from "./components/PremioSelect";
import MunicipioSelect from "./components/MunicipioSelect";
import CantidadInput from "./components/CantidadInput";
import CustomButton from "./components/CustomButton";

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

const Consulta = () => {
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
  const [rondaId, setRondaId] = useState(0);
  const [checkList, setCheckList] = useState<Registro[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [unCheckList, setUnCheckList] = useState<string[]>([]);
  const [premio, setPremio] = useState("");
  const [premioTitle, setPremioTitle] = useState("");
  const [municipioT, setMunicipioT] = useState("");
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [premios, setPremios] = useState<
    { slug_premio: string; premio: string }[]
  >([]);
  const [cantiRonda, setCantiRonda] = useState("");

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

  useEffect(() => {
    fetchRonda();
  }, [premio]);

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
      //fetchRonda();
    }
    setIsSearchButtonDisabled(false);
    setIsSaveButtonDisabled(true);
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

  const fetchRonda = async () => {
    try {
      const response = await registrosService.getRonda(municipioT, premio);
      setCantiRonda(response.data.ronda[0]?.cantidad);
      setRonda(response.data.ronda[0]?.ronda);
      setRondaId(response.data.ronda[0]?.id);
      console.log("desde ronda: ", cantiRonda);
    } catch (error) {
      console.error("Error fetching premios", error);
    }
  };

  const buscarRegistros = async () => {
    //fetchRonda();

    const param: FormValues = getValues();
    param.municipio = municipioT;
    param.ronda = ronda;
    param.premio = premio;
    param.cantidad = cantiRonda ? parseInt(cantiRonda) : 0;

    if (param.cantidad <= 0) {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: `Al parecer no hay mas rondas para ${premio.toUpperCase()} en ${municipioT.toUpperCase()}`,
        showConfirmButton: false,
        timer: 5000,
      });
    }

    if (
      //param.cantidad > 0 &&
      param.municipio !== "" &&
      //param.ronda !== "" &&
      param.premio !== ""
    ) {
      setIsSearchButtonDisabled(false);
      setIsSaveButtonDisabled(true);
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

  // const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, checked } = event.target;
  //   setCheckedItems((prev) => {
  //     const updated = new Set(prev);
  //     if (checked) {
  //       updated.add(value);
  //     } else {
  //       updated.delete(value);
  //     }
  //     return updated;
  //   });
  // };

  // const isChecked = (cedula: string) => {
  //   return checkedItems.has(cedula);
  // };

  const ActualizarRegistros = async () => {
    setIsSaveButtonDisabled(true);

    for (const element of checkList) {
      const status = checkedItems.has(element.cedula) ? 3 : 0;
      const premioText = checkedItems.has(element.cedula)
        ? premio
        : "No presente";
      await registrosService.startUpdate(
        String(element.cedula),
        status,
        premioText,
        ronda
      );
    }

    await registrosService.updateRonda(
      rondaId,
      "no activa",
      municipioT,
      ronda,
      premio
    );
    setCantiRonda("");
    setRonda("");
    setPremio("");
    setCheckList([]);
    setCheckedItems(new Set());
    setUnCheckList([]);
    setIsSearchButtonDisabled(true);
  };

  // const handleRondaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //   setRonda(event.target.value as string);
  //   //register("ronda", event.target.value as string);
  // };

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: "center",
  }));

  const filteredCheckList = checkList.filter((item) =>
    checkedItems.has(item.cedula)
  );

  return (
    <Grid container my={1} rowSpacing={2} columnSpacing={1}>
      <Grid item md={2} sm={10} sx={{ position: "fixed" }}>
        <Item sx={{ height: "94vh", width: "220px" }}>
          <img src={GifTombola} alt="TOMBOLA" width="90%" />
          <MunicipioSelect
            value={municipioT}
            onChange={handleMunicipio}
            register={register}
            disabled={!isSaveButtonDisabled}
          />

          <PremioSelect
            value={premio}
            onChange={handlePremio}
            premios={premios}
            disabled={!isSaveButtonDisabled}
          />

          <CustomButton
            onClick={buscarRegistros}
            icon={<SearchIcon />}
            text="Buscar"
            color="success"
            disabled={isSearchButtonDisabled}
          />

          <CustomButton
            onClick={ActualizarRegistros}
            icon={<SaveIcon />}
            text="Guardar"
            color="error"
            disabled={isSaveButtonDisabled}
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
          <div
            style={{
              backgroundColor: "#ef5061",
              minWidth: "100%",
              minHeight: "50px",
              padding: "10px 0px 10px 0px",
            }}
          >
            <Typography
              gutterBottom
              variant="h3"
              component="div"
              sx={{
                color: "#fff",
                textTransform: "uppercase",
                fontSize: 15,
                borderRadius: "5px",
              }}
            >
              {`Ronda # ${ronda ? ronda : "-"}`}
            </Typography>

            <Typography
              gutterBottom
              variant="h3"
              component="div"
              sx={{
                color: "#fff",
                backgroundColor: "#ef5061",
                fontSize: 30,
                borderRadius: "5px",
                textTransform: "uppercase",
              }}
            >
              {`${cantiRonda ? cantiRonda + " ganadoras de " : ""} `}
              <span
                style={{
                  color: "#fff",
                  backgroundColor: "#ef5061",
                  fontSize: 40,
                  fontWeight: "bold",
                }}
              >
                {cantiRonda ? premioTitle : ""}
              </span>
            </Typography>
          </div>
          <Grid
            container
            columnSpacing={1}
            sx={{
              justifyContent: "center",
              transition: "ease-in",
              flex: 1,
              width: "100%",
              minHeight: "200px",
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "calc(95vh - 64px)",
            }}
          >
            {filteredCheckList.length <= 0 && isSearchButtonDisabled == true ? (
              <p
                style={{
                  opacity: "50%",
                  textTransform: "uppercase",
                  letterSpacing: "0.5rem",
                  marginTop: "10rem",
                  color: "silver",
                }}
              >
                Presiona el botón buscar
              </p>
            ) : (
              <RenderBoletas items={filteredCheckList} />
            )}
          </Grid>
        </Item>
      </Grid>
    </Grid>
  );
};

export default Consulta;
