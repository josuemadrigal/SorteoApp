import {   useState } from "react";
import '../../App.css';

import GifTombola from "../../../public/tombolaEduarde.gif";


// import Lottie, {LottieRefCurrentProps} from 'lottie-react';
// import animationData from '../../assets/65849-emos-spin.json'

import {motion} from 'framer-motion';
import { useMutation } from "react-query";
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';

import 'animate.css';

import {  Button, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography, styled } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';


import registrosService from "../../services/RegistrosService";
import { useForm } from "react-hook-form";


import RegistrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";
// import { Boleta } from "../../components/Boleta";
import { RenderBoletas } from "../../components/RenderBoletas";

const modelo = {defaultValues:{
  municipio:"",
  premio:"",
  status :1,
  cantidad:0
}}


export const Consulta = () => {

  const { getValues, register} = useForm(modelo);

  // const spinRef = useRef<LottieRefCurrentProps>(null);
  
  const [checked, setChecked] = useState<any[]>([]);
  const [checkList, setCheckList] = useState<any[]>([]);
  // const [checkListShow, setCheckListShow] = useState<any[]>([]);

  // const [unCheckList, setUnCheckList] = useState<any[]>([]);
  // const [boletas, setBoletas] = useState<any[]>([]);
  const [premio, setPremio] = useState('');


  const handlePremio = (event: SelectChangeEvent) => {
    setPremio(event.target.value);
    console.log(premio);
  };

 
  
  const {
    mutate: getRegistros,
    // isLoading,
    data,
  } = useMutation<any>( async (param:any)=> await registrosService.getRegistros(param.status,param.municipio, param.cantidad));

const CustomGetRegistros = async()=>{

  setCheckList([]);
  setChecked([]);
  // setUnCheckList([]);

  
  const param:any = getValues();

  if (param.cantidad <=0 ) {
    return  Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'La cantidad no puede ser 0',
      showConfirmButton: false,
      timer: 7000
    })
  }

  if (param.cantidad > 0 && param.municipio != "") {

  const dataa:any = await registrosService.getRegistros(param.status,param.municipio, param.cantidad);
  await getRegistros(param);

  
    const a = dataa?.data?.registros?.map(m => { return m });
  // const b = data?.data?.registros.map((datos) => { return datos.cedula});
  


  
  
  setCheckList(a);
  setChecked(a);
    
  } else {
    return  Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Seleccione el municipio',
      showConfirmButton: false,
      timer: 7000
    })
  }
}

// Add/Remove checked item from list
// const handleCheck = (event):any => {
//   let updatedList:any = [...checked];
//   if (event.target.checked) {
//     updatedList = [...checked, event.target.value];
//   } else {
//     updatedList.splice(checked.indexOf(event.target.value), 1);
//   }
//   setChecked(updatedList);
//   EvaluarCheced(updatedList);
// };

// const EvaluarCheced = (checkeditemsss)=>{
//   const elementsChecked = checkeditemsss;

//   let unCheckedElemets:any = [];

//   for (let index = 0; index < checkList.length; index++) {

//     const element = checkList[index];

//     const a = elementsChecked.map(m=>m.trim()).includes(element.trim());
//     if(!a){
//      unCheckedElemets = [...unCheckedElemets,element.trim()];
//     }
//   }
//   // setUnCheckList(unCheckedElemets);
// }
const ActualizarRegistros = ()=>{
  
  //Seleccionado
  for (let index = 0; index < checkList.length; index++) {
    const element = checkList[index];
    RegistrosService.startUpdate(element.boleta,2, premio);
  }
  //No seleccionado
  // for (let index = 0; index < unCheckList.length; index++) {
  //   const element = unCheckList[index];
  //   RegistrosService.startUpdate(element,0,"No presente");
  // }
  setCheckList([]);
  setChecked([]);
  // setUnCheckList([]);
}
// Obteniendo los checks
  // const checkedItems = checked.length
  //   ? checked.reduce((total, item) => {
  //       return total + ", " + item.boleta;
  //     })
  //   : "";
  console.log({ checked })
