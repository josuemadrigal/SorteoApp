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
        className="bg-pink-100 rounded-md shadow-sm overflow-hidden border border-gray-200 relative min-h-40 items-center justify-center  flex flex-col"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -top-2 -right-2 z-10 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
          <span className="font-bold text-sm">{index + 1}</span>
        </div>
        {/* Contenido compacto */}
        <div className="px-3 py-2 items-center justify-center align-middle content-center">
          <motion.div
            className=" text-center items-center"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg text-center uppercase font-black text-pink-900 line-clamp-3">
              {item.nombre}
            </h3>
          </motion.div>

          {/* Pie pequeño */}
          <motion.div
            className="mt-1  text-center bg-pink-900 px-2 py-1 rounded border border-pink-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-2xl font-black text-pink-100 tracking-tight">
              {codigoVerificacion}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
