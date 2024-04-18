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
import { 
    getAllRestaurants, 
    getAllDishes, 
    getDeliveryMenu,
    getAllDeliveryCategories,
    getDropdownByModuleAndType
} from "../../api";

const UserPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [deliveryCategories, setDeliveryCategories] = useState([]);
    const [selectedDeliveryCategory, setSelectedDeliveryCategory] = useState("");
    const [deliveryTypes, setDeliveryTypes] = useState([]);
    const [selectedDeliveryType, setSelectedDeliveryType] = useState("");
    const [applyDisabled, setApplyDisabled] = useState(true);
    const [clearDisabled, setClearDisabled] = useState(true);
    const [dishes, setDishes] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const restaurantData = await getAllRestaurants();
                if (restaurantData.statusCode !== 200) {
                    throw new Error("Failed to get restaurants");
                }
                setRestaurants(restaurantData.result);
                const allDishesData = await getAllDishes();
                if (allDishesData.statusCode !== 200) {
                    throw new Error("Failed to get dishes");
                }
                setDishes(allDishesData.result);
            } catch (error) {
                setSnackbarMessage("Failed to get data. Please wait and try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        };
        fetchData();
        fetchDeliveryCategories();
        fetchDeliveryTypes();
    }, []);

    useEffect(() => {
        if (selectedRestaurant || selectedDeliveryCategory || selectedDeliveryType) {
            setApplyDisabled(false);
            setClearDisabled(false);
        } else {
            setApplyDisabled(true);
            setClearDisabled(true);
        }
    }, [selectedRestaurant, selectedDeliveryCategory, selectedDeliveryType]);

    const fetchDeliveryCategories = async () => {
        try {
            const data = await getAllDeliveryCategories();
            if (data.statusCode !== 200) {
                throw new Error("Failed to get categories");
            }
            setDeliveryCategories(data.result);
        } catch (error) {
            setSnackbarMessage("Failed to get categories. Please wait and try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const fetchDeliveryTypes = async () => {
        try {
            const data = await getDropdownByModuleAndType("Delivery", "DishType");
            if (data.statusCode !== 200) {
                throw new Error("Failed to get Types");
            }
            setDeliveryTypes(data.result);
        } catch (error) {
            setSnackbarMessage("Failed to get types. Please wait and try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const fetchAllDishes = async () => {
        try {
            const dishesData = await getAllDishes();
            if (dishesData.statusCode !== 200) {
                throw new Error("Failed to get dishes");
            }
            setDishes(dishesData.result);
        } catch (error) {
            setSnackbarMessage("Failed to get dishes");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleApply = async () => {
        try {
            const data = await getDeliveryMenu(selectedRestaurant, selectedDeliveryType, selectedDeliveryCategory);
            if (data.statusCode !== 200) {
                throw new Error("Failed to get menu items");
            }
            setDishes(data.result);
        } catch (error) {
            setSnackbarMessage("Failed to get menu items. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    return (
        <Box p={3} pt={1}>
            <h1>Delivery Menu Page</h1>
            <Grid container spacing={2}>
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
                        <FormControl fullWidth style={{ marginRight: '8px' }}>
                            <InputLabel id="deliveryTypeLabel">Type</InputLabel>
                            <Select
                                labelId="deliveryTypeLabel"
                                id="deliveryType"
                                value={selectedDeliveryType}
                                onChange={(e) => setSelectedDeliveryType(e.target.value)}
                                label="Delivery Type"
                                name="deliveryType"
                                input={<OutlinedInput label="Type" />}
                            >
                                {deliveryTypes.map(deliveryType => (
                                    <MenuItem key={deliveryType.dropdownId} value={deliveryType.value}>
                                        {deliveryType.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth style={{ marginRight: '8px' }}>
                            <InputLabel id="deliveryCategoryLabel">Category</InputLabel>
                            <Select
                                labelId="deliveryCategoryLabel"
                                id="deliveryCategory"
                                value={selectedDeliveryCategory}
                                onChange={(e) => setSelectedDeliveryCategory(e.target.value)}
                                label="Delivery Category"
                                name="deliveryCategoryId"
                                input={<OutlinedInput label="Category" />}
                            >
                                {deliveryCategories.map(category => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApply}
                            disabled={applyDisabled}
                            style={{ marginRight: '8px', height: '100%', padding: '15px' }}
                        >
                            Search
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ height: '100%', padding: '15px' }}
                            onClick={() => {
                                setSelectedRestaurant("");
                                setSelectedDeliveryType("");
                                setSelectedDeliveryCategory("");
                                setDishes([]);
                                fetchAllDishes();
                            }}
                            disabled={clearDisabled}
                        >
                            Clear
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        {dishes.length > 0 ? dishes.map((dish) => (
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
                                        <Typography variant="h5">{dish.dishName}</Typography>
                                        <Typography variant="body1">{dish.description}</Typography>
                                        <Typography variant="body1"><b>Type:</b> {dish.deliveryType ? dish.deliveryType : "N/A"}</Typography>
                                        <Typography variant="body1"><b>Category:</b> {dish.deliveryCategory ? dish.deliveryCategory.categoryName : "N/A"}</Typography>
                                        <Typography variant="body1"><b>Price:</b> {dish.price}</Typography>
                                        <Typography variant="body1"><b>Allergy:</b> {dish.allergy ? dish.allergy : "N/A"}</Typography>
                                        <Typography variant="body1"><b>Status:</b> {dish.isAvailable ? "In stock" : "Out of stock"}</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            // onClick={() => addItemToOrder(dish)}
                                            disabled={!dish.isAvailable}
                                        >
                                            Add to Cart
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )) : 
                        (
                            <Grid item xs={12}>
                                <Typography variant="h5">No dishes found</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
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

export default UserPage;
