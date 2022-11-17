import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import NotFound from "./Components/Shared/NotFound";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import Cruds from "./Components/Cruds/Cruds";
import Editoriales from "./Components/Cruds/Editoriales/Editoriales";
import EditorialesList from "./Components/Cruds/Editoriales/EditorialesList";
import EditorialesForm from "./Components/Cruds/Editoriales/EditorialesForm";
import About from "./Components/About/About";
import Formatos from "./Components/Cruds/Formatos/Formatos";
import FormatosList from "./Components/Cruds/Formatos/FormatosList";
import FormatosForm from "./Components/Cruds/Formatos/FormatosForm";
import Autores from "./Components/Cruds/Autores/Autores";
import AutoresList from "./Components/Cruds/Autores/AutoresList";
import Temas from "./Components/Cruds/Temas/Temas";
import TemasList from "./Components/Cruds/Temas/TemasList";
import TemasForm from "./Components/Cruds/Temas/TemasForm";
import Libros from "./Components/Cruds/Libro/Libros";
import LibrosList from "./Components/Cruds/Libro/LibrosList";
import LibrosForm from "./Components/Cruds/Libro/LibrosForm";
import AutoresForm from "./Components/Cruds/Autores/AutoresForm";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="libreria" element={<Cruds />}>
          <Route path="libros" element={<Libros />}>
            <Route path="" element={<LibrosList />} />
            <Route path=":id" element={<LibrosForm />} />
            <Route path="alta" element={<LibrosForm />} />
          </Route>
          <Route path="editoriales" element={<Editoriales />}>
            <Route path="" element={<EditorialesList />} />
            <Route path=":id" element={<EditorialesForm />} />
            <Route path="alta" element={<EditorialesForm />} />
          </Route>
          <Route path="formatos" element={<Formatos />}>
            <Route path="" element={<FormatosList />} />
            <Route path=":id" element={<FormatosForm />} />
            <Route path="alta" element={<FormatosForm />} />
          </Route>
          <Route path="autores" element={<Autores />}>
            <Route path="" element={<AutoresList />} />
            <Route path=":id" element={<AutoresForm />} />
            <Route path="alta" element={<AutoresForm />} />
          </Route>
          <Route path="temas" element={<Temas />}>
            <Route path="" element={<TemasList />} />
            <Route path=":id" element={<TemasForm />} />
            <Route path="alta" element={<TemasForm />} />
          </Route>
        </Route>
        <Route path="about" element={<About />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
