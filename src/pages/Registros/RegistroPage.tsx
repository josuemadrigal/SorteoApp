
import { useForm } from "react-hook-form";
//import Swal from 'sweetalert2'
import Swal from 'sweetalert2/dist/sweetalert2.all.js'
import Box from '@mui/material/Box';
import { Button, Card, CardContent, CardHeader, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import RegistrosService from "../../services/RegistrosService";



const modelo = {defaultValues:{
  
  nombre:"",
  cedula :"",
  email:"",
  telefono:"",
  boleta:"",
  municipio:"la-romana",
  direccion:"",
  responsable:"",
  codigo:"",
  status:1
}}



export const Registro = () => {
  
  //const { formState, setValue, getValues, register} = useForm(modelo);
  const { getValues, register} = useForm(modelo);

 
 
  const registerSubmit = async (event) => {
    event.preventDefault();
    
   try {
    

    const objeto = getValues();

    if (objeto.nombre.length < 3) {
      return   Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Verifique el nombre',
        showConfirmButton: false,
        timer: 7000
      })
    }

    if (objeto.cedula.length < 11) {
      return  Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Verifique el numero de cédula',
        showConfirmButton: false,
        timer: 7000
      })
    }

    if (objeto.telefono.length < 10) {
      return  Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Verifique el numero de teléfono',
        showConfirmButton: false,
        timer: 7000
      })
    }

    if (objeto.boleta.length < 4) {
      return  Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Verifique el numero de boleta',
        showConfirmButton: false,
        timer: 7000
      })
    }

    if (objeto.responsable.length < 1) {
      return  Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Ingrese el responsable',
        showConfirmButton: false,
        timer: 7000
      })
    }
  
    objeto.status = 1;

    const response = await RegistrosService.crearRegistros(objeto);

    console.log("Hola " + response.data);

    if(response.status == 400){
      alert("Cedula o boleta ya existen en nuestra base de datos");
    }
    

    if(response.status == 201){
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Registro completado',
        showConfirmButton: false,
        timer: 7000
      })

      setTimeout(() => {
        window.location.replace('https://www.instagram.com/eduardespiritusanto/');
      }, 2000);
      
    }



   

  } catch (error) {
  
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Verifique los datos',
      showConfirmButton: false,
      timer: 7000
    })
    //console.log("Cath "+error)
  }
  };


  return (
    < >
    
    <Grid container spacing={6} columns={10} justifyContent="center" alignItems="center" >
      <Grid  item xs={8} md={8}>
      
      <Card sx={{padding:"5%", margin:"5%", minWidth:"100px", maxWidth:"500px"}}>
      <Box component="img" src="/foto-eduard.jpg" alt="hola" sx={{ height: "auto", width: "100%", borderRadius:"10px" }} />
      <CardHeader title="Registro" sx={{alignContent:"center"}}/>
      <CardContent>
      

      <TextField type="text" color='success'  placeholder="Nombre" label="Nombre" inputProps={{ maxLength: 60 }} required {...register("nombre", {required: true, maxLength: 80})} sx={{minWidth:"100%", margin:"5px 5px 15px 0px" }}/>
      <TextField type="text" color='success' placeholder="Cédula" label="Cédula" inputProps={{maxLength: 11 }} required {...register("cedula", {required: true, maxLength: 10})} sx={{minWidth:"100%", margin:"5px 5px 15px 0px" }}/>
      <TextField type="email" color='success' placeholder="Correo Eléctronico"  label="Correo eléctronico"  {...register("email", {required: false, pattern: /^\S+@\S+$/i})} sx={{minWidth:"100%", margin:"5px 5px 15px 0px"}}/>
      <TextField type="tel" color='success' placeholder="Teléfono" label="Teléfono" inputProps={{ maxLength: 10 }} required {...register("telefono", {required: true, minLength: 10,  maxLength: 11})} sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}/>
      <InputLabel id="demo-multiple-name-label">Municipio / Distrito</InputLabel>
      
      <Select   {...register("municipio", { required: true })} color='success' sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}>


        <MenuItem value="la-romana">La Romana</MenuItem>
        <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
        <MenuItem value="caleta">Caleta</MenuItem>
        <MenuItem value="guaymate">Guaymate</MenuItem>
        <MenuItem value="Cumayasa">Cumayasa</MenuItem>
      </Select>
      <TextField type="text" placeholder="Dirección" color='success' label="Dirección"{...register("direccion", {required: true, maxLength: 80})} sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}/>
      <TextField type="text" placeholder="Boleta" color='success' label="No. Boleto" inputProps={{ maxLength: 7 }} required {...register("boleta", {required: true, maxLength:8})} sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}/>
      <TextField type="text" placeholder="Responsable" color='success' label="Responsable" inputProps={{ maxLength: 60 }}  {...register("responsable", {required: true, maxLength:8})} sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}/>
      {/* <TextField type="password" placeholder="codigo" color='success' label="Codigo" inputProps={{ maxLength: 6 }}  {...register("codigo", {required: true, maxLength:8})} sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}/> */}


      <Button variant="contained" color='success' onClick={registerSubmit} sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}>Registrar</Button>
      </CardContent>
      </Card>
      </Grid>
    </Grid>
    </>

  );
};

//export default Registro;
