import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

const WhatsAppButton = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const telefonoNumber = "18293088432";

  const message = "Hola, necesito ayuda para registrarme en el sorteo.";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
      // Iniciar animación de pulso después de mostrar el mensaje
      setIsPulsing(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => {
    //setIsMenuOpen(!isMenuOpen);
    // Detener el pulso cuando se abre el menú
    handleWhatsAppRedirect(telefonoNumber);
    setShowMessage(false);
    setIsPulsing(false);
  };

  const handleContact = (telefonoNumber) => {
    setIsMenuOpen(false);
    handleWhatsAppRedirect(telefonoNumber);
  };

  const handleWhatsAppRedirect = (telefonoNumber) => {
    const whatsappUrl = `https://wa.me/${telefonoNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-24 right-6 bg-white shadow-lg rounded-lg p-3 max-w-xs z-50"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium mr-2">
                🌟 ¿Necesitas ayuda para registrarte? ¡Escríbenos! 📲
              </p>
              <button
                onClick={() => setShowMessage(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdCloseCircle className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-6 right-6 z-50">
        {/* Pulso alrededor del botón */}
        <AnimatePresence>
          {isPulsing && (
            <motion.div
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{
                scale: 1.5,
                opacity: 0,
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                },
              }}
              className="absolute inset-0 bg-green-500 rounded-full"
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleMenu}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: isPulsing ? [0, -5, 0] : 0,
            transition: isPulsing
              ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {},
          }}
        >
          <IoLogoWhatsapp className="h-8 w-8" />
          {/* Notificación animada */}
          {isPulsing && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                },
              }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              !
            </motion.span>
          )}
        </motion.button>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-16 right-0 bg-white shadow-md rounded-md overflow-hidden w-48"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContact("18298074136")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            >
              <IoLogoWhatsapp className="mr-2 text-green-500" />
              Opción 1
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleContact("18096721235")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            >
              <IoLogoWhatsapp className="mr-2 text-green-500" />
              Opción 2
            </motion.button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default WhatsAppButton;
