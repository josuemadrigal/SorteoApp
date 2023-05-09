import { createSlice } from '@reduxjs/toolkit';

export const RegistroSlice = createSlice({
    name: 'registro',
    initialState: {
        isLoadingEvents: true,
        events: [
            // tempEvent
        ],
        activeEvent: null
    },
    reducers: {
        onSetActiveEvent: ( state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: ( state, { payload }) => {
            state.events.push( payload );
            state.activeEvent = null;
        },
        onUpdateEvent: ( state, { payload } ) => {
            state.events = state.events.map( registro => {
                // if ( registro.id === payload.id ) {
                //     return payload;
                // }

                return registro;
            });
        },
        onDeleteEvent: ( state ) => {
            if ( state.activeEvent ) {
                state.events = state.events.filter( registro => registro.id !== state.activeEvent.id );
                state.activeEvent = null;
            }
        },
        onLoadEvents: (state, { payload = [] }) => {
            state.isLoadingEvents = false;
            // state.events = payload;
            payload.forEach( registro => {
                const exists = state.events.some( dbEvent => dbEvent.id === registro.id );
                if ( !exists ) {
                    state.events.push( registro )
                }
            })
        }
    }
});


// Action creators are generated for each case reducer function
export const {
    onAddNewEvent,
    onDeleteEvent,
    onLoadEvents,
    onSetActiveEvent,
    onUpdateEvent,
} = RegistroSlice.actions;