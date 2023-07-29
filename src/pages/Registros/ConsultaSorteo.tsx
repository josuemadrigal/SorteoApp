import { useState } from "react";
import "../../App.css";

import GifTombola from "../../../public/gif-padresLow.gif";

// import Lottie, {LottieRefCurrentProps} from 'lottie-react';
// import animationData from '../../assets/65849-emos-spin.json'

import { useMutation } from "react-query";
//import SearchIcon from '@mui/icons-material/Search';
//import SaveIcon from '@mui/icons-material/Save';

import "animate.css";

import {
  Button,
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

const modelo = {
  defaultValues: {
    municipio: "-",
    premio: "",
    status: 1,
    cantidad: 4,
  },
};

export const Consulta = () => {
  const { getValues, register } = useForm(modelo);

  // const spinRef = useRef<LottieRefCurrentProps>(null);

  // const [checked, setChecked] = useState<any[]>([]);
  const [checkList, setCheckList] = useState<any[]>([]);

  const [unCheckList, setUnCheckList] = useState<any[]>([]);

  const [premio, setPremio] = useState("");
  const [municipioT, setMunicipioT] = useState("");

  const handleMunicipio = (event: SelectChangeEvent) => {
    setMunicipioT(event.target.value);
    console.log(municipioT);
  };
  const handlePremio = (event: SelectChangeEvent) => {
    setPremio(event.target.value);
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
        title: "Seleccione el municipio",
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

          <Typography gutterBottom variant="h5" component="div">
            Buscar
          </Typography>
          <InputLabel>Municipio / Distrito</InputLabel>
          <Select
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
            label="cantidad"
            color="success"
            {...register("cantidad", { required: true, maxLength: 10 })}
            sx={{ minWidth: "20%", width: "100%", margin: "5px 5px 15px 0px" }}
          />

          <Select
            value={premio}
            color="success"
            onChange={handlePremio}
            sx={{ minWidth: "40%", width: "100%", margin: "5px 5px 15px 0px" }}
          >
            <MenuItem value="Abanico">Abanico</MenuItem>
            <MenuItem value="Bono">Bono</MenuItem>
            <MenuItem value="Celular">Celular</MenuItem>
            <MenuItem value="Inversor">Inversor</MenuItem>
            <MenuItem value="Motor">Motor</MenuItem>
            <MenuItem value="Televisor">Televisor</MenuItem>
          </Select>

          <Button
            onClick={() => CustomGetRegistros()}
            variant="contained"
            color="success"
            size="large"
            sx={{ width: "100%", marginBottom: "20px" }}
          >
            Buscar
          </Button>

          <div>
            <Button
              onClick={() => ActualizarRegistros()}
              variant="contained"
              color="error"
              size="large"
              sx={{ width: "100%" }}
            >
              Guardar
            </Button>
          </div>
        </Item>
      </Grid>
      {/* END CONTROLES */}

      <Grid item md={12}>
        <Item
          sx={{
            minHeight: "1000px",
            marginLeft: "250px",
            backgroundColor: "#06502a",
          }}
        >
          <Typography
            gutterBottom
            variant="h3"
            component="div"
            sx={{ color: "#fff" }}
          >
            Ganadores de un {premio}
          </Typography>{" "}
          *
          <Grid container rowSpacing={1} columnSpacing={4}>
            {checkList.length <= 0 ? (
              <p>.</p>
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
