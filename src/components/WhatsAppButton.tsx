import React, { useState, useEffect } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./WhatsAppButton.css";

const WhatsAppButton = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el elemento ancla del menú
  const phoneNumber = "18092846378";
  const message = "Hola, necesito ayuda para registrarme en el sorteo.";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget); // Abrir el menú en la posición del clic
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Cerrar el menú al seleccionar una opción
  };

  const handleContact = (phoneNumber) => {
    handleCloseMenu(); // Cerrar el menú al seleccionar una opción
    handleWhatsAppRedirect(phoneNumber); // Redirigir automáticamente al hacer clic en una opción
  };

  const handleWhatsAppRedirect = (phoneNumber) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
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
              <button
                onClick={() => setShowMessage(false)}
                className="close-button"
              >
                <CloseIcon style={{ height: "1rem", width: "1rem" }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="whatsapp-button-container">
        <motion.button
          onClick={handleOpenMenu}
          className="whatsapp-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-controls="whatsapp-menu"
          aria-haspopup="true"
        >
          <WhatsAppIcon style={{ height: "2rem", width: "2rem" }} />
        </motion.button>
        <Menu
          id="whatsapp-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              marginTop: "0.5rem",
            },
          }}
        >
          <MenuItem onClick={() => handleContact("18298074136")}>
            Opción 1
          </MenuItem>
          <MenuItem onClick={() => handleContact("18096721235")}>
            Opción 2
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default WhatsAppButton;
