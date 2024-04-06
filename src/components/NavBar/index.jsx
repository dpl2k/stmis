import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";
import "../NavBar/NavBar.css";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <NavLink
          to="/userpage"
          end = {true}
          style={{ textDecoration: "none", color: "white"}}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              User Page
            </Button>
          )}
        </NavLink>
        <NavLink
          to="/restaurantpage"
          style={{ textDecoration: "none", color: "white"}}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              Restaurant Page
            </Button>
          )}
        </NavLink>
        <NavLink
          to="/dropdownpage"
          style={{ textDecoration: "none", color: "white" }}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              Dropdown Page
            </Button>
          )}
        </NavLink>
        <NavLink
          to="/dineincategorypage"
          style={{ textDecoration: "none", color: "white" }}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              DineIn Category Page
            </Button>
          )}
        </NavLink>
        <NavLink
          to="/deliverycategorypage"
          style={{ textDecoration: "none", color: "white" }}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              Delivery Category Page
            </Button>
          )}
        </NavLink>
        <NavLink
          to="/dishpage"
          style={{ textDecoration: "none", color: "white" }}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              Dish Page
            </Button>
          )}
        </NavLink>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
