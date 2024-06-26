import React from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Button, Menu, MenuItem } from "@mui/material";
import "../NavBar/NavBar.css";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <NavLink
          to="/userpage"
          end={true}
          style={{ textDecoration: "none", color: "white" }}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              Delivery Menu
            </Button>
          )}
        </NavLink>
        <NavLink
          to="/pospage"
          end={true}
          style={{ textDecoration: "none", color: "white" }}
        >
          {({ isActive }) => (
            <Button color="inherit" className={isActive ? "active-tab" : ""}>
              POS Menu
            </Button>
          )}
        </NavLink>
        <Button
          aria-controls="admin-menu"
          aria-haspopup="true"
          onClick={handleClick}
          color="inherit"
        >
          Admin Page
        </Button>
        <Menu
          id="admin-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <NavLink
              to="/restaurantpage"
              style={{ textDecoration: "none", color: "black" }}
            >
              Restaurant Configure
            </NavLink>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <NavLink
              to="/dropdownpage"
              style={{ textDecoration: "none", color: "black" }}
            >
              Dropdown Configure
            </NavLink>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <NavLink
              to="/dineincategorypage"
              style={{ textDecoration: "none", color: "black" }}
            >
              DineIn Category Configure
            </NavLink>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <NavLink
              to="/deliverycategorypage"
              style={{ textDecoration: "none", color: "black" }}
            >
              Delivery Category Configure
            </NavLink>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <NavLink
              to="/dishpage"
              style={{ textDecoration: "none", color: "black" }}
            >
              Dishes Configure
            </NavLink>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <NavLink
              to="/changelogpage"
              style={{ textDecoration: "none", color: "black" }}
            >
              Change Log Page
            </NavLink>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;