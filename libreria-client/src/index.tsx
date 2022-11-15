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

import Datos from "./Components/Datos/Datos";
import Editoriales from "./Components/Datos/Editoriales/Editoriales";
import EditorialesList from "./Components/Datos/Editoriales/EditorialesList";
import EditorialesForm from "./Components/Datos/Editoriales/EditorialesForm";
import About from "./Components/About/About";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="datos" element={<Datos />}>
          <Route path="editoriales" element={<Editoriales />}>
            <Route path="" element={<EditorialesList />} />
            <Route path=":id" element={<EditorialesForm />} />
            <Route path="alta" element={<EditorialesForm />} />
          </Route>
          {/* <Route path="motos" element={<Motos />}>
            <Route path="" element={<MotosList />} />
            <Route path=":id" element={<MotosForm />} />
            <Route path="alta" element={<MotosForm />} />
          </Route>
          <Route path="bicis" element={<Bicis />}>
            <Route path="" element={<BicisList />} />
            <Route path=":id" element={<BicisForm />} />
            <Route path="alta" element={<BicisForm />} />
          </Route> */}
        </Route>
        <Route path="about" element={<About />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
