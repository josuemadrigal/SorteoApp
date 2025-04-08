import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import registrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";
import TableRondas from "./components/TableRondas";

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

const ViewRondas = () => {
  // const { getValues, register } = useForm<FormValues>({
  //   defaultValues: {
  //     municipio: "",
  //     premio: "",
  //     status: 1,
  //     cantidad: 4,
  //     ronda: "1",
  //   },
  // });
  const [ronda, setRonda] = useState("");
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

  return (
    <div className="min-h-screen bg-green-800 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold uppercase text-white bg-green-600 py-3 px-4 rounded-lg mb-6 text-center">
              Lista de premios
            </h2>
            <TableRondas premios={premios} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRondas;
