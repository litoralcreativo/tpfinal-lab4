import { Breadcrumbs, Button } from "@mui/material";
import { Link, NavLink, Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <Button variant="contained">Home</Button>
          </NavLink>
          <Link to="/datos" style={{ textDecoration: "none" }}>
            <Button variant="text">Librería</Button>
          </Link>
          <Link to="/about" style={{ textDecoration: "none" }}>
            <Button variant="text">About</Button>
          </Link>
        </nav>
      </header>
      <Outlet />
      {/* <footer>
        <p>
          Venta sobre ruedas <span style={{ float: "right" }}>@ACME 2022</span>
        </p>
      </footer> */}
    </>
  );
}

export default App;
