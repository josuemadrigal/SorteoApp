import { useDispatch, useSelector } from 'react-redux';
import { http } from '../http-common';
import { onChecking, onLogin, onLogout, clearErrorMessage} from '../store/authSlice';
import { onUpdateEvent, onLoadEvents} from '../store/storeRegistro';
//import  mostrarGanadores  from '../pages/Registros/ConsultaSorteo'

import Swal from "sweetalert2";


export const useAuthStore = () => {

    //const { user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();


    const startRegister = async({ nombre, cedula, email, telefono, municipio, direccion, boleta, status }) => {
        dispatch( onChecking() );
        try {
            const { data } = await http.post('registros/',{ nombre, cedula, email, telefono, municipio, direccion, boleta, status });

            dispatch( onLogin({ nombre: data.name, boleta: data.boleta }) );
    
            Swal.fire("¡Registrado!", "Tu registro ha sido completado", "success");
        } catch (error) {
            dispatch( onLogout( error.response.data?.msg || '--' ) );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const startUpdate = async(event) => {
        dispatch( onChecking() );
        try {
            console.log(event._id)
            await http.put(`registros/`+event._id, event );
                dispatch( onUpdateEvent({  ...event.status }) );
                Swal.fire("¡Actualizado!", "Tu registro ha sido actualizado" , "success");
                 return;
    
            
        } catch (error) {
            //dispatch( onLogout( error.response.data?.msg || '--' ) );
            Swal.fire("ERROR!", "Tu registro ha sido actualizado" +event._id, "error");
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }


    const getRegistros = async(event) => {

        //quiero enviar los parametros de event

        try {
            const { data } = await http.get('registros');
  
            dispatch( onLogin({ name: data.name, uid: data.uid }) );

            const cont = data.registros.length;
            let i = 0

            while (i < cont) {
                console.log(data.registros[i].nombre);
                i++;
            }
           dispatch( onLoadEvents( data ));
            //Swal.fire("Listo!", "Aqui estan los registros" + data.registros[0].nombre , "success");

            

        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
        
    }

  


    return {
        //* Propiedades
        //errorMessage,
  
        //user, 

        //* Métodos
        // checkAuthToken,
        // startLogin,
        // startLogout,
        getRegistros,
        startRegister,
        startUpdate
    }

}