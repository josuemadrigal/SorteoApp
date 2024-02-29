import { Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SelectMunicio = () => {
  const municipios = [
    { municipio: "La Romana", value: "la-romana" },
    { municipio: "Villa Hermosa", value: "villa-hermosa" },
    { municipio: "Caleta", value: "caleta" },
    { municipio: "Guaymate", value: "guayamate" },
    { municipio: "Cumayasa", value: "cumayasa" },
  ];

  const navigate = useNavigate();

  const handleClick = (item: { municipio: string; value: string }) => {
    const parametros = { ...item, municipio: item.municipio };
    navigate(`/registro/${item.value}`, { state: { parametros } });
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
        <Typography variant="h3" gutterBottom>
          Seleccione el municipio
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
                }}
                elevation={3}
              >
                <Typography variant="h5">{item.municipio}</Typography>
              </Paper>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default SelectMunicio;
