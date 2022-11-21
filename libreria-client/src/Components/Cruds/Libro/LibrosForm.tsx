import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slider,
  styled,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Chip from "@mui/material/Chip";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { LibreriaServices } from "../../../Services/services.factory";
import { Libro, LibroDTO } from "../../../Models/Libro.model";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Editorial } from "../../../Models/Editorial.model";
import { Formato } from "../../../Models/Formato.model";
import { Autor } from "../../../Models/Autor.model";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Tema } from "../../../Models/Tema.model";
import AddIcon from "@mui/icons-material/Add";

const InputMask = require("react-input-mask");

function LibrosForm() {
  let navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { id: isbn } = useParams();

  const [fetching, setFetching] = useState(false);
  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [temas, setTemas] = useState<Tema[]>([]);
  const [validForm, setValidForm] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);

  const [modalAutores, setModalAutores] = useState(false);
  const [modalTemas, setModalTemas] = useState(false);

  const [libro, setLibro] = useState<LibroDTO>({
    isbn: "",
    titulo: "",
    cant_hojas: "",
    anio_edicion: new Date().getFullYear().toString(),
    formato: { nombre: "", formato_id: -1 },
    editorial: { nombre: "", editorial_id: -1 },
    temas: [],
    autores: [],
  });
  const [initialLibro, setInitialLibro] = useState<LibroDTO>({
    isbn: "",
    titulo: "",
    cant_hojas: "",
    anio_edicion: new Date().getFullYear().toString(),
    formato: { nombre: "", formato_id: -1 },
    editorial: { nombre: "", editorial_id: -1 },
    temas: [],
    autores: [],
  });
  const [openAlert, setOpenAlert] = useState<{
    state: boolean;
    type: AlertColor;
    message: string;
  }>({
    state: false,
    type: "success",
    message: "",
  });

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

  /* Obtengo formatos */
  useEffect(() => {
    LibreriaServices.formatos
      .getAll()
      .subscribe({
        next: (res) => {
          setFormatos(res);
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

  /* Obtengo autores */
  useEffect(() => {
    LibreriaServices.autores
      .getAll()
      .subscribe({
        next: (res) => {
          setAutores(res);
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

  /* Obtengo el libro */
  useEffect(() => {
    if (isbn) {
      setFetching(true);
      LibreriaServices.libros
        .getSingle(Number.parseInt(isbn))
        .subscribe({
          next: (res) => {
            if (res) {
              setLibro(LibreriaServices.libros.parseToLibroDTO(res));
              setInitialLibro(LibreriaServices.libros.parseToLibroDTO(res));
            }
          },
        })
        .add(() => {
          setFetching(false);
        });
    }
    return () => {};
  }, [isbn]);

  /* Chequeo validez cada vez que hay un cambio */
  useEffect(() => {
    setValidForm(checkValues());
    return () => {};
  }, [libro]);

  const handleCloseModalConfirmacion = (result: boolean) => {
    if (result) {
      /* edicion */
      if (isbn) {
        LibreriaServices.libros
          .updateSingle(
            Number.parseInt(isbn),
            LibreriaServices.libros.parseToLibro(libro)
          )
          .subscribe({
            next: (res) => {
              setOpenAlert({
                state: true,
                type: "success",
                message: "Se pudo editar satisfactoriamente",
              });
              if (res) {
                setLibro(LibreriaServices.libros.parseToLibroDTO(res));
                setInitialLibro(LibreriaServices.libros.parseToLibroDTO(res));
              }
            },
            error: (err) => {
              setOpenAlert({
                state: true,
                type: "error",
                message: "No se pudo editar de forma satisfactoria",
              });
            },
          })
          .add(() => {
            setTimeout(() => {
              navigate("..");
            }, 1000);
          });
      } else {
        /* alta */
        LibreriaServices.libros
          .createSingle(LibreriaServices.libros.parseToLibro(libro))
          .subscribe({
            next: (res) => {
              setOpenAlert({
                state: true,
                type: "success",
                message: "Se pudo crear satisfactoriamente",
              });
            },
            error: (err) => {
              setOpenAlert({
                state: true,
                type: "error",
                message: "No se pudo crear de forma satisfactoria",
              });
            },
          })
          .add(() => {
            setTimeout(() => {
              navigate("..");
            }, 1000);
          });
      }
      setOpenModal(false);
    } else {
      setOpenModal(false);
    }
  };

  const handleAlertClose = () => {
    setOpenAlert((prev) => ({ ...prev, state: false }));
  };

  const handleChangeYear = (newValue: Dayjs | null) => {
    if (newValue) {
      setLibro({ ...libro, anio_edicion: newValue.year().toString() });
    }
  };

  const handleEditorialChange = (event: any) => {
    const editorialBuscada = editoriales.find(
      (x) => x.editorial_id == event.target.value
    );
    if (editorialBuscada) setLibro({ ...libro, editorial: editorialBuscada });
  };

  const handleFormatoChange = (event: any) => {
    const formatoBuscado = formatos.find(
      (x) => x.formato_id == event.target.value
    );
    if (formatoBuscado) setLibro({ ...libro, formato: formatoBuscado });
  };

  const handlePaginasChange = (event: any) => {
    if (isNaN(event.target.valueAsNumber) && event.nativeEvent.data !== null) {
      return;
    }

    if (event.target.value.length <= 5) {
      setLibro({ ...libro, cant_hojas: event.target.value });
    }
  };

  const handleAutorAdd = (autor: Autor) => {
    setLibro({ ...libro, autores: [...libro.autores, autor] });
    setModalAutores(libro.autores.length !== autores.length);
  };
  const handleAutorRemove = (id: number) => {
    const newList = libro.autores.filter((x) => x.id_autor !== id);
    setLibro({ ...libro, autores: newList });
  };

  const handleTemaAdd = (tema: Tema) => {
    setLibro({ ...libro, temas: [...libro.temas, tema] });
    setModalTemas(libro.temas.length !== temas.length);
  };
  const handleTemaRemove = (id: number) => {
    const newList = libro.temas.filter((x) => x.tema_id !== id);
    setLibro({ ...libro, temas: newList });
  };

  const checkValues = (): boolean => {
    /* required */
    if (libro.isbn == "") return false;
    if (libro.titulo == "") return false;
    if (libro.cant_hojas == "") return false;
    if (libro.anio_edicion == "") return false;
    if (libro.formato.formato_id == -1) return false;
    if (libro.editorial.editorial_id == -1) return false;

    /* different */
    if (libro.cant_hojas != initialLibro.cant_hojas) return true;
    if (libro.titulo != initialLibro.titulo) return true;
    if (libro.anio_edicion != initialLibro.anio_edicion) return true;
    if (libro.formato.formato_id != initialLibro.formato?.formato_id)
      return true;
    if (libro.editorial.editorial_id != initialLibro.editorial?.editorial_id)
      return true;

    //TODO: chequear cambios en arrays..

    return false;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Box>
          <div className="form-controls">
            <h2>{!isbn ? `Nuevo libro` : `Edición`}</h2>
            <Grid container>
              <Grid item xs={4}>
                <Item>
                  <InputMask
                    disabled={fetching || typeof isbn === "string"}
                    mask="999 9 99 999999 9"
                    className="isbn-input"
                    alwaysShowMask={false}
                    maskPlaceholder=" "
                    value={libro.isbn}
                    id="isbn"
                    label="ISBN"
                    onChange={(event: any) =>
                      setLibro({ ...libro, isbn: event.target.value })
                    }
                  >
                    <TextField />
                  </InputMask>
                </Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  <TextField
                    disabled={fetching || !(locationState as any).canEdit}
                    type="text"
                    id="titulo"
                    label="Titulo"
                    onChange={(event) =>
                      setLibro({ ...libro, titulo: event.target.value })
                    }
                    value={libro.titulo}
                  />
                </Item>
              </Grid>
              <Grid item xs={8}>
                <Item>
                  <TextField
                    disabled={fetching || !(locationState as any).canEdit}
                    type="number"
                    id="cant_hojas"
                    inputProps={{
                      min: 1,
                      max: 99999,
                    }}
                    label="Cantidad de páginas"
                    onChange={(event: any) => handlePaginasChange(event)}
                    value={libro.cant_hojas}
                  />
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      disabled={fetching || !(locationState as any).canEdit}
                      views={["year"]}
                      label="Año"
                      inputFormat="YYYY"
                      minDate={dayjs(new Date(1800, 1))}
                      maxDate={dayjs(Date.now())}
                      value={libro.anio_edicion}
                      onChange={(event: Dayjs | null) =>
                        handleChangeYear(event)
                      }
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <FormControl
                    fullWidth
                    disabled={fetching || !(locationState as any).canEdit}
                  >
                    <InputLabel>Editorial</InputLabel>
                    <Select
                      id="select-editorial"
                      value={libro.editorial.editorial_id}
                      label="Editoriales"
                      onChange={(event) => handleEditorialChange(event)}
                    >
                      <MenuItem value={-1}></MenuItem>
                      {editoriales.map((edi) => {
                        return (
                          <MenuItem
                            key={edi.editorial_id}
                            value={edi.editorial_id}
                          >
                            {edi.nombre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <FormControl
                    fullWidth
                    disabled={fetching || !(locationState as any).canEdit}
                  >
                    <InputLabel>Formato</InputLabel>
                    <Select
                      id="select-formato"
                      value={libro.formato.formato_id}
                      label="Formatos"
                      onChange={(event) => handleFormatoChange(event)}
                    >
                      <MenuItem value={-1}></MenuItem>
                      {formatos.map((form) => {
                        return (
                          <MenuItem
                            key={form.formato_id}
                            value={form.formato_id}
                          >
                            {form.nombre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  <Paper variant="outlined">
                    <div
                      style={{
                        padding: "1rem",
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography>Autores</Typography>
                      {libro.autores
                        .sort((a, b) => (a.apellido < b.apellido ? -1 : 1))
                        .map((data) => (
                          <Chip
                            key={data.id_autor}
                            label={`${data.apellido}, ${data.nombre}`}
                            onDelete={
                              !(locationState as any).canEdit
                                ? undefined
                                : () => handleAutorRemove(data.id_autor)
                            }
                          />
                        ))}
                      {(locationState as any).canEdit ? (
                        <>
                          <Fab
                            style={{
                              marginLeft: "auto",
                            }}
                            size="small"
                            color="primary"
                            aria-label="add"
                            disabled={libro.autores.length === autores.length}
                            onClick={() => setModalAutores(true)}
                          >
                            <AddIcon />
                          </Fab>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Paper>
                </Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  <Paper variant="outlined">
                    <div
                      style={{
                        padding: "1rem",
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography>Temas</Typography>
                      {libro.temas
                        .sort((a, b) => (a.nombre < b.nombre ? -1 : 1))
                        .map((data) => (
                          <Chip
                            key={data.tema_id}
                            label={`${data.nombre}`}
                            onDelete={
                              !(locationState as any).canEdit
                                ? undefined
                                : () => handleTemaRemove(data.tema_id)
                            }
                          />
                        ))}

                      {(locationState as any).canEdit ? (
                        <>
                          <Fab
                            style={{
                              marginLeft: "auto",
                            }}
                            size="small"
                            color="primary"
                            aria-label="add"
                            disabled={libro.temas.length === temas.length}
                            onClick={() => setModalTemas(true)}
                          >
                            <AddIcon />
                          </Fab>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Paper>
                </Item>
              </Grid>
            </Grid>
            <div
              style={{ alignSelf: "flex-end", display: "flex", gap: "1rem" }}
            >
              <Button variant="outlined" onClick={() => navigate("..")}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenModal(true)}
                disabled={!validForm}
              >
                Guardar
              </Button>
            </div>
          </div>
        </Box>
        <LinearProgress
          variant={fetching ? "indeterminate" : "determinate"}
          value={0}
        />
      </TableContainer>
      {/* DIALOG de autores */}
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={modalAutores}
        onClose={() => setModalAutores(false)}
      >
        <DialogContent>
          <nav aria-label="secondary mailbox folders">
            <List>
              {libro.autores.length === autores.length ? (
                <>No hay mas registros</>
              ) : (
                <></>
              )}
              {autores
                .filter(
                  (x) => !libro.autores.some((y) => y.id_autor == x.id_autor)
                )
                .map((autor) => (
                  <ListItem
                    disablePadding
                    key={autor.id_autor}
                    onClick={() => handleAutorAdd(autor)}
                  >
                    <ListItemButton>
                      <ListItemText
                        primary={`${autor.apellido}, ${autor.nombre}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </nav>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAutores(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      {/* DIALOG de temas */}
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={modalTemas}
        onClose={() => setModalTemas(false)}
      >
        <DialogContent>
          <nav aria-label="secondary mailbox folders">
            <List>
              {libro.temas.length === temas.length ? (
                <>No hay mas registros</>
              ) : (
                <></>
              )}
              {temas
                .filter((x) => !libro.temas.some((y) => y.tema_id == x.tema_id))
                .map((tema) => (
                  <ListItem
                    disablePadding
                    key={tema.tema_id}
                    onClick={() => handleTemaAdd(tema)}
                  >
                    <ListItemButton>
                      <ListItemText primary={`${tema.nombre}`} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </nav>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalTemas(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      {/* DIALOG de confirmacion */}
      <Dialog
        open={openModal}
        onClose={handleCloseModalConfirmacion}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmación"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta seguro que desea confirmar esta accion?
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
  padding: theme.spacing(2),
  "& > *": {
    width: "100%",
  },
}));

export default LibrosForm;
