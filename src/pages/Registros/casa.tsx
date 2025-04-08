import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
  Avatar,
  styled,
  alpha,
  Button,
  Stack,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Casino,
  LocationCity,
  EmojiEvents,
  Badge,
  Autorenew,
  Visibility,
  MilitaryTech,
  Tv,
  VerifiedUser,
  Dashboard,
  Settings,
  Notifications,
  AccountCircle,
} from "@mui/icons-material";

// Componente de tarjeta estilizada en 3D personalizado
const Tarjeta3D = styled(Paper)(({ theme }) => ({
  position: "relative",
  borderRadius: "24px",
  overflow: "hidden",
  transformStyle: "preserve-3d",
  transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  boxShadow: `0 25px 50px -12px ${alpha(theme.palette.primary.main, 0.25)}`,
  "&:hover": {
    transform: "translateY(-10px) rotateX(5deg)",
    boxShadow: `0 35px 60px -10px ${alpha(theme.palette.primary.main, 0.4)}`,
    "&::before": {
      opacity: 1,
    },
    "& .contenido-tarjeta": {
      transform: "translateZ(20px)",
    },
    "& .icono-tarjeta": {
      transform: "translateZ(30px) scale(1.1)",
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.2
    )} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
    opacity: 0,
    transition: "opacity 0.5s ease",
    zIndex: 1,
  },
}));

