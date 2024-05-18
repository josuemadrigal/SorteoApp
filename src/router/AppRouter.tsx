import { Route, Routes } from "react-router-dom";
//import  Registros  from '../pages/Registros/Formulario'
import { Registro } from "../pages/Registros/RegistroPage";
import { Consulta } from "../pages/Registros/ConsultaSorteo";
import { View } from "../pages/Registros/View";
import SelectMunicio from "../pages/Registros/SelectMunicio";
import { RegistroPremios } from "../pages/Registros/RegistroPremios";
import { ViewPremios } from "../pages/Registros/ViewPremios";

export const AppRouter = (): any => {
  return (
    <Routes>
      <Route path="/" element={<SelectMunicio />} />
      <Route path="/registro" element={<SelectMunicio />} />
      <Route path="/reg-premios" element={<RegistroPremios />} />
      <Route path="/view-premios" element={<ViewPremios />} />
      <Route path="/registro/:id" element={<Registro />} />
      <Route path="/consulta" element={<Consulta />} />
      <Route path="/view" element={<View />} />
    </Routes>
  );
};
