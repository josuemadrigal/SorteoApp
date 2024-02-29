import { Route, Routes } from "react-router-dom";
//import  Registros  from '../pages/Registros/Formulario'
import { Registro } from "../pages/Registros/RegistroPage";
import { Consulta } from "../pages/Registros/ConsultaSorteo";
import { View } from "../pages/Registros/View";
import SelectMunicio from "../pages/Registros/SelectMunicio";

export const AppRouter = (): any => {
  return (
    <Routes>
      <Route path="/" element={<SelectMunicio />} />
      <Route path="/registro" element={<SelectMunicio />} />
      <Route path="/registro/:id" element={<Registro />} />
      <Route path="/consulta" element={<Consulta />} />
      <Route path="/view" element={<View />} />
    </Routes>
  );
};
