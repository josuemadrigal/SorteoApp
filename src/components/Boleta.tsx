import { motion } from "framer-motion";

interface Props {
  item: any;
}

export const Boleta = ({ item }: Props) => {
  const numCedula = item.cedula;
  const primerosDigitos = numCedula.slice(0, 3);
  const ultimosDigitos = numCedula.slice(-4);
  const codigoVerificacion = `${primerosDigitos}...${ultimosDigitos}`;

  return (
    <div className="w-full p-1 items-center justify-center ">
      <motion.div
        className="bg-pink-100 rounded-md shadow-sm overflow-hidden border border-gray-200 relative min-h-40 items-center justify-center align-middle"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Contenido compacto */}
        <div className="px-3 py-2 items-center justify-center align-middle ">
          <motion.div
            className="flex text-center items-center"
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
            className="mt-1  text-center bg-blue-50 px-2 py-1 rounded border border-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-lg font-black text-pink-400 tracking-tight">
              {codigoVerificacion}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
