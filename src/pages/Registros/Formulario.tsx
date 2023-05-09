import { useMutation } from 'react-query'
import registrosService from '../../services/RegistrosService';
import  setForm from '../../components/form'
import { useEffect } from 'react';
import { Card, CardContent, Grid } from '@mui/material';


export const Registros = ()=>{


//    const {mutate: crearForm, isLoading, data } = useMutation<any>(setForm.crearForm);
    
    const { mutate: getRegistros, isLoading, data } = useMutation<any>(registrosService.getRegistros);
    useEffect(() => {
        getRegistros();
        // crearForm();
    }, [])


    return (
        <Grid container>
            <Grid item>
            <Card>
                <CardContent>
    
                    {isLoading ? <p>Cargando...</p> : 
                    data?.form?.registros.map(datos=> (
                        <p key={datos._id}>{datos.nombre}</p>
                    ))
                }
                </CardContent>

            </Card>
            </Grid>
        </Grid>

    )
}