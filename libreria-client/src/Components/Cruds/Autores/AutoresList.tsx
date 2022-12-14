import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { Autor } from "../../../Models/Autor.model";
import AutorService from "../../../Services/autores.service";
import { LibreriaServices } from "../../../Services/services.factory";

function AutoresList() {
  let navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [datos, setDatos] = useState<Autor[]>([]);
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

  useEffect(() => {
    setFetching(true);
    LibreriaServices.autores
      .getAll()
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
  }, [idToDelete]);

  function onIdClick(id: number) {
    navigate(id ? id.toString() : "alta");
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
        LibreriaServices.autores.removeSingle(idToDelete).subscribe({
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
      <TableContainer component={Paper}>
        <LinearProgress
          variant={fetching ? "indeterminate" : "determinate"}
          value={0}
        />
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="left">Dni</TableCell>
              <TableCell align="left">Nombre</TableCell>
              <TableCell align="left">Apellido</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((autor: Autor) => (
              <TableRow key={autor.id_autor}>
                <TableCell component="th" scope="row">
                  {autor.id_autor}
                </TableCell>
                <TableCell align="left">{autor.dni}</TableCell>
                <TableCell align="left">{autor.nombre}</TableCell>
                <TableCell align="left">{autor.apellido}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="label"
                    onClick={() => onIdClick(autor.id_autor)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    aria-label="upload picture"
                    component="label"
                    onClick={() => handleOpenModalConfirmacion(autor.id_autor)}
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
        <DialogTitle id="alert-dialog-title">{"Confirmaci??n"}</DialogTitle>
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

export default AutoresList;
