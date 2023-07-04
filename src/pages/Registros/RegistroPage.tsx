import * as React from "react";
import InputMask, {Props} from 'react-input-mask';
import { useForm } from "react-hook-form";
//import Swal from 'sweetalert2'
import Swal from 'sweetalert2/dist/sweetalert2.all.js'
import { Theme, useTheme } from '@mui/material/styles';
import { Box, Button, Card, CardContent, CardHeader, Grid, InputLabel, MenuItem, TextField, TextFieldProps } from "@mui/material";
//import FormControl from '@mui/material/FormControl';


import Select, { SelectChangeEvent } from '@mui/material/Select';
import RegistrosService from "../../services/RegistrosService";
import { useState } from "react";

const modelo = {defaultValues:{
  
  nombre:"",
  cedula :"",
  email:"",
  telefono:"",
  boleta:1,
  municipio:"la-romana",
  direccion:"",
  responsable:"",
  codigo:"000",
  status:1
}}

const ITEM_HEIGHT = 75;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};




const names = [

  'AMADO MERCEDES (NENO)',
  'CELESTE MEDINA',
  'DANIEL ENCARNACION',
  'DANIEL FLORENTINO',
  'DAVID ROSARIO MUÑOZ',
  'DRA. SONIA GARCIA',
  'ENRIQUE ANTONIO PAYANO',
  'FRANCIS LAPPOST',
  'HECTOR JULIO MARTINEZ',
  'JESUS SANTANA',
  'JOSE ARIARDY UBIERA',
  'JUAN ANTONIO BAEZ',
  'JUAN RUFINO RODRIGUEZ',
  'JUNIOR ORTIZ',
  'KARY DEL RIO',
  'MANUEL MODESTO ROSARIO POLLARD',
  'MARIA MERCEDES',
  'MIGUEL ALEJANDRO PEGUERO RAMIREZ',
  'PEDRO HIDALGO',
  'SANTA SABA ESPINAL',
  'SARITIN MARTINEZ (PASTORA SHARY)',
  'YEISON CARRASCO MORALES',
  'YISEL MARIA GALVEZ',
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}



export const Registro = (props: any) => {

  // const [responsableData, setResponsableData] = useState<any[]>([]);

  // const respon =async () => {
  //   const responsables = await RegistrosService.getResponsables();
  //   console.log(responsables.data);
  //   return setResponsableData(responsables.data);
    
  // }

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

    if (objeto.boleta <= 0) {
      return  Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Verifique el numero de boleta',
        showConfirmButton: false,
        timer: 7000
      })
    }

    if (objeto.boleta.toString().length < 5) {
      return  Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El numero de boleta debe tener 5 digitos, ejemplo: 00001, 00012, 00123, 01234',
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

    // Romana 20 000          = 1       -> 20,000 (final 35000)
    // Villa hermosa 15 000   = 35,001  -> 50,000 (final 60 000)
    // Cumayasa 2000          = 60,001  -> 62,000 (final 67 000)
    // Guaymate 3000          = 67,001  -> 70,000 (final 75 000)
    // Caleta 2000            = 75,001  -> 77,000 (final 80 000)
   
    

    if (objeto.municipio == 'la-romana' ) {
      if (objeto.boleta < 1 || objeto.boleta > 20000 ) {
        return Swal.fire({
          position: 'center',
          icon: 'warning',
          title: `La boleta '${objeto.boleta}' no pertenece a La Romana`,
          showConfirmButton: false,
          timer: 7000
        })
      }
    }

    
    
    if (objeto.municipio == 'villa-hermosa' ) {
      if (objeto.boleta < 35001 || objeto.boleta > 50000 ) {
        return Swal.fire({
          position: 'center',
          icon: 'warning',
          title: `La boleta '${objeto.boleta}' no pertenece a Villa Hermosa`,
          showConfirmButton: false,
          timer: 7000
        })
      }
    }

    if (objeto.municipio == 'cumayasa' ) {
      if (objeto.boleta < 60001 || objeto.boleta > 62000 ) {
        return Swal.fire({
          position: 'center',
          icon: 'warning',
          title: `La boleta '${objeto.boleta}' no pertenece a Cumayasa`,
          showConfirmButton: false,
          timer: 7000
        })
      }
    }

    if (objeto.municipio == 'caleta' ) {
      if (objeto.boleta < 67001 || objeto.boleta > 70000 ) {
        return Swal.fire({
          position: 'center',
          icon: 'warning',
          title: `La boleta '${objeto.boleta}' no pertenece a Caleta`,
          showConfirmButton: false,
          timer: 7000
        })
      }
    }

    if (objeto.municipio == 'guaymate' ) {
      if (objeto.boleta < 75001 || objeto.boleta > 77000 ) {
        return Swal.fire({
          position: 'center',
          icon: 'warning',
          title: `La boleta '${objeto.boleta}' no pertenece a Guaymate`,
          showConfirmButton: false,
          timer: 7000
        })
      }
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
        
          if(response.status == 203 ){
             Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'La cédula o boleta que ingresaste han sido registrada anteriormente',
              showConfirmButton: false,
              timer: 7000
            })
          }
          
          if(response.status == 201){
             Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Registro completado',
              showConfirmButton: false,
              timer: 7000
            })

            
      
            return setTimeout(() => {
              window.location.replace('https://www.instagram.com/eduardespiritusanto/');
            }, 2000);
            
          }

          if(response.status == 203){
            Swal.fire({
             position: 'center',
             icon: 'error',
             title: 'La cédula o boleta que ingresaste han sido registrada anteriormente',
             showConfirmButton: false,
             timer: 7000
           })
         }
      
       
        
      }
      
    })


    

  } catch (error) {
    console.log(error)
    return Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Cédula o boleta registrada',
      showConfirmButton: false,
      timer: 9000
    })
    
  }
  };

  const [phone, setPhone] = React.useState<string>("");
  const [cedula, setCedula] = React.useState<string>("");
  const [ boleta, setBoleta] = React.useState<string>("");


  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);



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
          color="success" type="text" label="Cédula" variant="filled"/>
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
        variant="filled" color="success" type="text" label="Número de boleta"/>
        }
      </InputMask>
      
      <InputLabel id="demo-multiple-name-label">Responsable</InputLabel>
      <Select variant="filled"  {...register("responsable", { required: true })} color='success' sx={{minWidth:"100%" , margin:"5px 5px 15px 0px"}} MenuProps={MenuProps}>
      
      
      
      {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
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
