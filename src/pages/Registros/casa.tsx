import { Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const municipios = [
    { municipio: "Registro Sorteo", value: "registroG" },
    { municipio: "Registro por municipio", value: "registro" },
    { municipio: "Registrar Premios", value: "reg-premios" },
    { municipio: "Registrar Cedula", value: "reg-cedula" },
    { municipio: "Sorteo", value: "consulta" },
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
                <Typography style={{ fontWeight: "bold" }} variant="h5">
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
