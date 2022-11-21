import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  AccordionDetails,
  AccordionActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { Libro, LibrosQueryString } from "../../../Models/Libro.model";
import { LibreriaServices } from "../../../Services/services.factory";
import { Editorial } from "../../../Models/Editorial.model";
import { Tema } from "../../../Models/Tema.model";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FormatosList() {
  let navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [datos, setDatos] = useState<Libro[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState<{
    state: boolean;
    type: AlertColor;
    message: string;
  }>({
    state: false,
    type: "success",
    message: "",
  });
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [temas, setTemas] = useState<Tema[]>([]);

  const [queryString, setQueryString] = useState<LibrosQueryString>({
    titulo: "",
    editoriales: [],
    temas: [],
  });

  const [queryForm, setQueryForm] = useState<{
    titulo: string;
    editoriales: Number[];
    temas: Number[];
  }>({
    titulo: "",
    editoriales: [],
    temas: [],
  });

  useEffect(() => {
    setFetching(true);
    LibreriaServices.libros
      .getAllByQuery(queryString)
      .subscribe({
        next: (res) => {
          setDatos(res);
        },
        error: (err) => {
          setOpenAlert({
            state: true,
            type: "error",
            message: `No se pudieron obtener los datos`,
          });
        },
      })
      .add(() => setFetching(false));
    return () => {};
  }, [idToDelete, queryString]);

  /* Obtengo temas */
  useEffect(() => {
    LibreriaServices.temas
      .getAll()
      .subscribe({
        next: (res) => {
          setTemas(res);
        },
        error: (err) =>
          setOpenAlert({
            state: true,
            type: "error",
            message: "No se pudo editar de forma satisfactoria",
          }),
      })
      .add(() => {});
    return () => {};
  }, []);

  /* Obtengo editoriales */
  useEffect(() => {
    LibreriaServices.editoriales
      .getAll()
      .subscribe({
        next: (res) => {
          setEditoriales(res);
        },
        error: (err) =>
          setOpenAlert({
            state: true,
            type: "error",
            message: "No se pudo editar de forma satisfactoria",
          }),
      })
      .add(() => {});
    return () => {};
  }, []);

  function onIdClick(id: number, edition: boolean) {
    navigate(id ? id.toString() : "alta", { state: { canEdit: edition } });
  }

  function onAltaClick() {
    navigate("alta");
  }

  const handleOpenModalConfirmacion = (id: number) => {
    setIdToDelete(id);
    setOpenModal(true);
  };

  const handleCloseModalConfirmacion = (result: boolean) => {
    if (result) {
      if (idToDelete) {
        LibreriaServices.libros.removeSingle(idToDelete).subscribe({
          next: (res) => {
            setOpenAlert({
              state: true,
              type: "success",
              message: "Se pudo borrar satisfactoriamente",
            });
          },
          error: (err) => {
            setOpenAlert({
              state: true,
              type: "error",
              message: "No se pudo borrar de forma satisfactoria",
            });
          },
        });
      }
      setIdToDelete(null);
    }
    setOpenModal(false);
  };

  const handleAlertClose = () => {
    setOpenAlert((prev) => ({ ...prev, state: false }));
  };

  const handleEditorialesSelectorChange = (
    event: SelectChangeEvent<Number[]>
  ) => {
    const {
      target: { value },
    } = event;
    if (typeof value !== "string") {
      // setEditorialesSeleccionadas(value);
      setQueryForm({ ...queryForm, editoriales: value });
    }
  };

  const handleTemasSelectorChange = (event: SelectChangeEvent<Number[]>) => {
    const {
      target: { value },
    } = event;
    if (typeof value !== "string") {
      // setTemasSeleccionados(value);
      setQueryForm({ ...queryForm, temas: value });
    }
  };

  const onBusquedaBtnClick = () => {
    setQueryString({
      titulo: queryForm.titulo,
      editoriales: queryForm.editoriales.map(
        (x) => editoriales.find((e) => e.editorial_id === x)!
      ),
      temas: queryForm.temas.map((x) => temas.find((e) => e.tema_id === x)!),
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        style={{ margin: "2rem 0" }}
        onClick={() => onAltaClick()}
        startIcon={<AddIcon />}
      >
        Agregar
      </Button>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography>Busqueda</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12}>
              <Item>
                <TextField
                  type="text"
                  id="titulo"
                  label="Titulo"
                  value={queryForm.titulo}
                  onChange={(event) =>
                    setQueryForm({ ...queryForm, titulo: event.target.value })
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <FormControl>
                  <InputLabel id="editoriales-label">Editoriales</InputLabel>
                  <Select
                    labelId="editoriales-label"
                    id="editoriales"
                    multiple
                    value={queryForm.editoriales}
                    onChange={handleEditorialesSelectorChange}
                    input={<OutlinedInput label="Editoriales" />}
                  >
                    {editoriales.map((editorial) => (
                      <MenuItem
                        key={editorial.editorial_id}
                        value={editorial.editorial_id}
                      >
                        {editorial.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <FormControl>
                  <InputLabel id="temas-label">Temas</InputLabel>
                  <Select
                    labelId="temas-label"
                    id="temas"
                    multiple
                    value={queryForm.temas}
                    onChange={handleTemasSelectorChange}
                    input={<OutlinedInput label="Temas" />}
                  >
                    {temas.map((tema) => (
                      <MenuItem key={tema.tema_id} value={tema.tema_id}>
                        {tema.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
          </Grid>
        </AccordionDetails>
        <AccordionActions>
          <Button
            onClick={() => onBusquedaBtnClick()}
            startIcon={<SearchIcon />}
          >
            Buscar
          </Button>
        </AccordionActions>
      </Accordion>
      <TableContainer component={Paper}>
        <LinearProgress
          variant={fetching ? "indeterminate" : "determinate"}
          value={0}
        />
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ISBN</TableCell>
              <TableCell align="left">Titulo</TableCell>
              <TableCell align="left">Paginas</TableCell>
              <TableCell align="left">Editorial</TableCell>
              <TableCell align="left">Formato</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((libro: Libro) => (
              <TableRow key={libro.isbn}>
                <TableCell component="th" scope="row">
                  {libro.isbn}
                </TableCell>
                <TableCell align="left">{libro.titulo}</TableCell>
                <TableCell align="left">{libro.cant_hojas}</TableCell>
                <TableCell align="left">
                  {libro.editorial?.url ? (
                    <a target="_blank" href={libro.editorial.url}>
                      {libro.editorial.nombre}
                    </a>
                  ) : (
                    <>{libro.editorial?.nombre}</>
                  )}
                </TableCell>
                <TableCell align="left">{libro.formato?.nombre}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    onClick={() => onIdClick(libro.isbn!, false)}
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="label"
                    onClick={() => onIdClick(libro.isbn!, true)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    aria-label="upload picture"
                    component="label"
                    onClick={() => handleOpenModalConfirmacion(libro.isbn!)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openModal}
        onClose={() => handleCloseModalConfirmacion(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmación"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta seguro que desea eliminar este formato?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModalConfirmacion(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => handleCloseModalConfirmacion(true)}
            autoFocus
            color="error"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openAlert.state}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <MuiAlert
          severity={openAlert.type}
          elevation={6}
          sx={{ width: "100%" }}
          variant="filled"
          action={
            <>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleAlertClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        >
          {openAlert.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  "& > *": {
    width: "100%",
  },
}));

export default FormatosList;
