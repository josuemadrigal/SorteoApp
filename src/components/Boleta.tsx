import { motion } from 'framer-motion'
import '../App.css'
import { Grid } from "@mui/material"



export const Boleta = (props) => {

    const tiempo = props.boleta;

    //console.log("Hola " + tiempo)
    console.log(props.boleta)

    const count = + 3;
    

    return (
        <Grid item md={4}>

            

                <motion.div  
                className='box'
                initial={{ scale: 0}}
                transition={{ duration: 3}}
                custom={5}
                animate={{ 
                    scale: [0, 1, 2, 1, 1, 1], 
                    borderRadius: "10%", 
                    rotate: [200000, 0],
                    x: [-300, 90, 0, 0]
                    
                    }}>   
                    
                      <motion.h2 initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1, rotate: [1910000, 0] }}
                          transition={{ type: "Inertia", duration: 5 }}>
                          {props.boleta}
                      </motion.h2>

                      <motion.h3 initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0,0,0,0,0,0,1], scale: 1,}}
                          transition={{ duration: 7 }}>
                            {props.boleta}
                      </motion.h3>

                  </motion.div>
                  </Grid>
    )
}