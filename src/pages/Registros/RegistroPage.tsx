import * as React from "react";
import InputMask, {Props} from 'react-input-mask';
import { useForm } from "react-hook-form";
//import Swal from 'sweetalert2'
import Swal from 'sweetalert2/dist/sweetalert2.all.js'
import { Box, styled } from '@mui/material';
import { Button, Card, CardContent, CardHeader, Grid, InputLabel, MenuItem, Select, TextField, TextFieldProps } from "@mui/material";
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
  codigo:"000",
  status:1
}}

let listo = 0;

export const Registro = (props: any) => {
  
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

    if (objeto.cedula.length < 13) {
      return  Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Verifique el numero de cédula',
        showConfirmButton: false,
        timer: 7000
      })
    }

    if (objeto.telefono.length < 14) {
      return  Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Verifique el numero de teléfono',
        showConfirmButton: false,
        timer: 7000
      })
    }

    if (objeto.boleta.length == 0) {
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


    

    Swal.fire({
      title: '¿Están correctos sus datos?',
      html: ` <p> Nombre: <b>${objeto.nombre}</b></p>
              <p> Cédula: <b>${objeto.cedula}</b></p>
              <p> Email: <b>${objeto.email}</b></p>
              <p> Teléfono: <b>${objeto.telefono}</b></p>
              <p> Municipio: <b>${objeto.municipio}</b></p>
              <p> # Boleta: <b>${objeto.boleta}</b></p>
              <p> Responsable: <b>${objeto.responsable}</b></p>`,
      
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Editar datos',
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'

    }).then(async (result) => {
      if (result.isConfirmed) {

        const response = await RegistrosService.crearRegistros(objeto);
        
        if(response.status == 400){
          alert("Cédula o boleta ya existen en nuestra base de datos");
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
      }
      
    })


  } catch (error) {
    console.log(error)
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'EL PRODECESO DE REGISTRO AUN NO HA INICIADO',
      showConfirmButton: false,
      timer: 7000
    })
    
  }
  };

  const [phone, setPhone] = React.useState<string>("");
  const [cedula, setCedula] = React.useState<string>("");
  const [ boleta, setBoleta] = React.useState<string>("");

  return (
    <>
    <Grid container spacing={1} justifyContent="center" alignItems="center" >
      <Grid  item xs={12} md={8}>
      
      <Card sx={{padding:"5%", margin:"5%", minWidth:"100px", maxWidth:"500px"}}>
      <Box component="img" src="/padre-portada.jpg" alt="hola" sx={{ height: "auto", width: "100%", borderRadius:"10px" }} />
      <CardHeader title="FORMULARIO DE REGISTRO" sx={{textAlign: 'center'}}/>
      <CardContent>
      
      {/* <TextField
        sx={{
          "& .MuiOutlinedInput-root": {
            "& > fieldset": {
              border: "none"
            }
          }
        }}
        label="Ingresa"
      /> */}

      <TextField variant="filled" type="text" color='success'  placeholder="Nombre" label="Nombre y apellido" 
      inputProps={{ maxLength: 60 }} required {...register("nombre", {required: true, maxLength: 80})} 
      sx={{minWidth:"100%", margin:"5px 5px 15px 0px" }}/>

      <InputMask
        // alwaysShowMask
        {...props}
        mask="999-9999999-9"
        maskChar=""
        placeholder="000-0000000-0"
        value={cedula}
        required {...register("cedula", {required: true, maxLength: 11})} sx={{minWidth:"100%", margin:"5px 5px 15px 0px" }}
        onChange={(e) => setCedula(e.target.value)}
      >
        {(inputProps: Props & TextFieldProps)=>
        <TextField {...inputProps}
          color="success" type="text" label="Cedula" variant="filled"/>
        }
      </InputMask>
 
      <TextField type="email"  variant="filled" color='success' placeholder="Correo Eléctronico" label="Correo eléctronico"  
      {...register("email", {required: false, pattern: /^\S+@\S+$/i})} sx={{minWidth:"100%", margin:"5px 5px 15px 0px"}}/>
    
      <InputMask
        // alwaysShowMask
        {...props}
        mask="(999) 999-9999"
        maskChar=""
        placeholder="Ej.: (809)000-0000"
        value={phone}
        required {...register("telefono", {required: true, maxLength: 11})} sx={{minWidth:"100%", margin:"5px 5px 15px 0px"}}
        onChange={(e) => setPhone(e.target.value)}
      >
        {(inputProps: Props & TextFieldProps)=>
        <TextField {...inputProps}
        variant="filled" color="success" type="text" label="Teléfono"/>
        }
      </InputMask>
      
      <InputLabel id="demo-multiple-name-label">Municipio / Distrito</InputLabel>
      <Select variant="filled"  {...register("municipio", { required: true })} color='success' sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}>
        <MenuItem value="caleta">Caleta</MenuItem>
        <MenuItem value="cumayasa">Cumayasa</MenuItem>
        <MenuItem value="guaymate">Guaymate</MenuItem>
        <MenuItem value="la-romana">La Romana</MenuItem>
        <MenuItem value="villa-hermosa">Villa Hermosa</MenuItem>
      </Select>
      <TextField type="text" variant="filled" placeholder="Dirección" color='success' label="Dirección"
      {...register("direccion", {required: true, maxLength: 80})} sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}/>

      <InputMask
        // alwaysShowMask
        {...props}
        mask="99999"
        maskChar=""
        placeholder="00000"
        value={boleta}
        required {...register("boleta", {required: true, maxLength: 11})} sx={{minWidth:"100%", margin:"5px 5px 15px 0px" }}
        onChange={(e) => setBoleta(e.target.value)}
      >
        {(inputProps: Props & TextFieldProps)=>
        <TextField {...inputProps}
        variant="filled" color="success" type="text" label="Número de Boleta"/>
        }
      </InputMask>
      
      <InputLabel id="demo-multiple-name-label">Responsable</InputLabel>
      <Select  variant="filled" {...register("responsable", { required: true })} color='success' sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}>
        <MenuItem value="nombre 1">Nombre 1</MenuItem>
        <MenuItem value="nombre 2">Nombre 2</MenuItem>
        <MenuItem value="nombre 3">Nombre 3</MenuItem>
        <MenuItem value="nombre 5">Nombre 4</MenuItem>
        <MenuItem value="nombre 6">Nombre 5</MenuItem>
      </Select>

      <Button variant="contained" color='success' onClick={registerSubmit} 
      sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}}>Registrar</Button>

      </CardContent>
      </Card>
      </Grid>
    </Grid>
    </>

  );
};

//export default Registro;
