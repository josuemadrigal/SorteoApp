import React, { useEffect, useState } from "react";
import GifTombola from "../../../public/gif-TOMBOLA.gif";
import { SearchIcon, SaveIcon } from "@heroicons/react/solid";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import registrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";
import { RenderBoletas } from "../../components/RenderBoletas";
import PremioSelect from "./components/PremioSelect";
import MunicipioSelect from "./components/MunicipioSelect";
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
  const [premio, setPremio] = useState("Motor");
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
  }, [premio, municipioT]);

  const handleMunicipio = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMunicipioT(event.target.value);
    setPremioTitle("Motor");
    setPremio("motor");
    setIsSearchButtonDisabled(false);
    setIsSaveButtonDisabled(true);
  };

  const handlePremio = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPremioValue = event.target.value;
    const selectedPremio = premios.find(
      (item) => item.slug_premio === selectedPremioValue
    );
    if (selectedPremio) {
      setPremioTitle(selectedPremio.premio);
      setPremio(selectedPremioValue);
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
    } catch (error) {
      console.error("Error fetching premios", error);
    }
  };

  const buscarRegistros = async () => {
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

    if (param.municipio !== "" && param.premio !== "") {
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

  const filteredCheckList = checkList.filter((item) =>
    checkedItems.has(item.cedula)
  );

  return (
    <div className="flex flex-col md:flex-row p-2 gap-2">
      {/* Sidebar */}
      <div className="w-full md:w-56 h-[94vh] bg-white shadow-md rounded-lg p-4 fixed md:relative">
        <img src={GifTombola} alt="TOMBOLA" className="w-[90%] mx-auto" />

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
          disabled
        />

        <CustomButton
          onClick={buscarRegistros}
          icon="search"
          text="Buscar"
          color="success"
          disabled={isSearchButtonDisabled}
        />

        <CustomButton
          onClick={ActualizarRegistros}
          icon="save"
          text="Guardar"
          color="error"
          disabled={isSaveButtonDisabled}
        />
      </div>

      {/* Main Content */}
      <div className="md:ml-60 w-full md:w-[calc(100%-14rem)] h-[100vh] bg-green-800 rounded-lg p-4">
        <div className="w-full bg-blue-800 min-h-[50px] py-2 px-0 rounded-t-lg">
          <div className="text-white text-center uppercase text-xl md:text-3xl">
            {cantiRonda
              ? `${cantiRonda} ${
                  parseInt(cantiRonda) > 1 ? "ganadores de:" : "ganador de:"
                } `
              : ""}
            <span className="font-bold text-2xl md:text-4xl">
              {cantiRonda ? premioTitle : ""}
            </span>
          </div>
        </div>

        <div className="flex justify-center w-full min-h-[200px] overflow-y-auto max-h-[calc(95vh-64px)] bg-green-800 rounded-b-lg">
          {filteredCheckList.length <= 0 && isSearchButtonDisabled ? (
            <p className="opacity-50 uppercase tracking-wider mt-40 text-gray-300">
              Presiona el botón buscar
            </p>
          ) : (
            <RenderBoletas items={filteredCheckList} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Consulta;
