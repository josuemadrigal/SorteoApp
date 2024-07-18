import React, { useState, useEffect } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import "./WhatsAppButton.css";

const WhatsAppButton: React.FC = () => {
  const [showMessage, setShowMessage] = useState(false);
  const phoneNumber = "18298074136";
  const message = "Hola, necesito ayuda para registrarme en sorteo.";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMessage(false);
  };

  return (
    <>
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="message-box"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "sans-serif",
                fontWeight: "500",
              }}
            >
              <p style={{ fontSize: "0.875rem", marginRight: "1rem" }}>
                🌟 ¿Necesitas ayuda para registrarte? ¡Escríbenos! 📲
              </p>
              <button onClick={handleClose} className="close-button">
                <CloseIcon style={{ height: "1rem", width: "1rem" }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseOver={() => setShowMessage(false)}
        onMouseOut={() => setShowMessage(true)}
      >
        <WhatsAppIcon style={{ height: "2rem", width: "2rem" }} />
      </motion.a>
    </>
  );
};

export default WhatsAppButton;
