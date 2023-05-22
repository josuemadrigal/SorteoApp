import { useState } from "react";
import '../../App.css'

import {motion} from 'framer-motion'
import { useMutation } from "react-query";
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';

import 'animate.css';



import { Button, Card, CardContent, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography, styled } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';


import registrosService from "../../services/RegistrosService";
import { useForm } from "react-hook-form";


import RegistrosService from "../../services/RegistrosService";
import Swal from "sweetalert2";
const modelo = {defaultValues:{
  municipio:"la-romana",
  status :1,
  cantidad:0
}}
export const Consulta = () => {

  
  const { getValues, register} = useForm(modelo);
  

  //const checkes = ["Apple", "Banana", "Tea", "Coffee"];
  const [checked, setChecked] = useState<any[]>([]);
  const [checkList, setCheckList] = useState<any[]>([]);
  const [unCheckList, setUnCheckList] = useState<any[]>([]);
  const [premio, setPremio] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setPremio(event.target.value);
    console.log(premio);
  };
  
  const {
    mutate: getRegistros,
    isLoading,
    data,
  } = useMutation<any>( async (param:any)=> await registrosService.getRegistros(param.status,param.municipio, param.cantidad));

const CustomGetRegistros = async()=>{

  setCheckList([]);
  setChecked([]);
  setUnCheckList([]);

  
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
  //console.log({dataa})


  const a = dataa?.data?.registros?.map(m=> { return m.boleta});
  
  
  setCheckList(a);
    
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
const handleCheck = (event):any => {
  let updatedList:any = [...checked];
  if (event.target.checked) {
    updatedList = [...checked, event.target.value];
  } else {
    updatedList.splice(checked.indexOf(event.target.value), 1);
  }
  setChecked(updatedList);
  EvaluarCheced(updatedList);
};
const EvaluarCheced = (checkeditemsss)=>{
  const elementsChecked = checkeditemsss;
  let unCheckedElemets:any = [];
  for (let index = 0; index < checkList.length; index++) {
    const element = checkList[index];
    const a = elementsChecked.map(m=>m.trim()).includes(element.trim());
    if(!a){
     unCheckedElemets = [...unCheckedElemets,element.trim()];
    }
  }
  setUnCheckList(unCheckedElemets);
}
const ActualizarRegistros = ()=>{
  
  //Seleccionado
  for (let index = 0; index < checked.length; index++) {
    const element = checked[index];
    RegistrosService.startUpdate(element,2, premio);
  }
  //No seleccionado
  for (let index = 0; index < unCheckList.length; index++) {
    const element = unCheckList[index];
    RegistrosService.startUpdate(element,0,"No presente");
  }
  setCheckList([]);
  setChecked([]);
  setUnCheckList([]);
}
// Obteniendo los checks
const checkedItems = checked.length
  ? checked.reduce((total, item) => {
      return total + ", " + item;
    })
  : "";

// Return classes based on whether item is checked
  const isChecked:any = (item:any) =>
  checked.includes(item) ? "checked-item" : "not-checked-item";



  const Item = styled(Paper)(({ theme }) => ({
  
    padding: theme.spacing(1),
    textAlign: 'center',

  }));



  return (
    <Grid container my={4} rowSpacing={2} columnSpacing={1}>
      <Grid item md={3} sm={12} >
      <Card >
        <CardContent >
          
        <Typography gutterBottom variant="h5" component="div">
          Buscar 
        </Typography>
        <InputLabel>Municipio / Distrito</InputLabel>
        <Select {...register("municipio", { required: true })} sx={{minWidth:"40%", width:"100%", margin:"5px 5px 15px 0px" }} >
            <MenuItem value="la-romana">La Romana</MenuItem>
            <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
            <MenuItem value="caleta">Caleta</MenuItem>
            <MenuItem value="guaymate">Guaymate</MenuItem>
            <MenuItem value="Cumayasa">Cumayasa</MenuItem>
          </Select>
          <TextField type="number" placeholder="Cantidad" label="cantidad" {...register("cantidad", {required: true, maxLength: 10}) } sx={{minWidth:"20%", width:"100%", margin:"5px 5px 15px 0px" }}/>
          
          <Select value={premio}  onChange={handleChange}
                  
                  sx={{minWidth:"40%", width:"100%", margin:"5px 5px 15px 0px" }} >

            <MenuItem value="plancha">PLANCHA</MenuItem>
            <MenuItem value="licuadora">LICUADORA</MenuItem>
            <MenuItem value="nevera">NEVERA</MenuItem>
            <MenuItem value="estufa">ESTUFA</MenuItem>
          </Select>
          
          <Button onClick={()=>CustomGetRegistros()} variant="contained" color='success' size="large" endIcon={<SearchIcon />} sx={{width:"90%", margin:"10px"}}>Obtener Registros</Button>
          
          

          
          

        </CardContent>
        </Card>
        <Grid container rowSpacing={40} >
          <Grid item >
            <motion.div animate={{ opacity: 1, scale: 1, x: [-900, 400, -100, 90, 0, 0] }}
                          transition={{ duration: 6 }}>

            <img src={`src/assets/premios/${premio}.png`} width={"100%"}></img>


            </motion.div>

              <div className="checkList">
                <div className="title">Listado De Boletas:</div>
                  <div className="list-container">
                    {checkList && checkList.map((item, index) => (
                      <div key={index}>
                        <input value={item} type="checkbox" onChange={handleCheck} />
                        <span className={isChecked(item)}>{item}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <p>{`Boletas presentes:  ${checkedItems}`}</p>
                <p>{`Boletas ausentes:  ${JSON.stringify( unCheckList)}`}</p>
                <Button onClick={()=>ActualizarRegistros()} variant="contained" color='info' endIcon={<SaveIcon />}>Actualizar Registros</Button>
              </div>
              </Grid>
              </Grid>
      </Grid>
      
      
      
      
      
      <Grid item md={9} >
      <Item sx={{minHeight:'100%'}}>
      {/* <Typography gutterBottom variant="h5" component="div">
          Ganadores
        </Typography> */}
        <Grid container rowSpacing={1} columnSpacing={1} >
       

            {isLoading ? (
                <p>Cargando...</p>
                ) : (
                data?.data?.registros.map((datos) => (

                <Grid item md={3}>
                <motion.div  
                className='box'
                initial={{ scale: 1}}
                transition={{ duration: 5}}
                custom={5}
                animate={{ 
                    scale: [1, 2, 2, 1, 1, 1], 
                    borderRadius: ["20%", "20%", "50%", "80%", "20%", "50%"], 
                    rotate: [0, 0, 270, 0,-270, -190, 0],
                    x: [-900, 400, -100, 90, 0, 0]
                    
                    }}>
                      

                      <motion.h2 initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1, rotate: [600, -400, 870, 0,-870, 990, 0] }}
                          transition={{ duration: 6 }}>
                          {datos.boleta}</motion.h2>

                      <motion.h3 initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0,0,0,0,0,0,1], scale: 1,}}
                          transition={{ duration: 7 }}>
                            {datos.cedula}</motion.h3>
                      
                      <motion.h3 initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: [0,0,0,0,0,0,1], scale: 1,}}
                          transition={{ duration: 7 }}>
                            {datos.nombre}</motion.h3>

                      {/* <motion.h3 initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1, rotate: [600, -400, 870, 0,-870, 990, 0] }}
                          transition={{ duration: 6 }}
                          >{datos.municipio}</motion.h3> */}

                  </motion.div>
                  </Grid>
                ))
            )}    
          

        </Grid>
      </Item>
      </Grid>
    </Grid>
  );
};

//export default Registro;