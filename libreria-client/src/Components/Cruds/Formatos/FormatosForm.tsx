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
import { LibreriaServices } from "../../../Services/services.factory";

function FormatosForm() {
  let navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const { id } = useParams();

  const [validForm, setValidForm] = useState<boolean>(false);
  const [formato, setFormato] = useState<Formato>({
    formato_id: -1,
    nombre: "",
  });
  const [initialFormato, setInitialFormato] = useState<Formato>({
    formato_id: -1,
    nombre: "",
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
      LibreriaServices.formatos
        .getSingle(Number.parseInt(id))
        .subscribe({
          next: (res) => {
            const formatoFetched = res;
            if (formatoFetched) {
              setFormato({ ...formatoFetched });
              setInitialFormato({ ...formatoFetched });
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
    if (formato.nombre == "") return false;

    /* different */
    if (formato.nombre == initialFormato.nombre) return false;
    return res;
  };

  useEffect(() => {
    setValidForm(checkValues());
    return () => {};
  }, [formato]);

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModalConfirmacion = (result: boolean) => {
    if (result) {
      /* edicion */
      if (id) {
        LibreriaServices.formatos
          .updateSingle(Number.parseInt(id), formato)
          .subscribe({
            next: (res) => {
              setOpenAlert({
                state: true,
                type: "success",
                message: "Se pudo editar satisfactoriamente",
              });
              if (res) {
                setFormato({ ...res });
                setInitialFormato({ ...res });
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
        LibreriaServices.formatos
          .createSingle(formato)
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
            <h2>
              {formato.formato_id == -1
                ? `Nuevo formato`
                : `Edición del formato ${formato.formato_id}`}
            </h2>
            <div className="flex-row">
              <TextField
                disabled={fetching}
                type="text"
                id="nombre"
                label="Nombre"
                onChange={(event) =>
                  setFormato({ ...formato, nombre: event.target.value })
                }
                value={formato?.nombre}
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

export default FormatosForm;
