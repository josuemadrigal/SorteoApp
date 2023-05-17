
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import Box from '@mui/material/Box';
import { Button, Card, CardContent, CardHeader, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Alert, AlertTitle, Link } from "@mui/material";
import RegistrosService from "../../services/RegistrosService";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";




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



export const Pruebas = () => {
  
  //const { formState, setValue, getValues, register} = useForm(modelo);
  const { getValues, register} = useForm(modelo);
 
  const registerSubmit = async (event) => {
    event.preventDefault();
    
   try {
    
  

    const objeto = getValues();

    if (objeto.nombre.length < 3) {
      return  Swal.fire({
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


    if(response.status == 201){

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Registro completado',
        showConfirmButton: false,
        timer: 7000
      })

      window.location.replace('https://www.instagram.com/eduardespiritusanto/');
      
    }
    if(response.status == 500){
      alert("Verifique los campos");
      //console.log("500 "+response.status)
    }


   

  } catch (error) {
    //console.log("Cath "+error)
  }
  };
  
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    error: false,
    message:"",
  });


  const validateEmail = (email) => {

    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

 
  // const validateBoleta = (nombre) =>{
  //   if (condition) {
      
  //   }
  // }

  const handleEmail = (e) => {
    e.preventDefault();
   
    if (nombre.length <3) {
      setError({
        error: true,
        message: "nombre Incorrecto",
      });
      
    } else {
      setError({
        error: false,
        message: "",
      })
      console.log("Email correcto");
    }
    



    if (!validateEmail(email)) {
      setError({
        error: true,
        message: "Incorrecto",
      });
      
    } else {
      setError({
        error: false,
        message: "",
      })
      console.log("Email correcto");
    }

  }

  const handleClick2 = () => {

    enqueueSnackbar("Mensaje", {variant:"success"})

  }

  return (
    <>
    
    
    
    <Grid container spacing={6} columns={10} justifyContent="center" alignItems="center" >

      <Grid  item xs={8} md={8}>
      
      
      
      <h1>Registro</h1>
      <Box component="form" onSubmit={handleEmail}>


      <TextField 
      id="nombre" 
      label="Nombre" 
      type="text" 
      variant="outlined" 
      required
      fullWidth 
      error={error.error}
      helperText={error.message}
      
      value={nombre} 
      onChange={(e) => setNombre(e.target.value)}/>

      <TextField 
      id="email" 
      label="Correo" 
      type="email" 
      variant="outlined" 
      required
      fullWidth 
      error={error.error}
      helperText={error.message}
      
      value={email} 
      onChange={(e) => setEmail(e.target.value)}/>


      <Link href="Hola" target="_blank">
      <Button 
      type="submit"
      variant="outlined"
      sx={{ mt : 2}}> registaaa </Button>
      </Link>


      <Button variant="contained" onClick={() => setOpen(true)}> Abrir </Button>
      <Button variant="contained" onClick={handleClick2}> Abrir2 </Button>


      <Snackbar open={open} autoHideDuration={2000} onClose={ () => setOpen(false)}>
      <Alert severity="success">
        <AlertTitle>Josue</AlertTitle>
        Estamos probando
      </Alert>
    </Snackbar>
    


    
   </Box>   
      </Grid>
    </Grid>
    </>

  );
};

//export default Registro;
