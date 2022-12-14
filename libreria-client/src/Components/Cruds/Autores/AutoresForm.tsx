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
  LinearProgress,
  Paper,
  Slider,
  TableContainer,
  TextField,
} from "@mui/material";
import React, {
  BaseSyntheticEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { Formato } from "../../../Models/Formato.model";
import FormatoService from "../../../Services/formatos.service";
import { max, timer } from "rxjs";
import { Autor, AutorDTO } from "../../../Models/Autor.model";
import AutorService from "../../../Services/autores.service";
import { isInt16Array } from "util/types";
import { LibreriaServices } from "../../../Services/services.factory";

function AutoresForm() {
  let navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const { id } = useParams();

  const [validForm, setValidForm] = useState<boolean>(false);
  const [autor, setAutor] = useState<AutorDTO>({
    dni: "",
    nombre: "",
    apellido: "",
  });
  const [initialAutor, setInitialAutor] = useState<AutorDTO>({
    dni: "",
    nombre: "",
    apellido: "",
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
    if (id) {
      setFetching(true);
      LibreriaServices.autores
        .getSingle(Number.parseInt(id))
        .subscribe({
          next: (res) => {
            const formatoFetched = res;
            if (formatoFetched) {
              setAutor(LibreriaServices.autores.parseToAutor(formatoFetched));
              setInitialAutor(
                LibreriaServices.autores.parseToAutor(formatoFetched)
              );
            }
          },
        })
        .add(() => {
          setFetching(false);
        });
    }
    return () => {};
  }, [id]);

  const checkValues = (): boolean => {
    let res = true;

    /* required */
    if (autor.dni === "") return false;
    if (autor.nombre == "") return false;
    if (autor.apellido == "") return false;

    /* different */
    if (
      autor.dni == initialAutor.dni &&
      autor.nombre == initialAutor.nombre &&
      autor.apellido == initialAutor.apellido
    )
      return false;
    return res;
  };

  useEffect(() => {
    setValidForm(checkValues());
    return () => {};
  }, [autor]);

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModalConfirmacion = (result: boolean) => {
    if (result) {
      /* edicion */
      if (id) {
        LibreriaServices.autores
          .updateSingle(
            Number.parseInt(id),
            LibreriaServices.autores.parseToAutorDTO(autor)
          )
          .subscribe({
            next: (res) => {
              setOpenAlert({
                state: true,
                type: "success",
                message: "Se pudo editar satisfactoriamente",
              });
              if (res) {
                setAutor(LibreriaServices.autores.parseToAutor(res));
                setInitialAutor(LibreriaServices.autores.parseToAutor(res));
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
        LibreriaServices.autores
          .createSingle(LibreriaServices.autores.parseToAutorDTO(autor))
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
  return (
    <>
      <TableContainer component={Paper}>
        <Box>
          <div className="form-controls">
            <h2>{!id ? `Nuevo autor` : `Edici??n del autor ${id}`}</h2>
            <div className="flex-row">
              <TextField
                disabled={fetching}
                type="number"
                inputProps={{
                  pattern: "[0-9]*",
                  min: 0,
                  max: 999999999,
                }}
                id="dni"
                label="Dni"
                onChange={(event: BaseSyntheticEvent) => {
                  setAutor({
                    ...autor,
                    dni: event.target.value,
                  });
                }}
                value={autor.dni}
              />
              <TextField
                disabled={fetching}
                type="text"
                id="nombre"
                label="Nombre"
                onChange={(event) =>
                  setAutor({ ...autor, nombre: event.target.value })
                }
                value={autor?.nombre}
              />
              <TextField
                disabled={fetching}
                type="text"
                id="apellido"
                label="Apellido"
                onChange={(event) =>
                  setAutor({ ...autor, apellido: event.target.value })
                }
                value={autor?.apellido}
              />
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
        <DialogTitle id="alert-dialog-title">{"Confirmaci??n"}</DialogTitle>
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

export default AutoresForm;
