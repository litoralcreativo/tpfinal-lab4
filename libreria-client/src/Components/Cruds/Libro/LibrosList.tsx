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
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { Libro } from "../../../Models/Libro.model";
import { LibreriaServices } from "../../../Services/services.factory";

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

  useEffect(() => {
    setFetching(true);
    LibreriaServices.libros
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
                    <Link to={libro.editorial.url}>
                      {libro.editorial.nombre}
                    </Link>
                  ) : (
                    <>{libro.editorial?.nombre}</>
                  )}
                </TableCell>
                <TableCell align="left">{libro.formato?.nombre}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="label"
                    onClick={() => onIdClick(libro.isbn!)}
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

export default FormatosList;
