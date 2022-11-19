import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
  Badge,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import FormatoService from "../../../Services/formatos.service";
import { Formato } from "../../../Models/Formato.model";
import { LibreriaServices } from "../../../Services/services.factory";
import { Libro } from "../../../Models/Libro.model";
import { LoadingButton } from "@mui/lab";

function FormatosList() {
  let navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [datos, setDatos] = useState<Formato[]>([]);
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
  const [librosAsociados, setLibrosAsociados] = useState<{
    fetching: boolean;
    libros: Libro[];
  }>({ fetching: false, libros: [] });

  useEffect(() => {
    setFetching(true);
    LibreriaServices.formatos
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
    setLibrosAsociados({ fetching: true, libros: [] });
    LibreriaServices.formatos.getLibrosByFormato(id).subscribe({
      next: (res) => {
        setLibrosAsociados({ fetching: false, libros: res });
      },
    });
    setOpenModal(true);
  };

  const handleCloseModalConfirmacion = (result: boolean) => {
    if (result) {
      if (idToDelete) {
        LibreriaServices.formatos.removeSingle(idToDelete).subscribe({
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
              <TableCell align="left">Nombre</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datos.map((editorial: Formato) => (
              <TableRow key={editorial.formato_id}>
                <TableCell component="th" scope="row">
                  {editorial.formato_id}
                </TableCell>
                <TableCell align="left">{editorial.nombre}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="label"
                    onClick={() => onIdClick(editorial.formato_id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    aria-label="upload picture"
                    component="label"
                    onClick={() =>
                      handleOpenModalConfirmacion(editorial.formato_id)
                    }
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
            {librosAsociados.libros.length > 0 ? (
              <>
                {librosAsociados.libros.length == 1 ? (
                  <strong>{`Si elimina este foramto se eliminará tambien el libro que se encuentra asociado al mismo.`}</strong>
                ) : (
                  <strong>{`Si elimina este formato se eliminaran tambien los libros que se encuentran asociados al mismo.`}</strong>
                )}
              </>
            ) : (
              <></>
            )}{" "}
            Esta seguro que desea eliminar este formato?
            {librosAsociados.libros.length > 0 ? (
              <>
                <br />
                <br />
                <Accordion>
                  <Badge
                    invisible={librosAsociados.libros.length == 0}
                    badgeContent={librosAsociados.libros.length}
                    color="error"
                    anchorOrigin={{
                      horizontal: "left",
                      vertical: "top",
                    }}
                  >
                    <AccordionSummary
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Libros asociados a este formato</Typography>
                    </AccordionSummary>
                  </Badge>
                  <AccordionDetails>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 300,
                        "& ul": { padding: 0 },
                      }}
                      subheader={<li />}
                    >
                      {librosAsociados.libros.map((libro) => (
                        <ListItem key={libro.isbn}>
                          <ListItemText
                            primary={libro.titulo}
                            secondary={
                              libro.autores.length > 0 ? (
                                <>
                                  {libro.autores[0].nombre}
                                  {", "}
                                  {libro.autores[0].apellido}
                                </>
                              ) : (
                                <></>
                              )
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </>
            ) : (
              <></>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModalConfirmacion(false)}>
            Cancelar
          </Button>
          <LoadingButton
            onClick={() => handleCloseModalConfirmacion(true)}
            color="error"
            loading={librosAsociados.fetching}
            variant={librosAsociados.fetching ? "outlined" : "contained"}
            loadingPosition="start"
            startIcon={<DeleteIcon />}
          >
            Confirmar
          </LoadingButton>
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
