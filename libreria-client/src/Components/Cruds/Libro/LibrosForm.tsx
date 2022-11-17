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
  LinearProgress,
  Paper,
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

const InputMask = require("react-input-mask");

function LibrosForm() {
  let navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const { id: isbn } = useParams();

  const [validForm, setValidForm] = useState<boolean>(false);
  const [libro, setLibro] = useState<LibroDTO>({
    isbn: "",
    titulo: "",
    cant_hojas: "",
    anio_edicion: new Date().getFullYear().toString(),
    formato_id: "",
    editorial_id: "",
    temas: [],
    autores: [],
  });
  const [initialLibro, setInitialLibro] = useState<LibroDTO>({
    isbn: "",
    titulo: "",
    cant_hojas: "",
    anio_edicion: new Date().getFullYear().toString(),
    formato_id: "",
    editorial_id: "",
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

  const checkValues = (): boolean => {
    let res = true;

    /* required */
    if (libro.isbn == "") return false;
    if (libro.cant_hojas == "") return false;
    if (libro.anio_edicion == "") return false;
    if (libro.formato_id == "") return false;
    if (libro.editorial_id == "") return false;

    /* different */
    if (libro.cant_hojas != initialLibro.cant_hojas) return true;
    if (libro.anio_edicion != initialLibro.anio_edicion) return true;
    if (libro.formato_id != initialLibro.formato_id) return true;
    if (libro.editorial_id != initialLibro.editorial_id) return true;

    //TODO: chequear cambios en arrays..

    return res;
  };

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

  function handlePaginasChange(event: any) {
    if (isNaN(event.target.valueAsNumber) && event.nativeEvent.data !== null) {
      return;
    }

    if (event.target.value.length <= 5) {
      setLibro({ ...libro, cant_hojas: event.target.value });
    }
  }

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
                  onChange={handleChangeYear}
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
