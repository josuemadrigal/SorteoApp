import { useState } from "react";
import ViewRegistros from "./ViewRegistros";

const Codigo = () => {
  const [showView, setShowView] = useState(false);
  const [codigo, setCodigo] = useState("");
  const codigoCorrecto = "es2025";

  const handleCodigoSubmit = () => {
    if (codigo === codigoCorrecto) {
      setShowView(true);
    } else {
      alert("Código incorrecto. Inténtelo de nuevo.");
    }
  };

  const handleCodigoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodigo(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCodigoSubmit();
    }
  };

  return (
    <div>
      {!showView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Ingrese un código para continuar
              </h2>
              <p className="text-gray-600 mb-4">
                Ingrese el código para acceder a la vista de registros:
              </p>
              <input
                autoFocus
                type="password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                placeholder="Código"
                value={codigo}
                onChange={handleCodigoChange}
                onKeyPress={handleKeyPress}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleCodigoSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showView && <ViewRegistros />}
    </div>
  );
};

export default Codigo;
