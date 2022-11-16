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
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { Formato } from "../../../Models/Formato.model";
import FormatoService from "../../../Services/formatos.service";
import { max, timer } from "rxjs";
import { Autor } from "../../../Models/Autor.model";
import AutorService from "../../../Services/autores.service";

function AutoresForm() {
  let navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const { id } = useParams();

  const [validForm, setValidForm] = useState<boolean>(false);
  const [autor, setAutor] = useState<Autor>({
    dni: -1,
    nombre: "",
    apellido: "",
  });
  const [initialAutor, setInitialAutor] = useState<Autor>({
    dni: -1,
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
      AutorService.getSingle(Number.parseInt(id))
        .subscribe({
          next: (res) => {
            const formatoFetched = res;
            if (formatoFetched) {
              setAutor({ ...formatoFetched });
              setInitialAutor({ ...formatoFetched });
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
    if (autor.nombre == "") return false;
    if (autor.apellido == "") return false;

    /* different */
    if (
      autor.nombre == initialAutor.nombre &&
      autor.nombre == initialAutor.nombre
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
        AutorService.updateSingle(Number.parseInt(id), autor)
          .subscribe({
            next: (res) => {
              setOpenAlert({
                state: true,
                type: "success",
                message: "Se pudo editar satisfactoriamente",
              });
              if (res) {
                setAutor({ ...res });
                setInitialAutor({ ...res });
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
        AutorService.createSingle(autor)
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
        <Box component="form" noValidate autoComplete="off">
          <div className="form-controls">
            <h2>
              {autor.dni == -1
                ? `Nuevo autor`
                : `Edición del autor ${autor.dni}`}
            </h2>
            <div className="flex-row">
              <TextField
                disabled={fetching}
                inputProps={{
                  pattern: "[0-9]*",
                  min: 0,
                  max: 999999999,
                }}
                id="dni"
                label="Dni"
                onChange={(event) =>
                  setAutor({
                    ...autor,
                    dni: Number.parseInt(event.target.value),
                  })
                }
                value={autor?.dni}
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

export default AutoresForm;