// Return classes based on whether item is checked
  // const isChecked:any = (item:any) =>
  // checked.includes(item) ? "checked-item" : "not-checked-item";

  const Item = styled(Paper)(({ theme }) => ({
  
    padding: theme.spacing(1),
    textAlign: 'center',

  }));

  // const style = {
  //   height: 300,
  // };




  // const delay = (ms: number) => {
  //   return new Promise<void>((resolve) => setTimeout(resolve, ms));
  // };
  return (
    <Grid container my={4} rowSpacing={2} columnSpacing={1}>
      <Grid item md={2} sm={10} >
      <Item sx={{minHeight:'100%'}}>
          
        <Typography gutterBottom variant="h5" component="div">
          Buscar 
        </Typography>
        <InputLabel>Municipio / Distrito</InputLabel>
        <Select {...register("municipio", {required: true, maxLength: 10}) } color='success'  sx={{minWidth:"40%", width:"100%", margin:"5px 5px 15px 0px" }} >
            <MenuItem value="la-romana">La Romana</MenuItem>
            <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
            <MenuItem value="caleta">Caleta</MenuItem>
            <MenuItem value="guaymate">Guaymate</MenuItem>
            <MenuItem value="Cumayasa">Cumayasa</MenuItem>
          </Select>
          <TextField type="number" placeholder="Cantidad" label="cantidad" color='success'  {...register("cantidad", {required: true, maxLength: 10}) } sx={{minWidth:"20%", width:"100%", margin:"5px 5px 15px 0px" }}/>
          
          <Select value={premio} color='success'   onChange={handlePremio}
                  
                  sx={{minWidth:"40%", width:"100%", margin:"5px 5px 15px 0px" }} >

            <MenuItem value="plancha">PLANCHA</MenuItem>
            <MenuItem value="licuadora">LICUADORA</MenuItem>
            <MenuItem value="nevera">NEVERA</MenuItem>
            <MenuItem value="estufa">ESTUFA</MenuItem>
          </Select>
          
          <Button onClick={()=>CustomGetRegistros()} 
                  variant="contained" 
                  color='success' 
                  size="large" 
                  endIcon={<SearchIcon />} 
                  sx={{width:"100%"}}>
                    Buscar</Button>

          <motion.div animate={{ opacity: 1, scale: 1, x: [-150, 0] }}
                          transition={{ duration: 2 }}>

            <img src={`/premios/${premio}.png`} width={"80%"}></img>


            </motion.div>

              {/* <div className="checkList">
                <div className="title">Listado De Boletas:</div>
                  <div className="list-container">
                    {checkList && checkList.map((item, index) => (
                      <div key={index}>
                        
                        <input value={item} type="checkbox" onChange={handleCheck} />
                        <span className={isChecked(item.boleta)}>{item.boleta}</span>
                      </div>
                    ))}
                </div>
              </div> */}

              <div>
            {/* <p>{`Boletas presentes:  ${checkedItems}`}</p> */}
                {/* <p>{`Boletas ausentes:  ${JSON.stringify( unCheckList)}`}</p> */}
                
                <Button onClick={()=>ActualizarRegistros()} 
                        variant="contained" 
                        color='error'
                        size="large"
                        endIcon={<SaveIcon />}
                        sx={{width:"100%"}}>
                          Guardar
                  </Button>
              </div>
       </Item>
      </Grid>
       {/* END CONTROLES */}

       {/* START  Column 2 */}
      <Grid item md={3}>
        <Item sx={{minHeight:'100%'}}>
        <Grid container rowSpacing={5} columnSpacing={1} >
                      
          <Grid item md={12}>
              {/* <Lottie onComplete={() => {
                spinRef.current?.goToAndPlay(45, true)
              }} lottieRef={spinRef} loop={false} style={style} animationData={animationData}/> */}

              {/* <ReactPlayer  

                playing
                url="/tombola.mp4"
                
                loop
                
                width="640"
                height="360"
              /> */}

              <img src={GifTombola} alt="TOMBOLA" width="90%"  />


          </Grid>

          {/* <Grid item md={12}>
                <Box component="img" src="/foto-eduard2.jpg" alt="hola" sx={{ height: "auto", width: "90%", borderRadius:"10px" }} />
          </Grid> */}

        </Grid>
        </Item>
      </Grid>

      {/* END  Column 2 */}



      <Grid item md={7} >
      <Item sx={{minHeight:'100%'}}>
      <Typography gutterBottom variant="h5" component="div">
            GANADORAS 
          </Typography>

        <Grid container rowSpacing={1} columnSpacing={4} >

            {checkList.length <= 0 ? (
              <p>.</p>
            ) : (
              <RenderBoletas items={checkList} />
            )}
          
        </Grid>
      </Item>
      </Grid>
    </Grid>
  );
};

//export default Registro;