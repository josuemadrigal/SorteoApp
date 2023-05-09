import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { http } from '../http-common';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store/storeRegistro';


export const useRegistroStore = () => {
  
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.name || {});
    const { user } = useSelector( state => state.name || {});

    const setActiveEvent = ( registroEvent ) => {
        dispatch( onSetActiveEvent( registroEvent ) )
    }

    const startSavingEvent = async( registroEvent ) => {
        
        try {
            if( registroEvent.id ) {
                // Actualizando
                await http.put(`/${ registroEvent.id }`, registroEvent );
                dispatch( onUpdateEvent({ ...registroEvent, user }) );
                return;
            } 
    
            // Creando
            const { data } = await http.post('registros/');
            dispatch( onAddNewEvent({ ...registroEvent, id: data.evento.id, user }) );

        } catch (error) {
            console.log(error);
            Swal.fire('Ha ocurrido un error, vuelve a intentar', error.response.data.msg, 'error');
        }
 
    }

    const startDeletingEvent = async() => {
        // Todo: Llegar al backend
        try {
            await http.delete(`/${ activeEvent.id }` );
            dispatch( onDeleteEvent() );
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');
        }

    }


 


    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //* Métodos
        setActiveEvent,
        startDeletingEvent,
        startSavingEvent,
    }
}
