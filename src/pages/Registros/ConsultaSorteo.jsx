import { useEffect } from "react";
import { Button } from "semantic-ui-react";
import { useState } from "react";

import Resultados from "../../components/Resultados";
//import Swal from "sweetalert2";
import { useAuthStore } from "../../hooks/useAuthStore";
//import { useForm } from "../../hooks/useForm";
import "../Registros/RegistroPage.css";
import { useMutation } from "react-query";

export const Consulta = () => {
  // const [data, setData] = useState("");
  // const { startUpdate, getRegistros } = useAuthStore();

  // const {
  //   mutate: getRegistros,
  //   isLoading,
  //   data,
  // } = useMutation < any > RegistrosService;
  // const updateSubmit = (event) => {
  //   event.preventDefault();

  //   startUpdate({
  //     _id: "64598e938b1d49588bad7913",
  //     status: 3,
  //   });
  // };

  // getRegistros({
  //   municipio: "caleta",
  //   status: 1,
  //   limite: 2,
  // });

  function GetSubmit(event) {
    event.preventDefault();

    // getRegistros({});

    // useEffect(() => {
    //   getRegistros();
    // }, []);

    return <h1>I've rendered times!</h1>;
  }

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-12 login-form-2">
          <h3>Registro</h3>

          <form onSubmit={GetSubmit}>
            <input
              type="submit"
              className="btnSubmit"
              value="Obtener registros"
            />
          </form>

          <form>
            <input type="submit" className="btnSubmit" value="Actualizar" />
          </form>
        </div>
      </div>

      {/* <div>
        <Resultados parentToChild={data} />

        <div className="child">
          <Button primary onClick={() => parentToChild()}>
            Click Parent To Child
          </Button>
        </div>
      </div> */}
    </div>
  );
};

//export default Registro;
