import { useNavigate } from "react-router-dom";

const SelectMunicio = () => {
  const municipios = [
    { municipio: "La Romana", value: "la-romana" },
    { municipio: "Villa Hermosa", value: "villa-hermosa" },
    { municipio: "Guaymate", value: "guaymate" },
    { municipio: "Cumayasa", value: "cumayasa" },
    { municipio: "Caleta", value: "caleta" },
  ];

  const navigate = useNavigate();

  const handleClick = (item: { municipio: string; value: string }) => {
    const parametros = { ...item, municipio: item.municipio };
    navigate(`/registro/${item.value}`, { state: { parametros } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl md:text-4xl font-bold uppercase text-center mb-8 text-gray-800">
        Seleccione el municipio que va registrar
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5   w-full max-w-4xl">
        {municipios.map((item) => (
          <div key={item.value} className="flex justify-center">
            <button
              onClick={() => handleClick(item)}
              className="p-0 border-none bg-transparent cursor-pointer focus:outline-none"
            >
              <div className="w-44 h-44 flex justify-center items-center bg-green-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-green-600">
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

export default SelectMunicio;
