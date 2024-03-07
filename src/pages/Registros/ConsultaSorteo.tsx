import { useState } from "react";
import "../../App.css";

import GifTombola from "../../../public/gif-padresLow.gif";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";

// import Lottie, {LottieRefCurrentProps} from 'lottie-react';
// import animationData from '../../assets/65849-emos-spin.json'

import { useMutation } from "react-query";

import "animate.css";

import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import registrosService from "../../services/RegistrosService";
import { useForm } from "react-hook-form";

import RegistrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";

import { RenderBoletas } from "../../components/RenderBoletas";

interface FormValues {
  municipio: string;
  premio: string;
  status: number;
  cantidad: number;
}
export const Consulta = () => {
  // const spinRef = useRef<LottieRefCurrentProps>(null);

  // const [checked, setChecked] = useState<any[]>([]);

  const premiosData = [
    { premioText: "Nevera", premioValue: "Nevera" },
    { premioText: "Televisor", premioValue: "Televisor" },
    { premioText: "Estufa de horno", premioValue: "Estufa-Horno" },
    { premioText: "Estufa de mesa", premioValue: "Estufa-Mesa" },
    { premioText: "Licuadora", premioValue: "Licuadora" },
    { premioText: "Horno", premioValue: "Horno" },
    { premioText: "Abanico", premioValue: "Abanico" },
    { premioText: "Tanque de Gas", premioValue: "Tanque-Gas" },
    { premioText: "Olla de Presion", premioValue: "Olla-Presion" },
    { premioText: "Juego de Colcha", premioValue: "Juego-Colcha" },
    { premioText: "Lavadora", premioValue: "Lavadora" },
    { premioText: "Microonda", premioValue: "Microonda" },
    { premioText: "Freidora", premioValue: "Freidora" },
  ];
  const { getValues, register } = useForm<FormValues>({
    defaultValues: {
      municipio: "",
      premio: "",
      status: 1,
      cantidad: 4,
    },
  });
  const [checkList, setCheckList] = useState<any[]>([]);

  const [unCheckList, setUnCheckList] = useState<any[]>([]);

  const [premio, setPremio] = useState("");
  const [premioTitle, setPremioTitle] = useState("");
  const [municipioT, setMunicipioT] = useState("");

  const handleMunicipio = (event: SelectChangeEvent) => {
    setMunicipioT(event.target.value);
    //register("municipio")(municipioT);
    console.log(municipioT);
  };
  const handlePremio = (event: SelectChangeEvent) => {
    const selectedPremioValue = event.target.value;
    const selectedPremio = premiosData.find(
      (item) => item.premioValue === selectedPremioValue
    );

    if (selectedPremio) {
      setPremioTitle(selectedPremio.premioText);
      setPremio(selectedPremioValue);
    }
    console.log(premio);
  };

  const { mutate: getRegistros } = useMutation<any>(
    async (param: any) =>
      await registrosService.getRegistros(
        param.status,
        param.municipio,
        param.cantidad
      )
  );

  const CustomGetRegistros = async () => {
    setCheckList([]);

    setUnCheckList([]);

    const param: any = getValues();
    param.municipio = municipioT;

    if (param.cantidad <= 0) {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "La cantidad no puede ser 0",
        showConfirmButton: false,
        timer: 7000,
      });
    }

    if (param.cantidad > 0 && param.municipio != "") {
      const dataa: any = await registrosService.getRegistros(
        param.status,
        param.municipio,
        param.cantidad
      );
      await getRegistros(param);

      const a = dataa?.data?.registros?.map((m) => {
        return m;
      });
      // const b = data?.data?.registros.map((datos) => { return datos.cedula});

      setCheckList(a);
      // setChecked(a);
    } else {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "Verifique los parametros",
        showConfirmButton: false,
        timer: 7000,
      });
    }
  };

  const ActualizarRegistros = () => {
    //Seleccionado
    for (let index = 0; index < checkList.length; index++) {
      const element = checkList[index];
      RegistrosService.startUpdate(String(element.boleta), 2, premio);
    }
    // No seleccionado
    for (let index = 0; index < unCheckList.length; index++) {
      const element = unCheckList[index];
      RegistrosService.startUpdate(element, 0, "No presente");
    }
    setCheckList([]);
    // setChecked([]);
    setUnCheckList([]);
  };

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: "center",
  }));

  return (
    <Grid container my={1} rowSpacing={2} columnSpacing={1}>
      <Grid item md={2} sm={10} sx={{ position: "fixed" }}>
        <Item sx={{ height: "850px", width: "220px" }}>
          <img src={GifTombola} alt="TOMBOLA" width="90%" />

          <InputLabel sx={{ marginTop: "20px" }}>
            Municipio / Distrito
          </InputLabel>
          <Select
            value={municipioT}
            {...register("municipio", { required: true, maxLength: 10 })}
            color="success"
            onChange={handleMunicipio}
            sx={{ minWidth: "40%", width: "100%", margin: "5px 5px 15px 0px" }}
          >
            <MenuItem value="caleta">Caleta</MenuItem>
            <MenuItem value="cumayasa">Cumayasa</MenuItem>
            <MenuItem value="guaymate">Guaymate</MenuItem>
            <MenuItem value="la-romana">La Romana</MenuItem>
            <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
          </Select>

          <TextField
            type="text"
            placeholder="Cantidad"
            label="Cantidad"
            color="success"
            {...register("cantidad", { required: true, maxLength: 10 })}
            sx={{
              minWidth: "20%",
              width: "100%",
              margin: "5px 5px 15px 0px",
              textAlign: "center",
            }}
          />

          <Select
            value={premio}
            color="success"
            onChange={handlePremio}
            sx={{ minWidth: "40%", width: "100%", margin: "5px 5px 15px 0px" }}
          >
            {premiosData.map((e) => (
              <MenuItem value={e.premioValue}>{e.premioText}</MenuItem>
            ))}
          </Select>

          <Button
            onClick={() => CustomGetRegistros()}
            variant="contained"
            color="success"
            size="large"
            sx={{ width: "100%", marginBottom: "90px", marginTop: "20px" }}
            endIcon={<SearchIcon />}
          >
            Buscar
          </Button>

          <Button
            onClick={() => ActualizarRegistros()}
            variant="contained"
            color="info"
            size="large"
            sx={{ width: "100%" }}
            endIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </Item>
      </Grid>
      {/* END CONTROLES */}

      <Grid item md={12}>
        <Item
          sx={{
            height: "calc(100vh)",
            marginLeft: "250px",
            backgroundColor: "#06502a",
            justifyContent: "center",
          }}
        >
          <Typography
            gutterBottom
            variant="h3"
            component="div"
            sx={{ color: "#fff", backgroundColor: "#ef5061" }}
          >
            Ganadoras de un {premioTitle}
          </Typography>{" "}
          <Grid
            container
            // rowSpacing={1}
            columnSpacing={1}
            sx={{
              justifyContent: "center",
              transition: "ease-in",

              flex: 1,
              width: "100%",
              minHeight: "200px",
              // height: "calc(90vh)",
              //backgroundColor: "red",
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "calc(95vh - 64px)",
            }}
          >
            {checkList.length <= 0 ? (
              <p>------</p>
            ) : (
              <RenderBoletas items={checkList} />
            )}
          </Grid>
        </Item>
      </Grid>
    </Grid>
  );
};

//export default Registro;
