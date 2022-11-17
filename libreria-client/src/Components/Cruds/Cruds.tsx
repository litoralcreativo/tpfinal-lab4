import { Box, Container, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Cruds.css";

function Cruds() {
  const [value, setValue] = useState("editoriales");
  let navigate = useNavigate();
  useEffect(() => {
    navigate(value);
  }, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container>
      <h1>Librería</h1>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="main tabs">
          <Tab label="Libros" value={"libros"} />
          <Tab label="Editoriales" value={"editoriales"} />
          <Tab label="Autores" value={"autores"} />
          <Tab label="Temas" value={"temas"} />
          <Tab label="Formatos" value={"formatos"} />
        </Tabs>
      </Box>
      <Outlet />
      <div style={{ height: "100px" }}></div>
    </Container>
  );
}

export default Cruds;
