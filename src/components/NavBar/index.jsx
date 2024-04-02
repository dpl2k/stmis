import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";
import "../NavBar/NavBar.css";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <NavLink
          to="/admin"
          style={{ textDecoration: "none", color: "white"}}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              Admin Page
            </Button>
          )}
        </NavLink>
        <NavLink
          to="/restaurant"
          end = {true}
          style={{ textDecoration: "none", color: "white"}}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              Restaurant Page
            </Button>
          )}
        </NavLink>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
