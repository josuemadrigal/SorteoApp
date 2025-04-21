import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BanknotesIcon,
  MapPinIcon,
  TrophyIcon,
  IdentificationIcon,
  ArrowPathIcon,
  EyeIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  SquaresPlusIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  UserCircleIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  ChartBarIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

const Home = () => {
  const navigate = useNavigate();

  const funcionalidades = [
    {
      titulo: "Gestión de Sorteos",
      icono: <BanknotesIcon className="text-blue-500" />,
      elementos: [
        {
          etiqueta: "Registro Generico",
          ruta: "registroG",
          icono: <BanknotesIcon />,
          descripcion: "Crear y gestionar sorteos",
          color: "blue",
          destacado: true,
        },
        {
          etiqueta: "Registro por Municipio",
          ruta: "select",
          icono: <MapPinIcon />,
          descripcion: "Gestionar registros municipales",
          color: "sky",
        },
        {
          etiqueta: "Registro de Premios",
          ruta: "reg-premios",
          icono: <TrophyIcon />,
          descripcion: "Regristrar premios para el sorteo",
          color: "emerald",
          destacado: true,
        },
        {
          etiqueta: "Registro de cédula",
          ruta: "reg-cedula",
          icono: <IdentificationIcon />,
          descripcion: "Registrar cédulas que no aparecen en la base de datos",
          color: "amber",
        },
        {
          etiqueta: "Configuración de Ronda",
          ruta: "reg-ronda",
          icono: <ArrowPathIcon />,
          descripcion: "Configurar rondas del sorteo",
          color: "rose",
        },
      ],
    },
    {
      titulo: "Visualización",
      icono: <EyeIcon className="text-sky-500" />,
      elementos: [
        {
          etiqueta: "Listado de Premios",
          ruta: "viewPremios",
          icono: <TrophyIcon className="text-esmerald-600" />,
          descripcion: "Explorar todos los premios disponibles",
          color: "violet",
        },
        {
          etiqueta: "Lista de Ganadores",
          ruta: "viewGanadores",
          icono: <AcademicCapIcon className="text-esmerald-600" />,
          descripcion: "Ver todos los ganadores del sorteo",
          color: "emerald",
          destacado: true,
        },
        // {
        //   etiqueta: "Pantalla en Vivo",
        //   ruta: "view-Ganadores",
        //   icono: <ComputerDesktopIcon className="text-esmerald-600" />,
        //   descripcion: "Visualización pública de ganadores",
        //   color: "sky",
        // },
        {
          etiqueta: "Validación de Ganadores",
          ruta: "verificar",
          icono: <ShieldCheckIcon className="text-esmerald-600" />,
          descripcion: "Verificar detalles de participantes",
          color: "amber",
        },
      ],
    },
  ];

  const estadisticas = [
    {
      valor: "24",
      etiqueta: "Sorteos Activas",
      icono: <ChartBarIcon />,
      tendencia: "↑ 12%",
      iconColor: "blue", // Added explicit color
    },
    {
      valor: "1,842",
      etiqueta: "Participantes",
      icono: <UsersIcon />,
      tendencia: "↑ 5%",
      iconColor: "sky",
    },
    {
      valor: "58",
      etiqueta: "Premios Disponibles",
      icono: <TrophyIcon />,
      tendencia: "→",
      iconColor: "esmerald",
    },
    {
      valor: "5",
      etiqueta: "Municipios",
      icono: <MapPinIcon />,
      tendencia: "↑ 3%",
      iconColor: "amber",
    },
  ];

  const manejarNavegacion = (ruta: string) => {
    navigate(`/${ruta}`);
  };

  // Animaciones mejoradas
  const animacionTarjeta = {
    oculto: { opacity: 0, y: 30, rotateX: 15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.8, 0.4, 1],
      },
    },
    hover: {
      y: -15,
      rotateX: 5,
      scale: 1.03,
      transition: { duration: 0.3 },
    },
  };

  const animacionEntrada = {
    oculto: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.3, 0.95],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-blue-200 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-200 blur-3xl"></div>
        </div>
      </div>

      {/* Navegación flotante premium */}
      <div className="fixed top-5 right-5 z-50 flex gap-3">
        <motion.button
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200/80 text-gray-700 shadow-lg hover:shadow-xl hover:bg-blue-50 hover:text-blue-500 transition-all"
        >
          <SquaresPlusIcon className="w-5 h-5 mx-auto" />
        </motion.button>
        <motion.button
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200/80 text-gray-700 shadow-lg hover:shadow-xl hover:bg-amber-50 hover:text-amber-500 transition-all relative"
        >
          <BellAlertIcon className="w-5 h-5 mx-auto" />
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </motion.button>
        <motion.button
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200/80 text-gray-700 shadow-lg hover:shadow-xl hover:bg-gray-100 hover:text-gray-800 transition-all"
        >
          <Cog6ToothIcon className="w-5 h-5 mx-auto" />
        </motion.button>
        <motion.button
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all"
        >
          <UserCircleIcon className="w-5 h-5 mx-auto" />
        </motion.button>
      </div>

      <div className="container mx-auto px-5 pt-16 pb-10 max-w-7xl relative z-10">
        {/* Sección Hero con animaciones mejoradas */}
        <motion.div
          initial="oculto"
          animate="visible"
          variants={animacionEntrada}
          className="text-center mb-16"
        >
          <motion.div
            variants={animacionEntrada}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-[800px] h-[800px] bg-gradient-radial from-blue-200/20 via-transparent to-transparent opacity-60 pointer-events-none"
          />

          <motion.div
            variants={animacionEntrada}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center mb-6 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-sm text-sm font-medium text-gray-600"
          >
            <SparklesIcon className="w-4 h-4 mr-2 text-amber-400" />
            Versión 2025
          </motion.div>

          <motion.h1
            variants={animacionEntrada}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-lime-900 via-lime-700 to-lime-600 text-transparent bg-clip-text leading-tight"
          >
            Plataforma de Gestión
            <br />
            de Sorteos{" "}
            <span className="whitespace-nowrap text-lime-600 uppercase italic">
              Eduard
            </span>
          </motion.h1>

          <motion.p
            variants={animacionEntrada}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-8"
          >
            Solución integral para la administración profesional de sorteos,
            premios y validación de ganadores con tecnología de vanguardia.
          </motion.p>

          {/* Estadísticas mejoradas */}
          <motion.div
            variants={animacionEntrada}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {estadisticas.map((estadistica, indice) => (
              <motion.div
                key={estadistica.etiqueta}
                variants={animacionEntrada}
                transition={{ delay: 0.5 + indice * 0.1 }}
                className="p-4 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg bg-${estadistica.iconColor}-100`}
                  >
                    {React.cloneElement(estadistica.icono, {
                      className: `w-5 h-5 text-${estadistica.iconColor}-600`,
                    })}
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      estadistica.tendencia.includes("↑")
                        ? "bg-green-100 text-green-800"
                        : estadistica.tendencia.includes("↓")
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {estadistica.tendencia}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-lime-900">
                  {estadistica.valor}
                </h3>
                <p className="text-sm text-gray-500">{estadistica.etiqueta}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Secciones de Funcionalidades con diseño premium */}
        <AnimatePresence>
          {funcionalidades.map((seccion, indiceSeccion) => (
            <motion.section
              key={seccion.titulo}
              initial="oculto"
              animate="visible"
              variants={animacionEntrada}
              transition={{ delay: 0.6 + indiceSeccion * 0.2 }}
              className="mb-16"
            >
              <motion.div
                variants={animacionEntrada}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br from-lime-600 to-lime-400 border border-lime-200/50 shadow-sm`}
                >
                  {React.cloneElement(seccion.icono, {
                    className: `w-8 h-8 text-lime-50`,
                  })}
                </div>
                <h2
                  className={`text-2xl md:text-3xl font-bold bg-gradient-to-r from-lime-600 to-lime-800 text-transparent bg-clip-text`}
                >
                  {seccion.titulo}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {seccion.elementos.map((elemento, indiceElemento) => (
                  <motion.div
                    key={elemento.ruta}
                    variants={animacionTarjeta}
                    initial="oculto"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: 0.1 * indiceElemento }}
                    onClick={() => manejarNavegacion(elemento.ruta)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group ${
                      elemento.destacado ? "sm:col-span-2" : ""
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-${elemento.color}-500 to-${elemento.color}-600 opacity-5 group-hover:opacity-10 transition-all`}
                    ></div>
                    <div
                      className={`absolute top-0 right-0 w-16 h-16 rounded-bl-2xl bg-${elemento.color}-500/10 backdrop-blur-sm border-l border-b border-${elemento.color}-500/20 flex items-center justify-center`}
                    >
                      {React.cloneElement(elemento.icono, {
                        className: `w-5 h-5 text-${elemento.color}-500`,
                      })}
                    </div>

                    <div className="relative p-6 h-full flex flex-col bg-white/90 backdrop-blur-sm border border-gray-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all">
                      <div
                        className={`w-14 h-14 rounded-lg bg-${elemento.color}-100 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}
                      >
                        {React.cloneElement(elemento.icono, {
                          className: `w-6 h-6 text-${elemento.color}-600`,
                        })}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {elemento.etiqueta}
                      </h3>
                      <p className="text-gray-600 mb-5">
                        {elemento.descripcion}
                      </p>
                      <div className="mt-auto">
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium bg-${elemento.color}-100 text-${elemento.color}-700 hover:bg-${elemento.color}-200 transition-all flex items-center gap-2`}
                        >
                          Acceder
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {/* Sección CTA Premium */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-blue-500 blur-3xl opacity-30"></div>
              <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500 blur-3xl opacity-30"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30"></div>
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center mb-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium text-white">
              <SparklesIcon className="w-4 h-4 mr-2 text-amber-300" />
              ¿Necesite soporte o ayúda?
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Pongase en contacto con soporte técnico
            </h3>
            <p className="text-lg text-gray-300 mb-8">
              Daremos atención lo mas pronto posible a su solicitud. Si tiene
              alguna duda o pregunta, no dude en contactarnos.
            </p>
            {/* <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                (829) 230-3288
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold shadow-sm hover:bg-white/20 hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                Ver demostración
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </motion.button>
            </div> */}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;
