import { Monitor } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MonitorData } from "../../Models/MonitorData.model";
import { LibreriaServices } from "../../Services/services.factory";

import PersonIcon from "@mui/icons-material/Person";
import FormatsIcon from "@mui/icons-material/AutoStories";
import BookIcon from "@mui/icons-material/Book";
import TopicIcon from "@mui/icons-material/Topic";
import StoreIcon from "@mui/icons-material/Store";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [monitor, setMonitor] = useState<{
    fetching: boolean;
    data: MonitorData;
  }>({
    fetching: false,
    data: {
      autores: 0,
      temas: 0,
      formatos: 0,
      editoriales: 0,
      libros: 0,
    },
  });

  useEffect(() => {
    setMonitor({ ...monitor, fetching: true });
    LibreriaServices.monitor
      .getCounts()
      .subscribe({
        next: (res) => {
          setMonitor((prev) => {
            return { ...prev, data: res };
          });
        },
      })
      .add(() => {
        setMonitor((prev) => {
          return { ...prev, fetching: false };
        });
      });
  }, []);

  return (
    <Container>
      <h1>Home</h1>
      <Grid container>
        <Grid item lg={4} md={6} xs={12}>
          <Item>
            <Badge badgeContent={monitor.data.autores} color="primary">
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    <PersonIcon style={{ float: "right" }} /> Autores
                  </Typography>
                  <Typography color="text.secondary">
                    Escritores de los libros
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate("libreria", { state: { goto: "autores" } })
                    }
                  >
                    Ir
                  </Button>
                </CardActions>
              </Card>
            </Badge>
          </Item>
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <Item>
            <Badge badgeContent={monitor.data.formatos} color="primary">
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    <FormatsIcon style={{ float: "right" }} /> Formatos
                  </Typography>
                  <Typography color="text.secondary">
                    Tipos de entrega de los libros
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate("libreria", { state: { goto: "formatos" } })
                    }
                  >
                    Ir
                  </Button>
                </CardActions>
              </Card>
            </Badge>
          </Item>
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <Item>
            <Badge badgeContent={monitor.data.temas} color="primary">
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    <TopicIcon style={{ float: "right" }} /> Temas
                  </Typography>
                  <Typography color="text.secondary">
                    Genero de los libros
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate("libreria", { state: { goto: "temas" } })
                    }
                  >
                    Ir
                  </Button>
                </CardActions>
              </Card>
            </Badge>
          </Item>
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <Item>
            <Badge badgeContent={monitor.data.editoriales} color="primary">
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    <StoreIcon style={{ float: "right" }} />
                    Editoriales
                  </Typography>
                  <Typography color="text.secondary">
                    Encargadas de editar y publicar los libros
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate("libreria", { state: { goto: "editoriales" } })
                    }
                  >
                    Ir
                  </Button>
                </CardActions>
              </Card>
            </Badge>
          </Item>
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <Item>
            <Badge badgeContent={monitor.data.libros} color="primary">
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    <BookIcon style={{ float: "right" }} /> Libros
                  </Typography>
                  <Typography color="text.secondary">
                    Asociados a editoriales, formatos, temas y autores
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate("libreria", { state: { goto: "libros" } })
                    }
                  >
                    Ir
                  </Button>
                </CardActions>
              </Card>
            </Badge>
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
}

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: "1rem",
  margin: "1rem",
  "& > *": {
    width: "100%",
    "& > div": {
      width: "100%",
    },
  },
}));

export default Home;