// Componente de barra de navegación flotante
const NavegacionFlotante = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 20,
  right: 20,
  zIndex: 1000,
  display: "flex",
  gap: 8,
  "& .MuiButton-root": {
    minWidth: 40,
    height: 40,
    borderRadius: "12px",
    padding: 0,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: "blur(10px)",
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[2],
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
    },
  },
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const funcionalidades = [
    {
      titulo: "Gestión de Lotería",
      icono: <Casino color="primary" sx={{ fontSize: 40 }} />,
      elementos: [
        {
          etiqueta: "Nueva Lotería",
          ruta: "registroG",
          icono: <Casino sx={{ fontSize: 30 }} />,
          descripcion: "Crear y gestionar sorteos de lotería",
          color: theme.palette.primary.main,
        },
        {
          etiqueta: "Datos Municipales",
          ruta: "registro",
          icono: <LocationCity sx={{ fontSize: 30 }} />,
          descripcion: "Gestionar registros municipales",
          color: theme.palette.info.main,
        },
        {
          etiqueta: "Centro de Premios",
          ruta: "reg-premios",
          icono: <EmojiEvents sx={{ fontSize: 30 }} />,
          descripcion: "Configurar asignaciones de premios",
          color: theme.palette.success.main,
        },
        {
          etiqueta: "Verificación de ID",
          ruta: "reg-cedula",
          icono: <Badge sx={{ fontSize: 30 }} />,
          descripcion: "Verificar identidades de participantes",
          color: theme.palette.warning.main,
        },
        {
          etiqueta: "Configuración de Ronda",
          ruta: "reg-ronda",
          icono: <Autorenew sx={{ fontSize: 30 }} />,
          descripcion: "Configurar rondas de lotería",
          color: theme.palette.error.main,
        },
      ],
    },
    {
      titulo: "Visualización",
      icono: <Visibility color="secondary" sx={{ fontSize: 40 }} />,
      elementos: [
        {
          etiqueta: "Galería de Premios",
          ruta: "viewPremios",
          icono: <EmojiEvents sx={{ fontSize: 30 }} />,
          descripcion: "Explorar todos los premios disponibles",
          color: theme.palette.secondary.main,
        },
        {
          etiqueta: "Salón de Ganadores",
          ruta: "viewGanadores",
          icono: <MilitaryTech sx={{ fontSize: 30 }} />,
          descripcion: "Ver todos los ganadores de la lotería",
          color: theme.palette.success.main,
        },
        {
          etiqueta: "Pantalla en Vivo",
          ruta: "view-Ganadores",
          icono: <Tv sx={{ fontSize: 30 }} />,
          descripcion: "Visualización pública de ganadores",
          color: theme.palette.info.main,
        },
        {
          etiqueta: "Validación",
          ruta: "verificar",
          icono: <VerifiedUser sx={{ fontSize: 30 }} />,
          descripcion: "Verificar detalles de participantes",
          color: theme.palette.warning.main,
        },
      ],
    },
  ];

  const estadisticas = [
    { valor: "24", etiqueta: "Loterías Activas" },
    { valor: "1,842", etiqueta: "Participantes" },
    { valor: "58", etiqueta: "Premios Disponibles" },
    { valor: "12", etiqueta: "Municipios" },
  ];

  const manejarNavegacion = (ruta: string) => {
    navigate(`/${ruta}`);
  };

  // Animación de tarjeta 3D
  const animacionTarjeta = {
    oculto: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Box
      sx={{
        background: `radial-gradient(circle at top right, ${alpha(
          theme.palette.primary.light,
          0.1
        )}, ${alpha(theme.palette.background.default, 1)} 70%)`,
        minHeight: "100vh",
        pb: 15,
      }}
    >
      {/* Navegación flotante */}
      <NavegacionFlotante>
        <Button>
          <Dashboard />
        </Button>
        <Button>
          <Notifications />
        </Button>
        <Button>
          <Settings />
        </Button>
        <Button>
          <AccountCircle />
        </Button>
      </NavegacionFlotante>

      <Container maxWidth="xl" sx={{ pt: 12, pb: 8 }}>
        {/* Sección Hero */}
        <Box
          sx={{
            textAlign: "center",
            mb: 10,
            position: "relative",
          }}
        >
          <Box
            component={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            sx={{
              position: "absolute",
              top: -100,
              left: "50%",
              transform: "translateX(-50%)",
              width: "600px",
              height: "600px",
              background: `radial-gradient(circle, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, transparent 70%)`,
              zIndex: -1,
            }}
          />

          <Typography
            variant="h2"
            component={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{
              fontWeight: 900,
              letterSpacing: "1px",
              mb: 3,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: isMobile ? "2.5rem" : "4rem",
              lineHeight: 1.2,
            }}
          >
            Gestión de Lotería Pro
          </Typography>

          <Typography
            variant="h6"
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            sx={{
              maxWidth: 700,
              mx: "auto",
              mb: 6,
              fontWeight: 400,
              color: "text.secondary",
            }}
          >
            Plataforma avanzada para el control completo de las operaciones de
            lotería, distribución de premios y verificación de ganadores.
          </Typography>

          {/* Estadísticas */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {estadisticas.map((estadistica, indice) => (
              <Box
                key={estadistica.etiqueta}
                component={motion.div}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + indice * 0.1 }}
                sx={{
                  textAlign: "center",
                  p: 3,
                  minWidth: 180,
                  background: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: "blur(10px)",
                  borderRadius: "18px",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 8px 32px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {estadistica.valor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {estadistica.etiqueta}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Secciones de Funcionalidades */}
        {funcionalidades.map((seccion, indiceSeccion) => (
          <Box key={seccion.titulo} sx={{ mb: 12 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + indiceSeccion * 0.1 }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                mb: 6,
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: alpha(
                    seccion.icono.props.color
                      ? theme.palette[seccion.icono.props.color].main
                      : theme.palette.primary.main,
                    0.1
                  ),
                  color:
                    seccion.icono.props.color || theme.palette.primary.main,
                }}
              >
                {seccion.icono}
              </Avatar>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${
                    seccion.icono.props.color
                      ? theme.palette[seccion.icono.props.color].main
                      : theme.palette.primary.main
                  }, ${theme.palette.text.primary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: isMobile ? "2rem" : "2.5rem",
                }}
              >
                {seccion.titulo}
              </Typography>
            </Box>

            <Grid container spacing={isMobile ? 3 : 6} justifyContent="center">
              {seccion.elementos.map((elemento, indiceElemento) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={elemento.ruta}>
                  <Tarjeta3D
                    component={motion.div}
                    variants={animacionTarjeta}
                    initial="oculto"
                    animate="visible"
                    whileHover="hover"
                    custom={indiceElemento}
                    onClick={() => manejarNavegacion(elemento.ruta)}
                    sx={{
                      height: "100%",
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.background.paper,
                        0.9
                      )} 0%, ${alpha(
                        theme.palette.background.default,
                        0.9
                      )} 100%)`,
                    }}
                  >
                    <Box
                      className="contenido-tarjeta"
                      sx={{
                        p: 4,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        transition: "all 0.5s ease",
                      }}
                    >
                      <Avatar
                        className="icono-tarjeta"
                        sx={{
                          mb: 3,
                          width: 70,
                          height: 70,
                          bgcolor: alpha(elemento.color, 0.1),
                          color: elemento.color,
                          transition: "all 0.5s ease",
                        }}
                      >
                        {elemento.icono}
                      </Avatar>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: "text.primary",
                        }}
                      >
                        {elemento.etiqueta}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          flexGrow: 1,
                        }}
                      >
                        {elemento.descripcion}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: "12px",
                          px: 3,
                          borderWidth: "2px",
                          "&:hover": {
                            borderWidth: "2px",
                          },
                        }}
                      >
                        Acceder
                      </Button>
                    </Box>
                  </Tarjeta3D>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Sección CTA */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          sx={{
            mt: 15,
            p: 6,
            borderRadius: "24px",
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
            color: "common.white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -100,
              right: -100,
              width: "300px",
              height: "300px",
              background: `radial-gradient(circle, ${alpha(
                theme.palette.common.white,
                0.1
              )} 0%, transparent 70%)`,
              borderRadius: "50%",
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 2, zIndex: 1, position: "relative" }}
          >
            ¿Listo para transformar su sistema de lotería?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, zIndex: 1, position: "relative" }}
          >
            Experimente hoy la plataforma de gestión de lotería más avanzada.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ zIndex: 1, position: "relative" }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                borderRadius: "12px",
                px: 4,
                fontWeight: 700,
                boxShadow: `0 8px 24px ${alpha(
                  theme.palette.secondary.main,
                  0.3
                )}`,
              }}
            >
              Comenzar
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                borderRadius: "12px",
                px: 4,
                fontWeight: 700,
                borderWidth: "2px",
                "&:hover": {
                  borderWidth: "2px",
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              Más información
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
