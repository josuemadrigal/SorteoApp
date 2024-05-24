import React, { useEffect, useState } from "react";
import "../../App.css";
import GifTombola from "/gif-padresLow.gif";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import { useMutation } from "react-query";
import "animate.css";
import { Grid, Paper, Typography, styled } from "@mui/material";
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

  const [checkList, setCheckList] = useState<Registro[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [unCheckList, setUnCheckList] = useState<string[]>([]);
  const [premio, setPremio] = useState("");
  const [premioTitle, setPremioTitle] = useState("");
  const [municipioT, setMunicipioT] = useState("");
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
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
      setIsSearchButtonDisabled(true);
      setIsSaveButtonDisabled(true);
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
    setIsSaveButtonDisabled(true);
    setIsSearchButtonDisabled(true);

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

    setCheckList([]);
    setCheckedItems(new Set());
    setUnCheckList([]);
    setIsSearchButtonDisabled(false);
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
        <Item sx={{ height: "850px", width: "220px" }}>
          <img src={GifTombola} alt="TOMBOLA" width="90%" />
          <MunicipioSelect
            value={municipioT}
            onChange={handleMunicipio}
            register={register}
          />

          <CantidadInput register={register} />
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
            disabled={isSearchButtonDisabled}
          />

          <CustomButton
            onClick={ActualizarRegistros}
            icon={<SaveIcon />}
            text="Guardar"
            color="info"
            disabled={isSaveButtonDisabled}
          />
          {/* <CheckList
            checkList={checkList}
            checkedItems={checkedItems}
            handleCheck={handleCheck}
            isChecked={isChecked}
          />
          <p>{`Boletas presentes:  ${Array.from(checkedItems).join(", ")}`}</p>
          <p>{`Boletas ausentes:  ${JSON.stringify(
            checkList
              .filter((item) => !checkedItems.has(item.nombre))
              .map((item) => item.nombre)
          )}`}</p> */}
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
          <Typography
            gutterBottom
            variant="h3"
            component="div"
            sx={{ color: "#fff", backgroundColor: "#ef5061" }}
          >
            Ganadoras de: {premioTitle}
          </Typography>
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
            {filteredCheckList.length <= 0 ? (
              <p>------</p>
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
