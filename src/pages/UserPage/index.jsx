import React, { useState, useEffect } from "react";
import {
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Box,
    Grid,
    OutlinedInput,
    Snackbar,
    Alert
} from "@mui/material";
import DishTable from "../../components/DishTable";
import { getAllRestaurants, getCurrentMenu } from "../../api";

const UserPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [menuType, setMenuType] = useState("");
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [dishes, setDishes] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getAllRestaurants();
                setRestaurants(data.result);
            } catch (error) {
                setSnackbarMessage("Failed to get restaurants. Please wait and try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        };
        fetchRestaurants();
    }, []);

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleApply = async () => {
        try {
            const data = await getCurrentMenu(selectedRestaurant, menuType);
            setDishes(data.result);
        } catch (error) {
            setSnackbarMessage("Failed to get menu items. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    return (
        <Box p={3} pt={1}>
            <h1>Restaurant Page</h1>
            <Box mb={4}>
                <Grid
                    container
                    spacing={2}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                >
                    <Grid item>
                        <Box display="flex" gap={2}>
                            <FormControl fullWidth style={{ width: "300px" }}>
                                <InputLabel id="restaurant-label">Restaurant</InputLabel>
                                <Select
                                    labelId="restaurant-label"
                                    value={selectedRestaurant}
                                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                                    input={<OutlinedInput label="Restaurant" />}
                                >
                                    {restaurants.map((restaurant) => (
                                        <MenuItem
                                            key={restaurant.restaurantId}
                                            value={restaurant.restaurantId}
                                        >
                                            {restaurant.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth style={{ width: "300px" }}>
                                <InputLabel id="menu-type-label">Menu Type</InputLabel>
                                <Select
                                    labelId="menu-type-label"
                                    value={menuType}
                                    onChange={(e) => setMenuType(e.target.value)}
                                    input={<OutlinedInput label="Menu Type" />}
                                >
                                    <MenuItem value="DineIn">DineIn</MenuItem>
                                    <MenuItem value="Delivery">Delivery</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    setSelectedRestaurant("");
                                    setMenuType("");
                                    setDishes([]);
                                }}
                            >
                                Clear Filter
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleApply}>
                                Apply
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <DishTable dishes={dishes} isAdmin={false} />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserPage;
