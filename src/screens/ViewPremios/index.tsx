import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import registrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";
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
    <div className="flex flex-col p-4">
      {/* Main content */}
      <div className="w-full mx-auto bg-green-800 rounded-lg shadow-lg p-4">
        <div className="flex flex-col items-center w-full min-h-[200px]">
          <h2 className="font-bold uppercase text-2xl my-4 text-white bg-green-600 px-6 py-3 rounded-lg">
            Lista de premios
          </h2>
          <div className="w-full">
            <TablePremios premios={premios} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPremios;
