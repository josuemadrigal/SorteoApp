import { motion } from 'framer-motion'
import '../App.css'
import { Grid } from "@mui/material"
 import { useState } from 'react'


interface Props {
    item: any
}
export const Boleta = ({ item }: Props) => {
     const [items, setItems] = useState<string[]>(['item1', 'item2', 'item3']);

    return (
        <Grid item md={4}>
            <motion.div
                className='box'
                initial={{ scale: 0, backgroundColor: "#fff"}}
                transition={{ duration: 3 }}
                animate={{
                    backgroundColor: "#2e7d32",
                    scale: [0, 1],
                    borderRadius: ["100%", "10%"],
                    rotate: [100,0],
                    x: [-300, 0, 0]
                }}>

                <motion.h2 initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, rotate: [-1000, 0] }}
                    transition={{ duration: 2 }}>
                    {item.boleta}</motion.h2>


                <motion.h3 initial={{ opacity: 0, scale: 0.1 }}
                    animate={{ opacity: [0, 0, 0, 1], scale: 1, }}
                    transition={{ duration: 5 }}>
                    {item.nombre.toUpperCase()}</motion.h3>

            </motion.div>
        </Grid>
    )
}



