import '../../App.css'
import {motion} from 'framer-motion'


export const Movimiento= () => {


    return (
        <div>
            {/* <motion.h1 transition={{duration: 5}} animate={{
                y: 200, x:200

                
                }}>Hola</motion.h1> */}

           <motion.div  
                className='box'
                initial={{ scale: 1}}
                transition={{ duration: 5}}
                animate={{ 
                    scale: [1, 2, 2, 1, 1, 1], 
                    borderRadius: ["20%", "20%", "50%", "80%", "20%", "5%"], 
                    rotate: [0, 0, 270, 270, 0, 190, 0]}}
            
           ><label>Hola</label></motion.div>

            
        </div>

        

    )
}


