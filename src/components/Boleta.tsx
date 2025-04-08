import { motion } from "framer-motion";

interface Props {
  item: any;
}

export const Boleta = ({ item }: Props) => {
  const numCedula = item.cedula;
  const boletaCedula = numCedula.slice(-5);

  return (
    <div className="w-full sm:w-full md:w-1/3 lg:w-1/3 p-2">
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ scale: 0, backgroundColor: "#fff" }}
        transition={{ duration: 5 }}
        animate={{
          backgroundColor: "#469957",
          scale: [0, 1, 0.9, 1],
          borderRadius: ["100%", "0.25rem"],
          borderWidth: "20px",
          borderColor: "blue",
          rotate: [100, 0],
          x: [-300, 0, 0],
        }}
      >
        <motion.h2
          className="text-3xl uppercase text-green-50 p-4 text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [-1000, 0],
          }}
          transition={{ duration: 2 }}
        >
          {item.nombre}
          <div className="text-2xl font-bold bg-green-200 rounded-lg p-2 mt-2 text-green-900">
            {boletaCedula}
          </div>
        </motion.h2>
      </motion.div>
    </div>
  );
};
