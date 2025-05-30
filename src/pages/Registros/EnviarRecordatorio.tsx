import RegistrosService from "../../services/RegistrosService";

const EnviarRecordatorio = () => {
  const municipios = [
    { municipio: "La Romana", value: "la-romana" },
    { municipio: "Villa Hermosa", value: "villa-hermosa" },
    { municipio: "Guaymate", value: "guaymate" },
    { municipio: "Cumayasa", value: "cumayasa" },
    { municipio: "Caleta", value: "caleta" },
  ];

  // const navigate = useNavigate();

  const handleClick = (item: { municipio: string; value: string }) => {
    //const parametros = { ...item, municipio: item.municipio };
    RegistrosService.recordatorio(item.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl sm:max-w-2xl md:text-4xl font-bold uppercase text-center mb-8 text-gray-800">
        Seleccione el municipio al que va a enviar el recordatorio
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 w-full max-w-4xl">
        {municipios.map((item) => (
          <div key={item.value} className="flex justify-center gap-">
            <button
              onClick={() => handleClick(item)}
              className="p-0 border-none bg-transparent cursor-pointer focus:outline-none"
            >
              <div className="w-32 h-32 sm:w-44 sm:h-44 flex justify-center items-center bg-green-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-green-600">
                <span className="font-bold text-xl text-white text-center px-2">
                  {item.municipio}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnviarRecordatorio;
