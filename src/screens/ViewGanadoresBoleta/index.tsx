import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import registrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";
import { RenderBoletas } from "../../components/RenderBoletas";
import MunicipioSelect from "../Consulta/components/MunicipioSelect";
import CustomButton from "../Consulta/components/CustomButton";
import PremioSelect from "../Consulta/components/PremioSelect";

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

const ViewGanadoresBoleta: React.FC = () => {
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

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Sidebar filters */}
      <div className="w-full md:w-56 fixed md:relative bg-white p-4 rounded-lg shadow-md h-auto md:h-[40vh]">
        <MunicipioSelect
          value={municipioT}
          onChange={handleMunicipio}
          register={register}
        />

        <div className="flex items-center mt-5">
          <label className="w-2/5 text-sm font-medium text-gray-700">
            RONDA #
          </label>
          <select
            value={ronda}
            onChange={handleRondaChange}
            className="w-3/5 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="" disabled>
              Seleccione la ronda
            </option>
            {[...Array(20).keys()].map((n) => (
              <option key={n + 1} value={n + 1}>
                {n + 1}
              </option>
            ))}
          </select>
        </div>

        <PremioSelect
          value={premio}
          onChange={handlePremio}
          premios={premios}
        />

        <CustomButton
          onClick={CustomGetRegistros}
          icon={"search"}
          text="Buscar"
          color="success"
        />
      </div>

      {/* Main content */}
      <div className="ml-0 md:ml-64 w-full md:w-[calc(100%-16rem)] bg-green-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col items-center w-full min-h-[200px]">
          <h2 className="font-bold uppercase text-xl md:text-2xl my-4 text-white bg-green-600 px-4 py-2 rounded-lg">
            Lista de ganadores
          </h2>
          <RenderBoletas items={ganadores} />
        </div>
      </div>
    </div>
  );
};

export default ViewGanadoresBoleta;
