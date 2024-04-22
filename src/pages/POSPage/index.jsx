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
    IconButton, 
    TextField,
    useMediaQuery,
    useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { 
    getAllRestaurants,
    getAllDishes,
    getDropdownByModuleAndType,
    getAllDineInCategories,
    getPOSMenu
} from "../../api";
import "../POSPage/POSPage.css";

const POSPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [dineInCategories, setDineInCategories] = useState([]);
    const [selectedDineInCategory, setSelectedDineInCategory] = useState("");
    const [dineInTypes, setDineInTypes] = useState([]);
    const [selectedDineInType, setSelectedDineInType] = useState("");
    const [applyDisabled, setApplyDisabled] = useState(true);
    const [clearDisabled, setClearDisabled] = useState(true);
    const [dishes, setDishes] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [orderItems, setOrderItems] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        fetchDineInCategories();
        fetchDineInTypes();
    }, []);

    useEffect(() => {
        if (selectedRestaurant || selectedDineInType || selectedDineInCategory || searchTerm) {
            setApplyDisabled(false);
            setClearDisabled(false);
        } else {
            setApplyDisabled(true);
            setClearDisabled(true);
        }
    }, [selectedRestaurant, selectedDineInType, selectedDineInCategory, searchTerm]);

    const fetchDineInCategories = async () => {
        try {
            const data = await getAllDineInCategories();
            if (data.statusCode !== 200) {
                throw new Error("Failed to get categories");
            }
            setDineInCategories(data.result);
        } catch (error) {
            setSnackbarMessage("Failed to get categories");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const fetchDineInTypes = async () => {
        try {
            const data = await getDropdownByModuleAndType("DineIn", "DishType");
            if (data.statusCode !== 200) {
                throw new Error("Failed to get Types");
            }
            setDineInTypes(data.result);
        } catch (error) {
            setSnackbarMessage("Failed to get Types");
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
            const data = await getPOSMenu(selectedRestaurant, selectedDineInType, selectedDineInCategory);
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

    const addItemToOrder = (item) => {
        const updatedOrder = [...orderItems];
        const existingIndex = updatedOrder.findIndex(orderItem => orderItem.dishId === item.dishId);
        if (existingIndex !== -1) {
            updatedOrder[existingIndex].quantity++;
        } else {
            updatedOrder.push({ ...item, quantity: 1 });
        }
        setOrderItems(updatedOrder);
        const totalAmount = updatedOrder.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
        setPaymentAmount(totalAmount.toFixed(2));
    };

    const removeItemFromOrder = (itemId) => {
        const updatedOrder = orderItems.filter(item => item.dishId !== itemId);
        setOrderItems(updatedOrder);
        const totalAmount = updatedOrder.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
        setPaymentAmount(totalAmount.toFixed(2));
    };

    return (
        <Box p={3} pt={1}>
            <h1>POS Menu Page</h1>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Box mb={4} style={{ backgroundColor: "lightyellow" }}>
                        <Typography variant="h4" style={{ color:"red"}}>Payment section</Typography>
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
                                            <Typography variant="body2">{item.dishName}</Typography>
                                            <Typography variant="body2">Price: ${item.price}</Typography>
                                            <Typography variant="body2">Quantity: {item.quantity}</Typography>
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
                </Grid>
                <Grid item xs={12} md={9}>
                    <Box mb={4} display="flex" gap={1} alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
                        <FormControl fullWidth style={{ width: '100%'}}>
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
                        <FormControl fullWidth style={{ width: '100%' }}>
                            <InputLabel id="dineInTypeLabel">Type</InputLabel>
                            <Select
                                labelId="dineInTypeLabel"
                                id="dineInType"
                                value={selectedDineInType}
                                onChange={(e) => setSelectedDineInType(e.target.value)}
                                label="DineIn Type"
                                name="dineInType"
                                input={<OutlinedInput label="Type" />}
                            >
                                {dineInTypes.map(dineInType => (
                                    <MenuItem key={dineInType.dropdownId} value={dineInType.value}>
                                        {dineInType.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth style={{ width: '100%' }}>
                            <InputLabel id="dineInCategoryLabel">Category</InputLabel>
                            <Select
                                labelId="dineInCategoryLabel"
                                id="dineInCategory"
                                value={selectedDineInCategory}
                                onChange={(e) => setSelectedDineInCategory(e.target.value)}
                                label="DineIn Category"
                                name="dineInCategoryId"
                                input={<OutlinedInput label="Category" />}
                            >
                                {dineInCategories.map(category => (
                                    <MenuItem key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth style={{ width: '100%' }}>
                            <TextField
                                label="Search for dish"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApply}
                            disabled={applyDisabled}
                            style={{ width: '100%', height: '100%', padding: '15px' }}
                        >
                            Search
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ width: '100%', height: '100%', padding: '15px' }}
                            onClick={() => {
                                setSelectedRestaurant("");
                                setSelectedDineInCategory("");
                                setSelectedDineInType("");
                                setDishes([]);
                                setSearchTerm("");
                                fetchAllDishes();
                            }}
                            disabled={clearDisabled}
                        >
                            Clear
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        {dishes.length > 0 ? dishes.filter(dish => dish.dishName.toLowerCase().includes(searchTerm.toLowerCase())).map((dish) => (
                            <Grid item key={dish.dishId} xs={12} sm={6} md={4} lg={3}>
                                <Card className="fullHeightCard">
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        width="300"
                                        image={dish.imageUrl}
                                        alt={dish.dishName}
                                    />
                                    <CardContent className="content">
                                        <div>
                                            <Typography className="typo" variant="h5" style={{ fontWeight: 600 }}>{dish.dishName}</Typography>
                                            <Typography className="typo" variant="body1">{dish.description}</Typography>
                                            <Typography className="typo" variant="body1"><b>Type:</b> {dish.dineInType ? dish.dineInType : "N/A"}</Typography>
                                            <Typography className="typo" variant="body1"><b>Category:</b> {dish.dineInCategory ? dish.dineInCategory.categoryName : "N/A"}</Typography>
                                            <Typography className="typo" variant="body1"><b>Price:</b> {dish.price}</Typography>
                                            <Typography className="typo" variant="body1"><b>Allergy:</b> {dish.allergy ? dish.allergy : "N/A"}</Typography>
                                            <Typography className="typo" variant="body1"><b>Status:</b> {dish.isAvailable ? "In stock" : "Out of stock"}</Typography>
                                        </div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => addItemToOrder(dish)}
                                            disabled={!dish.isAvailable}
                                        >
                                            Add to Order
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

export default POSPage;
