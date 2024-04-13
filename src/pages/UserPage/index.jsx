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
    CardMedia,
    // IconButton
} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
import { 
    getAllRestaurants, 
    // getCurrentMenu, 
    getAllDishes, 
    getDishesByRestaurantId 
} from "../../api";

const UserPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [dishes, setDishes] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    // const [orderItems, setOrderItems] = useState([]);
    // const [paymentAmount, setPaymentAmount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const restaurantData = await getAllRestaurants();
                setRestaurants(restaurantData.result);
                const allDishesData = await getAllDishes();
                setDishes(allDishesData.result);
            } catch (error) {
                setSnackbarMessage("Failed to get restaurants. Please wait and try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        };
        fetchData();
    }, []);

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const fetchAllDishes = async () => {
        try {
            const dishesData = await getAllDishes();
            setDishes(dishesData.result);
        } catch (error) {
            setSnackbarMessage("Failed to get dishes");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleApply = async () => {
        try {
            if (selectedRestaurant) {
                // const data = await getCurrentMenu(selectedRestaurant, "DineIn");
                const data = await getDishesByRestaurantId(selectedRestaurant);
                setDishes(data.result);
            } else {
                const allDishesData = await getAllDishes();
                setDishes(allDishesData.result);
            }
        } catch (error) {
            setSnackbarMessage("Failed to get menu items. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    // const addItemToOrder = (item) => {
    //     const updatedOrder = [...orderItems];
    //     const existingIndex = updatedOrder.findIndex(orderItem => orderItem.dishId === item.dishId);
    //     if (existingIndex !== -1) {
    //         updatedOrder[existingIndex].quantity++;
    //     } else {
    //         updatedOrder.push({ ...item, quantity: 1 });
    //     }
    //     setOrderItems(updatedOrder);
    //     const totalAmount = updatedOrder.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    //     setPaymentAmount(totalAmount.toFixed(2));
    // };

    // const removeItemFromOrder = (itemId) => {
    //     const updatedOrder = orderItems.filter(item => item.dishId !== itemId);
    //     setOrderItems(updatedOrder);
    //     const totalAmount = updatedOrder.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    //     setPaymentAmount(totalAmount.toFixed(2));
    // };

    return (
        <Box p={3} pt={1}>
            <h1>Delivery Menu Page</h1>
            <Grid container spacing={2}>
                {/* Sidebar for payment section */}
                {/* <Grid item xs={12} md={4}>
                    <Box mb={4}>
                        <Typography variant="h4" style={{ color: "red" }}>Payment section</Typography>
                        <Box mt={2}>
                            {orderItems.map((item) => (
                                <Box key={item.dishId} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                    <Box display="flex" alignItems="center">
                                        <CardMedia
                                            component="img"
                                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                                            image={item.imageUrl}
                                            alt={item.dishName}
                                        />
                                        <Box ml={1}>
                                            <Typography variant="body1">{item.dishName}</Typography>
                                            <Typography variant="body2">Price: ${item.price}</Typography>
                                            <Typography variant="body1">Quantity: {item.quantity}</Typography>
                                        </Box>
                                    </Box>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => removeItemFromOrder(item.dishId)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                        <Typography variant="h6">Total Amount: ${paymentAmount}</Typography>
                    </Box>
                </Grid> */}
                <Grid item xs={12} md={12}>
                    <Box mb={4} display="flex" alignItems="center">
                        <FormControl fullWidth style={{ marginRight: '8px' }}>
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
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApply}
                            style={{ marginRight: '8px' }}
                        >
                            Apply Search
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setSelectedRestaurant("");
                                setDishes([]);
                                fetchAllDishes();
                            }}
                        >
                            Clear Filter
                        </Button>
                    </Box>

                    {/* Menu display */}
                    <Grid container spacing={2}>
                        {dishes.map((dish) => (
                            <Grid item key={dish.dishId} xs={12} sm={6} md={4} lg={3}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        width="200"
                                        image={dish.imageUrl}
                                        alt={dish.dishName}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{dish.dishName}</Typography>
                                        <Typography variant="body1">{dish.description}</Typography>
                                        <Typography variant="body1"><b>Type:</b> {dish.dineInType ? dish.dineInType : "N/A"}</Typography>
                                        <Typography variant="body1"><b>Price:</b> {dish.price}</Typography>
                                        <Typography variant="body1"><b>Allergy:</b> {dish.allergy ? dish.allergy : "N/A"}</Typography>
                                        <Typography variant="body1"><b>Status:</b> {dish.isAvailable ? "In stock" : "Out of stock"}</Typography>
                                        {/* <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => addItemToOrder(dish)}
                                            disabled={!dish.isAvailable}
                                        >
                                            Add to Order
                                        </Button> */}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
            {/* Snackbar for notifications */}
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
