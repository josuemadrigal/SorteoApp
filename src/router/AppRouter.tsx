import { Route, Routes } from "react-router-dom";
//import  Registros  from '../pages/Registros/Formulario'
import Registro from "../pages/Registros/RegistroPage";

import { View } from "../pages/Registros/View";
import SelectMunicio from "../pages/Registros/SelectMunicio";
import { RegistroPremios } from "../pages/Registros/RegistroPremios";
import { RegistroCedula } from "../pages/Registros/RegistroCedula";
import Consulta from "../screens/Consulta";
import Verificar from "../screens/Verificar";
import Home from "../pages/Registros/casa";
import RegistroGeneral from "../pages/Registros/RegistroPageGeneral";
import ViewPremios from "../screens/ViewPremios";
import ViewGanadores from "../screens/ViewGanadores";
import { RegistroRonda } from "../pages/Registros/RegistroRonda";
import ViewGanadoresBoleta from "../screens/ViewGanadoresBoleta";
import HomePadres from "../pages/Registros/padres";
import RegistroPadres from "../pages/Registros/RegistroPagePadres";
import ViewRegistros from "../screens/ViewRegistros";
import Codigo from "../screens/Codigo";
import ViewRondas from "../screens/ViewRondas";

export const AppRouter = (): any => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/registroG" element={<RegistroPadres />} />
      <Route path="/select" element={<SelectMunicio />} />
      <Route path="/registro/:id" element={<Registro />} />
      <Route path="/consulta" element={<Consulta />} />
      <Route path="/reg-ronda" element={<RegistroRonda />} />
      <Route path="/viewRondas" element={<ViewRondas />} />

      {/* <Route path="/" element={<RegistroPadres />} />
      
      
      <Route path="/reg-premios" element={<RegistroPremios />} />
      <Route path="/reg-cedula" element={<RegistroCedula />} />
      

      <Route path="/registro/:id" element={<Registro />} />
  
      <Route path="/verificar" element={<Verificar />} />
      <Route path="/viewPremios" element={<ViewPremios />} />
      <Route path="/viewGanadores" element={<ViewGanadores />} />
      <Route path="/view-Ganadores" element={<ViewGanadoresBoleta />} />
      <Route path="/viewRondas" element={<ViewPremios />} />
      <Route path="/registrados" element={<Codigo />} />
      <Route path="/view" element={<View />} /> */}
    </Routes>
  );
};
