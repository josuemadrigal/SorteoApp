import { Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import gifLoading from "../../../public/loading.gif";

const HomePadres = () => {
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
        Sorteo Padres en desarrollo
      </Typography>
      <Grid
        style={{
          display: "block",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={gifLoading} alt="loading" style={{ width: "300px" }} />
      </Grid>
    </Grid>
  );
};

export default HomePadres;
