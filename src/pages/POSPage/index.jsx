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
    Alert,
    Card,
    CardContent,
    Typography,
    CardMedia
} from "@mui/material";
import { getAllRestaurants, getCurrentMenu } from "../../api";

const POSPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [menuType, setMenuType] = useState("");
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [dishes, setDishes] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [orderItems, setOrderItems] = useState([]);

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

    const addItemToOrder = (item) => {
        const updatedOrder = [...orderItems];
        const existingIndex = updatedOrder.findIndex(orderItem => orderItem.dishId === item.dishId);
        if (existingIndex !== -1) {
            updatedOrder[existingIndex].quantity++;
        } else {
            updatedOrder.push({ ...item, quantity: 1 });
        }
        setOrderItems(updatedOrder);
    };

    const removeItemFromOrder = (itemId) => {
        const updatedOrder = orderItems.filter(item => item.dishId !== itemId);
        setOrderItems(updatedOrder);
    };

    return (
        <Box p={3} pt={1}>
            <h1>POS Page</h1>
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
                                    setOrderItems([]);
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
            <Grid container spacing={2}>
                {dishes.map((dish) => (
                    <Grid item key={dish.dishId} xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={dish.imageUrl}
                                alt={dish.dishName}
                            />
                            <CardContent>
                                <Typography variant="h6">{dish.dishName}</Typography>
                                <Typography variant="body1">{dish.description}</Typography>
                                <Typography variant="body1">Price: ${dish.price}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => addItemToOrder(dish)}
                                >
                                    Add to Order
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <h2>Order</h2>
            <Grid container spacing={2}>
                {orderItems.map((item) => (
                    <Grid item key={item.dishId} xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.imageUrl}
                                alt={item.dishName}
                            />
                            <CardContent>
                                <Typography variant="h6">{item.dishName}</Typography>
                                <Typography variant="body1">{item.description}</Typography>
                                <Typography variant="body1">Price: ${item.price}</Typography>
                                <Typography variant="body1">Quantity: {item.quantity}</Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => removeItemFromOrder(item.dishId)}
                                >
                                    Remove
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
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

export default POSPage;
