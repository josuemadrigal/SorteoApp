import { motion } from "framer-motion";

interface Props {
  item: any;
  index: number; // Añadimos prop para el número de índice
}

export const Boleta = ({ item, index }: Props) => {
  const numCedula = item.cedula;
  const primerosDigitos = numCedula.slice(0, 3);
  const ultimosDigitos = numCedula.slice(-4);
  const codigoVerificacion = `${primerosDigitos} ... ${ultimosDigitos}`;

  return (
    <div className="w-full p-1 items-center justify-center">
      <motion.div
        className="bg-blue-100 rounded-md max-w-xl shadow-sm overflow-hidden border border-gray-200 relative min-h-40 items-center justify-center  flex flex-col"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* <div className="absolute -top-2 -right-2 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
          <span className="font-bold text-sm">{index + 1}</span>
        </div> */}
        {/* Contenido compacto */}
        <div className="px-3 py-2 items-center justify-center align-middle content-center">
          <motion.div
            className=" text-center items-center"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-5xl text-center uppercase font-black text-blue-900 line-clamp-3">
              {item.nombre}
            </h3>
          </motion.div>

          {/* Pie pequeño */}
          <motion.div
            className="mt-1  text-center bg-blue-900 px-2 py-1 rounded border border-blue-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-4xl font-black text-gray-50 tracking-widest">
              {codigoVerificacion}
            </p>
          </motion.div>
          <p className="text-xs">
            Esto solo es para pruebas-{" "}
            <span className="text-red-600">{item.municipio} </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
