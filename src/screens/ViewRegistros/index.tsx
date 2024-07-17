import React, { useEffect, useState } from "react";
import "../../App.css";
import { Grid, Paper, Typography, styled } from "@mui/material";
import registrosService from "../../services/RegistrosService";

interface RegistroCountByMunicipioProps {
  registros: { municipio: string; count: number }[];
}

const RegistroCountByMunicipio: React.FC<RegistroCountByMunicipioProps> = ({
  registros,
}) => {
  const formatMunicipioName = (municipio: string) => {
    switch (municipio) {
      case "la-romana":
        return "La Romana";
      case "villa-hermosa":
        return "Villa Hermosa";
      case "caleta":
        return "Caleta";
      case "cumayasa":
        return "Cumayasa";
      case "guaymate":
        return "Guaymate";
      default:
        return municipio;
    }
  };

  return (
    <div>
      <Typography
        style={{
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: "20px",
          marginTop: "20px",
          color: "black",
          backgroundColor: "lightgray",
          padding: "10px",
          borderRadius: "10px",
        }}
        gutterBottom
        textAlign="center"
      >
        Conteo de Registros por Municipio
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {registros.map((registro) => (
          <Grid item key={registro.municipio} xs={12} sm={6} md={4}>
            <Paper
              style={{
                padding: "10px",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              <Typography variant="h6">
                {formatMunicipioName(registro.municipio)}
              </Typography>
              <Typography variant="body1">
                Cantidad: {registro.count}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const ViewRegistros = () => {
  const [registrosCountByMunicipio, setRegistrosCountByMunicipio] = useState<
    { municipio: string; count: number }[]
  >([]);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);

  useEffect(() => {
    const fetchRegistrosCountByMunicipio = async () => {
      try {
        const response = await registrosService.getRegistrosCountByMunicipio();
        if (response.data.ok) {
          setRegistrosCountByMunicipio(response.data.registros);
          // Calcular el total de registros
          const total = response.data.registros.reduce(
            (accumulator, current) => accumulator + current.count,
            0
          );
          setTotalRegistros(total);
        }
      } catch (error) {
        console.error("Error fetching registros count by municipio", error);
      }
    };

    // Llamar al método inicialmente
    fetchRegistrosCountByMunicipio();

    // Establecer intervalo para actualizar cada 1 minuto
    const interval = setInterval(() => {
      fetchRegistrosCountByMunicipio();
    }, 60000); // 60000 milisegundos = 1 minuto

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: "center",
  }));

  return (
    <Grid container my={1} rowSpacing={1} columnSpacing={1}>
      <Grid item md={12}>
        <Item
          sx={{
            height: "calc(100vh)",
            marginX: "5%",
            backgroundColor: "#06502a",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            columnSpacing={1}
            sx={{
              justifyContent: "center",
              flex: 1,
              width: "100%",
              minHeight: "200px",
            }}
          >
            <RegistroCountByMunicipio registros={registrosCountByMunicipio} />
          </Grid>
          <Typography
            style={{
              fontWeight: "bold",
              fontSize: "32px",
              marginTop: "20px",
              color: "white",
            }}
            gutterBottom
            textAlign="center"
          >
            Total de Registros: {totalRegistros}
          </Typography>
        </Item>
      </Grid>
    </Grid>
  );
};

export default ViewRegistros;
