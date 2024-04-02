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
} from "@mui/material";
import DishTable from "../../components/DishTable";
import { getAllRestaurants, getCurrentMenu } from "../../api";

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuType, setMenuType] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getAllRestaurants();
      setRestaurants(data.result);
    };
    fetchRestaurants();
  }, []);

  const handleApply = async () => {
    console.log(typeof selectedRestaurant);
    console.log(typeof menuType);
    const menuTypeNumber = Number(menuType);
    console.log(typeof menuTypeNumber);
    const data = await getCurrentMenu(selectedRestaurant, menuTypeNumber);
    setDishes(data);
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
                  <MenuItem value="1">POS</MenuItem>
                  <MenuItem value="2">Delivery</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setSelectedRestaurant("");
                  setMenuType("");
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
      <DishTable dishes={dishes} />
    </Box>
  );
};

export default RestaurantPage;
