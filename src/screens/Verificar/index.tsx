import React, { useEffect, useState } from "react";
import "../../App.css";
import { useMutation } from "react-query";
import "animate.css";
import {
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
} from "@mui/material";
import { useForm } from "react-hook-form";
import registrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";

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

const Verificar = () => {
  const { getValues, register } = useForm<FormValues>({
    defaultValues: {
      municipio: "",
      premio: "",
      status: 1,
      cantidad: 4,
      ronda: "1",
    },
  });

  const [checkList, setCheckList] = useState<Registro[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const [premio, setPremio] = useState("");

  const [ronda, setRonda] = useState("");

  const [premios, setPremios] = useState<
    { slug_premio: string; premio: string }[]
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

    if (param.cantidad <= 0) {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "La cantidad no puede ser 0",
        showConfirmButton: false,
        timer: 7000,
      });
    }

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

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setCheckedItems((prev) => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(value);
      } else {
        updated.delete(value);
      }
      return updated;
    });
  };

  const isChecked = (cedula: string) => {
    return checkedItems.has(cedula);
  };

  const ActualizarRegistros = async () => {
    for (const element of checkList) {
      const status = checkedItems.has(element.cedula) ? 3 : 0;
      const premioText = checkedItems.has(element.cedula)
        ? premio
        : "No presente";
      await registrosService.startUpdate(
        String(element.cedula),
        status,
        premioText,
        "1"
      );
    }
  };

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
        <Item sx={{ minHeight: "850px", width: "320px" }}>
          <InputLabel sx={{ marginTop: "20px", width: "100%" }}>
            Ronda #
          </InputLabel>
          <Select sx={{ width: "100%" }}>
            <MenuItem>hola</MenuItem>
          </Select>
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
              flex: 1,
              width: "100%",
              minHeight: "200px",
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "calc(95vh - 64px)",
            }}
          ></Grid>
        </Item>
      </Grid>
    </Grid>
  );
};

export default Verificar;
