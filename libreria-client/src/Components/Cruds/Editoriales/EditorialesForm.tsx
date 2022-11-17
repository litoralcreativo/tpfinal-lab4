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
import { Editorial } from "../../../Models/Editorial.model";
import EditorialService from "../../../Services/editoriales.service";

function EditorialesForm() {
  let navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const { id } = useParams();

  const [validForm, setValidForm] = useState<boolean>(false);
  const [editorial, setEditorial] = useState<Editorial>({
    editorial_id: -1,
    nombre: "",
    url: "",
    direccion: "",
  });
  const [initialEditorial, setInitialEditorial] = useState<Editorial>({
    editorial_id: -1,
    nombre: "",
    url: "",
    direccion: "",
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
      EditorialService.getSingle(Number.parseInt(id))
        .subscribe({
          next: (res) => {
            const editorialFetched = res;
            if (editorialFetched) {
              setEditorial({ ...editorialFetched });
              setInitialEditorial({ ...editorialFetched });
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
    if (editorial.nombre == "") return false;

    /* different */
    if (
      editorial.nombre == initialEditorial.nombre &&
      editorial.direccion == initialEditorial.direccion &&
      editorial.url == initialEditorial.url
    )
      return false;
    return res;
  };

  useEffect(() => {
    setValidForm(checkValues());
    return () => {};
  }, [editorial]);

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModalConfirmacion = (result: boolean) => {
    if (result) {
      /* edicion */
      if (id) {
        EditorialService.updateSingle(Number.parseInt(id), editorial)
          .subscribe({
            next: (res) => {
              setOpenAlert({
                state: true,
                type: "success",
                message: "Se pudo editar satisfactoriamente",
              });
              if (res) {
                setEditorial({ ...res });
                setInitialEditorial({ ...res });
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
        // servicio.updateMotoIndividual(Number.parseInt(id), moto);
      } else {
        /* alta */
        EditorialService.createSingle(editorial)
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
              {editorial.editorial_id == -1
                ? `Nueva editorial`
                : `Edición de la editorial ${editorial.editorial_id}`}
            </h2>
            <div className="flex-row">
              <TextField
                disabled={fetching}
                type="text"
                id="nombre"
                label="Nombre"
                onChange={(event) =>
                  setEditorial({ ...editorial, nombre: event.target.value })
                }
                value={editorial?.nombre}
              />
              <TextField
                disabled={fetching}
                type="text"
                id="direccion"
                label="Dirección"
                onChange={(event) =>
                  setEditorial({ ...editorial, direccion: event.target.value })
                }
                value={editorial?.direccion}
              />
              <TextField
                disabled={fetching}
                type="text"
                id="url"
                label="Url"
                onChange={(event) =>
                  setEditorial({ ...editorial, url: event.target.value })
                }
                value={editorial?.url}
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

export default EditorialesForm;
