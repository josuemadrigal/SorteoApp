import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import {SnackbarProvider} from "notistack"

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={4} autoHideDuration={3000}>
      <App />
      </SnackbarProvider>
    </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
