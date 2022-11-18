import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Slider,
  TableContainer,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { LibreriaServices } from "../../../Services/services.factory";
import { Libro, LibroDTO } from "../../../Models/Libro.model";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Editorial } from "../../../Models/Editorial.model";
import { Formato } from "../../../Models/Formato.model";

const InputMask = require("react-input-mask");

function LibrosForm() {
  let navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const { id: isbn } = useParams();

  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [formatos, setFormatos] = useState<Formato[]>([]);

  const [validForm, setValidForm] = useState<boolean>(false);
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

  useEffect(() => {
    setValidForm(checkValues());
    return () => {};
  }, [libro]);

  const [openModal, setOpenModal] = useState(false);

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

  function handlePaginasChange(event: any) {
    if (isNaN(event.target.valueAsNumber) && event.nativeEvent.data !== null) {
      return;
    }

    if (event.target.value.length <= 5) {
      setLibro({ ...libro, cant_hojas: event.target.value });
    }
  }

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
        <Box component="form" noValidate autoComplete="off">
          <div className="form-controls">
            <h2>
              {!isbn ? (
                `Nuevo libro`
              ) : (
                <span>
                  Edición del libro{" "}
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "1.5em",
                      fontWeight: 300,
                    }}
                  >
                    {isbn}
                  </span>
                </span>
              )}
            </h2>
            <div className="flex-row">
              {!isbn ? (
                <>
                  <InputMask
                    disabled={fetching}
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
                </>
              ) : (
                <></>
              )}
              <TextField
                disabled={fetching}
                type="text"
                id="titulo"
                label="Titulo"
                onChange={(event) =>
                  setLibro({ ...libro, titulo: event.target.value })
                }
                value={libro.titulo}
              />
            </div>

            <div className="flex-row">
              <TextField
                disabled={fetching}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  views={["year"]}
                  label="Año"
                  inputFormat="YYYY"
                  minDate={dayjs(new Date(1800, 1))}
                  maxDate={dayjs(Date.now())}
                  value={libro.anio_edicion}
                  onChange={(event: Dayjs | null) => handleChangeYear(event)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {/* <TextField
                disabled={fetching}
                type="text"
                id="anio_edicion"
                inputProps={{
                  min: 1,
                  max: 99999,
                }}
                label="Año de edición"
                onChange={(event: any) => handleAnioChange(event)}
                value={libro.anio_edicion}
              /> */}
            </div>

            <div className="flex-row">
              <FormControl fullWidth>
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
                      <MenuItem key={edi.editorial_id} value={edi.editorial_id}>
                        {edi.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth>
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
                      <MenuItem key={form.formato_id} value={form.formato_id}>
                        {form.nombre}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>

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

export default LibrosForm;
