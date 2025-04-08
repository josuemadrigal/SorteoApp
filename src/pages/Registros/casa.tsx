import { Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const municipios = [
    { municipio: "Registro Sorteo", value: "registroG" },
    { municipio: "Registro por municipio", value: "registro" },
    { municipio: "Registrar Premios", value: "reg-premios" },
    { municipio: "Registrar Cedula", value: "reg-cedula" },
    { municipio: "Registrar Ronda", value: "reg-ronda" },
  ];

  const vistas = [
    // { municipio: "Sorteo", value: "consulta" },
    { municipio: "Vista premios", value: "viewPremios" },
    { municipio: "Vista ganadores", value: "viewGanadores" },
    { municipio: "Mostrar ganadores en pantalla", value: "view-Ganadores" },
    { municipio: "Verificar", value: "verificar" },
    //{ municipio: "Vista Rondas", value: "viewRondas" },
  ];

  const navigate = useNavigate();

  const handleClick = (item: { municipio: string; value: string }) => {
    //const parametros = { ...item, municipio: item.municipio };
    navigate(`/${item.value}`);
  };
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
      spacing={2}
    >
      <Grid item>
        <Typography
          style={{ fontWeight: "bold", textTransform: "uppercase" }}
          variant="h3"
          gutterBottom
          textAlign="center"
        >
          Eduard Web App
        </Typography>
      </Grid>
      <Typography
        style={{
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: "25px",
          marginTop: "55px",
          color: "white",
          backgroundColor: "seagreen",
          padding: "10px",
          borderRadius: "10px",
        }}
        gutterBottom
        textAlign="center"
      >
        Registros
      </Typography>
      <Grid item container spacing={2} justifyContent="center">
        {municipios.map((item) => (
          <Grid item key={item.value}>
            <Button onClick={() => handleClick(item)} style={{ padding: 0 }}>
              <Paper
                sx={{
                  width: 200,
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "yellowgreen",
                }}
                elevation={3}
              >
                <Typography
                  style={{ fontWeight: "bold", color: "darkolivegreen" }}
                  variant="h5"
                >
                  {item.municipio}
                </Typography>
              </Paper>
            </Button>
          </Grid>
        ))}
      </Grid>
      <Typography
        style={{
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: "25px",
          marginTop: "55px",
          color: "white",
          backgroundColor: "seagreen",
          padding: "10px",
          borderRadius: "10px",
        }}
        gutterBottom
        textAlign="center"
      >
        Vistas
      </Typography>
      <Grid item container spacing={2} justifyContent="center">
        {vistas.map((item) => (
          <Grid item key={item.value}>
            <Button onClick={() => handleClick(item)} style={{ padding: 0 }}>
              <Paper
                sx={{
                  width: 200,
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "yellowgreen",
                }}
                elevation={3}
              >
                <Typography
                  style={{ fontWeight: "bold", color: "darkolivegreen" }}
                  variant="h5"
                >
                  {item.municipio}
                </Typography>
              </Paper>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Home;
