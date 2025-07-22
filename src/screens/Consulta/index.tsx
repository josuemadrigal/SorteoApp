import React, { useEffect, useState } from "react";
// import GifTombola from "../../../public/gif-TOMBOLA.gif";
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
  telefono: string;
}

interface GetRegistrosResponse {
  registros: Registro[];
}

const Consulta = () => {
  const { getValues, register } = useForm<FormValues>({
    defaultValues: {
      municipio: "",
      premio: "",
      status: 2,
      cantidad: 4,
      ronda: "1",
    },
  });
  const [ronda, setRonda] = useState("1");
  const [guardado, setGuardado] = useState(true);
  const [rondaId, setRondaId] = useState(0);
  const [checkList, setCheckList] = useState<Registro[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [unCheckList, setUnCheckList] = useState<string[]>([]);
  const [premio, setPremio] = useState("-");
  const [premioSlug, setPremioSlug] = useState("-");
  const [premioTitle, setPremioTitle] = useState("");
  const [municipioT, setMunicipioT] = useState("");
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [premios, setPremios] = useState<
    { slug_premio: string; premio: string }[]
  >([]);
  const [cantiRonda, setCantiRonda] = useState("");

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReload = () => {
    window.location.reload();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Entrar en pantalla completa
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error al intentar pantalla completa: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      // Salir de pantalla completa
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Escuchar cambios en el estado de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isFullscreen]);

  // Puedes agregar esto en tu archivo de componentes
  const FullscreenButton = ({
    isFullscreen,
    onClick,
  }: {
    isFullscreen: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
      title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
    >
      {isFullscreen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      )}
    </button>
  );

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
    setPremioTitle(premio);
    setPremio(premio);
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
      setPremioSlug(selectedPremio.slug_premio);
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
      console.log("Response", response);
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
        autoActualizarRegistros(registros);
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

    if (param.municipio === "NADA") return;
    param.municipio = municipioT;
    param.ronda = ronda;
    param.premio = premio;
    param.cantidad = cantiRonda ? parseInt(cantiRonda) : 0;

    if (param.cantidad <= 0) {
      setGuardado(true);
      return Swal.fire({
        position: "center",
        icon: "error",
        title: `Al parecer no hay mas rondas para ${premio.toUpperCase()} en ${municipioT.toUpperCase()}`,
        showConfirmButton: false,
        timer: 5000,
      });
    }

    if (param.municipio !== "" && param.premio !== "") {
      setGuardado(false);
      setIsSearchButtonDisabled(false);
      setIsSaveButtonDisabled(true);
      getRegistros(param);
    } else {
      setGuardado(true);
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

    // console.log("Del boton guardar");
    // console.log(checkList);
    // for (const element of checkList) {
    //   const status = checkedItems.has(element.cedula) ? 3 : 0;
    //   const premioText = checkedItems.has(element.cedula)
    //     ? premio
    //     : "No presente";

    //   await registrosService.startUpdate(
    //     String(element.cedula),
    //     status,
    //     premioText,
    //     ronda,
    //     premioSlug,
    //     String(element.telefono),
    //     String(element.nombre),
    //     municipioT
    //   );
    // }

    // await registrosService.updateRonda(
    //   rondaId,
    //   "no activa",
    //   municipioT,
    //   ronda,
    //   premio
    // );
    setCantiRonda("");
    setRonda("1");
    setPremio("");
    setCheckList([]);
    setCheckedItems(new Set());
    setUnCheckList([]);
    setIsSearchButtonDisabled(true);
    setGuardado(true);
  };

  const autoActualizarRegistros = async (registros: Registro[]) => {
    console.log("GUARDANDO ----");
    console.log(registros);
    if (registros.length > 0) {
      for (const element of registros) {
        const status = 3;
        const premioText = premio;

        await registrosService.startUpdate(
          String(element.cedula),
          status,
          premioText,
          ronda,
          premioSlug,
          String(element.telefono),
          String(element.nombre),
          municipioT
        );
      }

      await registrosService.updateRonda(
        rondaId,
        "no activa",
        municipioT,
        ronda,
        premio
      );
    }
  };

  const filteredCheckList = checkList.filter((item) =>
    checkedItems.has(item.cedula)
  );

  const rondaTexto = ronda && ronda !== "1" ? `(Ronda #${ronda})` : "";

  return (
    <div className="flex flex-col md:flex-row p-2 bg-emerald-900 min-h-screen max-h-screen overflow-hidden">
      {/* Sidebar */}
      <FullscreenButton
        isFullscreen={isFullscreen}
        onClick={toggleFullscreen}
      />
      <div className="w-16 md:w-56 sm:h-[94vh] bg-white shadow-md rounded-lg p-4  md:relative overflow-hidden sticky">
        <img src="/gif-TOMBOLA.gif" alt="TOMBOLA" className="w-[90%] mx-auto" />

        {guardado && (
          <div>
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
            />
          </div>
        )}

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
          text="Continuar"
          color="warning"
          disabled={isSaveButtonDisabled}
        />

        {/* <h2
          className="bg-sky-100 mt-10 text-sky-400 hover:bg-sky-800 cursor-pointer text-center text-sm p-3 rounded-md "
          onClick={handleReload}
        >
          Cancelar
        </h2> */}
      </div>

      {/* Main Content */}
      <div className="md:ml-5 w-80 md:w-[calc(100%-10rem)] min-h-full  bg-green-800 rounded-lg p-4 overflow-hidden sticky pb-20">
        <div className="w-full bg-blue-600 min-h-[50px] py-2 px-0 rounded-t-lg">
          <div className="text-white text-center uppercase text-xl md:text-3xl flex flex-row items-center justify-center">
            {cantiRonda
              ? `${cantiRonda} ${
                  parseInt(cantiRonda) > 1 ? "ganadores de: " : "ganador de: "
                } `
              : ""}
            <span className="font-bold text-2xl md:text-4xl ml-5">
              {cantiRonda ? premioTitle : ""}
            </span>
            <span className="font-bold text-2xl md:text-xl ml-5">
              {rondaTexto}
            </span>
          </div>
        </div>

        <div className="flex justify-center w-full    bg-green-800 rounded-b-lg max-h-[100%]  overflow-y-scroll pb-60">
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
