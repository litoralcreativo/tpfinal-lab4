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
        </Route>
        <Route path="about" element={<About />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
