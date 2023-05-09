import { useMutation } from 'react-query'
import registrosService from '../../services/RegistrosService'
import { useEffect } from 'react';
import { Card, CardContent, Grid } from '@mui/material';


export const Registros = ()=>{
    
    const { mutate: getRegistros, isLoading, data } = useMutation<any>(registrosService.getRegistros);
useEffect(() => {
    getRegistros();
}, [])

console.log({data})
    return (
        <Grid container>
            <Grid item>
            <Card>
                <CardContent>
                    {isLoading ? <p>Cargando...</p> : 
                    data?.data?.registros.map(datos=> (
                        <p key={datos._id}>{datos.cedula}</p>
                    ))
                }
                </CardContent>

            </Card>
            </Grid>
        </Grid>

    )
}