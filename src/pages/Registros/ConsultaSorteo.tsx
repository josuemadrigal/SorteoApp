import { useState } from "react";
import '../../App.css'
import { useMutation } from "react-query";
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import 'animate.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Button, Card, CardContent, CardHeader,  Chip, Grid, MenuItem, Select, TextField } from "@mui/material";

import registrosService from "../../services/RegistrosService";
import { useForm } from "react-hook-form";


import RegistrosService from "../../services/RegistrosService";
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

  // function GetSubmit(event) {
  //   event.preventDefault();

  //   return <h1>I've rendered times!</h1>;
  // }
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
  const dataa:any = await registrosService.getRegistros(param.status,param.municipio, param.cantidad);
  await getRegistros(param);
  //console.log({dataa})
  const a = dataa?.data?.registros?.map(m=> { return m.boleta});
  //console.log({a})
  
  setCheckList(a);
  
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
    RegistrosService.startUpdate(element,2);
  }
  //No seleccionado
  for (let index = 0; index < unCheckList.length; index++) {
    const element = unCheckList[index];
    RegistrosService.startUpdate(element,0);
  }
  setCheckList([]);
  setChecked([]);
  setUnCheckList([]);
}
// Generate string of checked items
const checkedItems = checked.length
  ? checked.reduce((total, item) => {
      return total + ", " + item;
    })
  : "";

// Return classes based on whether item is checked
  const isChecked:any = (item:any) =>
  checked.includes(item) ? "checked-item" : "not-checked-item";

  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
 

  return (
    <>
    <Box>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 8, md: 10 }}>
    
    {/* Controlador search ================================================*/}
    <Grid item md={12} lg={12} sm={2}>
      <Card  sx={{padding:"50px", marginTop:"10px"}}>
        <CardHeader title="Buscar"/>
        <Select {...register("municipio", { required: true })} sx={{minWidth:"40%", width:"100%", margin:"5px 5px 15px 0px" }} >
            <MenuItem value="la-romana">La Romana</MenuItem>
            <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
            <MenuItem value="caleta">Caleta</MenuItem>
            <MenuItem value="guaymate">Guaymate</MenuItem>
          </Select>
          <TextField type="number" placeholder="Cantidad" label="cantidad" {...register("cantidad", {required: true, maxLength: 10}) } sx={{minWidth:"20%", width:"100%", margin:"5px 5px 15px 0px" }}/>
          
          <Select sx={{minWidth:"40%", width:"100%", margin:"5px 5px 15px 0px" }} >
            <MenuItem value="PLANCHA">PLANCHA</MenuItem>
            <MenuItem value="LICUADORA">LICUADORA</MenuItem>
            <MenuItem value="NEVERA">NEVERA</MenuItem>
            <MenuItem value="ESTUFA">ESTUFA</MenuItem>
          </Select>
          <Button onClick={()=>CustomGetRegistros()} variant="contained" color='success' size="large" endIcon={<SearchIcon />} sx={{margin:"10px"}}>Obtener Registros</Button>
        

        {/* Gestion de ganadores ======================================*/}
     <Grid container spacing={8} columns={10}  justifyContent="center" alignItems="center" maxWidth="90%" marginTop="20px">
        <Grid item md={12} lg={12} sm={12}>
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
          <p>{`Numeros Seleccionados:  ${checkedItems}`}</p>
          <p>{`Numeros NO Seleccionados:  ${JSON.stringify( unCheckList)}`}</p>
          </div>
          <Button onClick={()=>ActualizarRegistros()} variant="contained" color='info' endIcon={<SaveIcon />}>Actualizar Registros</Button>
        </Grid>
    </Grid>
    </Card>
    </Grid>

      {/* Caja Resultados ================================================*/}

      <Grid item spacing={3}  md={3} lg={2} sm={2}>
          <Card  sx={{padding:"50px", marginTop:"10px", minWidth:"500"}}>
            <CardHeader title="Listado de Numeros"/>
            <CardContent>
              {isLoading ? (
                <p>Cargando...</p>
              ) : (
                data?.data?.registros.map((datos) => (
                    <Chip  key={datos._id} label={datos.boleta} 
                    sx={{fontSize:"2rem", backgroundColor:"#388e3c", 
                    color:"white", margin:"5px", padding:"20%", borderRadius:"100px"}} />
                  
                    
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
</Stack>
<TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    
</Box>
      


    </>
  );
};

//export default Registro;