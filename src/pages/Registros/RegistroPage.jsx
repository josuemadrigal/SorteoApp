//import { useEffect } from "react";
import Swal from "sweetalert2";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useForm } from "../../hooks/useForm";
import "../Registros/RegistroPage.css";

const registerFormFields = {
  registerNombre: "",
  registerCedula: "",
  registerEmail: "",
  registerTelefono: "",
  registerMunicipio: "",
  registerDireccion: "",
  registerBoleta: "",
};

export const Registro = () => {
  const { startRegister, startUpdate, getRegistros } = useAuthStore();

  const {
    registerNombre,
    registerCedula,
    registerEmail,
    registerTelefono,
    registerMunicipio,
    registerDireccion,
    registerBoleta,
    onInputChange: onRegisterInputChange,
  } = useForm(registerFormFields);

  const registerSubmit = (event) => {
    event.preventDefault();
    if (registerNombre == "Alex") {
      Swal.fire("Error en registro", "Contraseñas no son iguales", "error");
      return;
    }
    if (registerMunicipio == "Seleccione el municipio") {
      Swal.fire("Error en registro", "Debe seleccionar el municipio", "error");
      return;
    }

    startRegister({
      nombre: registerNombre,
      cedula: registerCedula,
      email: registerEmail,
      telefono: registerTelefono,
      municipio: registerMunicipio,
      direccion: registerDireccion,
      boleta: registerBoleta,
      status: 1,
    });
  };

  //   useEffect(() => {
  //     if (errorMessage !== undefined) {
  //       Swal.fire("Error en la autenticación", errorMessage, "error");
  //     }
  //   }, [errorMessage]);

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-8 login-form-2">
          <h3>Registro</h3>

          <form onSubmit={registerSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                name="registerNombre"
                value={registerNombre}
                onChange={onRegisterInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Cedula"
                name="registerCedula"
                value={registerCedula}
                onChange={onRegisterInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Correo electronico"
                name="registerEmail"
                value={registerEmail}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Telefono"
                name="registerTelefono"
                value={registerTelefono}
                onChange={onRegisterInputChange}
              />
            </div>

            <select
              className="form-control"
              name="registerMunicipio"
              value={registerMunicipio}
              onChange={onRegisterInputChange}
            >
              <option value="la-romana">Seleccione el municipio</option>
              <option value="la-romana">La Romana</option>
              <option value="villa-hermosa">Villa Hermosa</option>
              <option value="caleta">Caleta</option>
              <option value="guaymate">Guaymate</option>
              <option value="guaymate">Cumayasa</option>
            </select>

            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Dirección"
                name="registerDireccion"
                value={registerDireccion}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="# Boleta"
                name="registerBoleta"
                value={registerBoleta}
                onChange={onRegisterInputChange}
              />
            </div>

            <div className="d-grid gap-2">
              <input type="submit" className="btnSubmit" value="Registrarse" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

//export default Registro;
