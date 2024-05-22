import { motion } from "framer-motion";
import "../App.css";
import { Grid } from "@mui/material";

interface Props {
  item: any;
}
export const Boleta = ({ item }: Props) => {
  return (
    <Grid item sm={12} md={4} lg={4}>
      <motion.div
        className="box"
        initial={{ scale: 0, backgroundColor: "#fff" }}
        transition={{ duration: 5 }}
        animate={{
          backgroundColor: "#469957",
          scale: [0, 1, 0.9, 1],
          borderRadius: ["100%", "1%"],
          border: "20px",
          borderColor: "blue",
          rotate: [100, 0],
          x: [-300, 0, 0],
          overflow: "hidden",
        }}
      >
        <motion.h2
          style={{ fontSize: 55 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [-1000, 0],
            color: "#f0fdf8",
          }}
          transition={{ duration: 2 }}
        >
          {item.nombre}
        </motion.h2>
      </motion.div>
    </Grid>
  );
};

// import { motion } from "framer-motion";
// import "../App.css";
// import { Grid } from "@mui/material";

// interface Props {
//   item: any;
// }

// export const Boleta = ({ item }: Props) => {
//   return (
//     <Grid item sm={12} md={4} lg={4}>
//       <motion.div
//         className="box"
//         initial={{ scale: 0, backgroundColor: "#fff" }}
//         transition={{ duration: 0.5 }}
//         animate={{
//           backgroundColor: "#469957",
//           scale: 1,
//           borderRadius: ["100%", "1%"],
//           border: "20px",
//           borderColor: "blue",
//           rotate: [100, 0],
//           x: [300, 0],
//           overflow: "hidden",
//         }}
//       >
//         <motion.h2
//           style={{ fontSize: 55 }}
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{
//             opacity: 1,
//             scale: 1,
//             rotate: [1000, 0],
//             color: "#f0fdf8",
//           }}
//           transition={{ duration: 0.5 }}
//         >
//           {item.nombre}
//         </motion.h2>
//       </motion.div>
//     </Grid>
//   );
// };
