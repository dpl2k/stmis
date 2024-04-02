import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Grid,
  OutlinedInput,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DishForm from "../../components/DishForm";
import DishTable from "../../components/DishTable";
import ConfirmationModal from "../../components/ConfirmationModal";
import UpdateMenuModal from "../../components/UpdateMenuModal";
import {
  getAllRestaurants,
  getCurrentMenu,
  addNewDish,
  deleteDish,
  updateDish,
  updateMenu,
} from "../../api";

const AdminPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuType, setMenuType] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showUpdateMenuModal, setShowUpdateMenuModal] = useState(false);
  const [editDishId, setEditDishId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [errors, setErrors] = useState({});

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrors({}); // Clear the errors
    setOpen(false);
  }


  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getAllRestaurants();
      setRestaurants(data.result);
    };
    fetchRestaurants();
  }, []);

  const handleApply = async () => {
    const menuTypeNumber = Number(menuType);
    const data = await getCurrentMenu(selectedRestaurant, menuTypeNumber);
    setDishes(data);
  };

  const handleDelete = (dishId) => {
    setSelectedDish(dishId);
    setShowConfirmationModal(true);
  };

  const handleEdit = (dishId) => {
    setEditDishId(dishId);
    setShowEditForm(true);
  };

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmationModalConfirm = async () => {
    await deleteDish(selectedDish);
    handleApply(); // Refresh the dishes
    setShowConfirmationModal(false);
  };

  const handleUpdateMenu = () => {
    setShowUpdateMenuModal(true);
  };

  const handleUpdateMenuModalClose = () => {
    setShowUpdateMenuModal(false);
  };

  const handleUpdateMenuModalConfirm = async () => {
    await updateMenu(selectedRestaurant, menuType);
    handleApply(); // Refresh the dishes
    setShowUpdateMenuModal(false);
  };

  const [dishForm, setDishForm] = useState({
    dishName: "",
    shortName: "",
    englishName: "",
    koreanName: "",
    description: "",
    allergicWarning: "",
    price: "",
    image: "",
    availableStatus: false,
    sellingDate: "",
    type: "",
  });

  const handleInputChange = (event) => {
    setDishForm({
      ...dishForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleCheckboxChange = (event) => {
    setDishForm({
      ...dishForm,
      [event.target.name]: event.target.checked,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.dishName = dishForm.dishName ? "" : "This field is required.";
    tempErrors.shortName = dishForm.shortName ? "" : "This field is required.";
    tempErrors.englishName = dishForm.englishName ? "" : "This field is required.";
    tempErrors.koreanName = dishForm.koreanName ? "" : "This field is required.";
    tempErrors.price = dishForm.price ? "" : "This field is required.";
    tempErrors.sellingDate = dishForm.sellingDate ? "" : "This field is required.";
    tempErrors.type = dishForm.type ? "" : "This field is required.";
    tempErrors.image = dishForm.image ? "" : "This field is required.";
    tempErrors.description = dishForm.description ? "" : "This field is required.";
    tempErrors.allergicWarning = dishForm.allergicWarning ? "" : "This field is required.";
    tempErrors.availableStatus = dishForm.availableStatus ? "" : "This field is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await addNewDish(dishForm);
        setSnackbarMessage("Successfully added new dish");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleClose();
      } catch (error) {
        setSnackbarMessage("Failed to add new dish");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };


  return (
    <Box p={3} pt={1}>
      <h1>Admin Page</h1>
      <Box mb={4}>
        <Grid
          container
          spacing={1}
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
              <Button variant="contained" color="success" onClick={handleOpen}>
                Add New Dish
              </Button>

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle fontSize={25} fontWeight="bold">
                  Add New Dish
                  <IconButton
                    style={{ position: "absolute", right: "8px", top: "8px" }}
                    onClick={handleClose}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Dish Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="dishName"
                        value={dishForm.dishName}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter dish name"
                        error={Boolean(errors.dishName)}
                        helperText={errors.dishName}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Short Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="shortName"
                        value={dishForm.shortName}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter short name"
                        error={Boolean(errors.shortName)}
                        helperText={errors.shortName}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">English Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="englishName"
                        value={dishForm.englishName}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter English name"
                        error={Boolean(errors.englishName)}
                        helperText={errors.englishName}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Korean Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="koreanName"
                        value={dishForm.koreanName}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter Korean name"
                        error={Boolean(errors.koreanName)}
                        helperText={errors.koreanName}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Description</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="description"
                        value={dishForm.description}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter description"
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Allergic Warning</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="allergicWarning"
                        value={dishForm.allergicWarning}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter allergic warning"
                        error={Boolean(errors.allergicWarning)}
                        helperText={errors.allergicWarning}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Price</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="price"
                        value={dishForm.price}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter price"
                        type="number"
                        error={Boolean(errors.price)}
                        helperText={errors.price}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Image</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="image"
                        value={dishForm.image}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter image URL"
                        error={Boolean(errors.image)}
                        helperText={errors.image}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Available Status</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={dishForm.availableStatus}
                            onChange={handleCheckboxChange}
                            name="availableStatus"
                          />
                        }
                        label=""
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Selling Date</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="sellingDate"
                        value={dishForm.sellingDate}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter selling date"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: new Date().toISOString().split("T")[0], // Set the minimum date to today's date
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                        error={Boolean(errors.sellingDate)}
                        helperText={errors.sellingDate}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Type</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="type"
                        value={dishForm.type}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter type"
                        error={Boolean(errors.type)}
                        helperText={errors.type}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    color="error"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    onClick={handleSubmit}
                    variant="contained"
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* <DishForm onSubmit={handleApply} /> */}
      <DishTable dishes={dishes} onDelete={handleDelete} onEdit={handleEdit} />
      {showEditForm && (
        <DishForm
          initialData={dishes.find((dish) => dish.id === editDishId)}
          onSubmit={async (updatedData) => {
            await updateDish(editDishId, updatedData);
            setShowEditForm(false);
            handleApply(); // Refresh the dishes
          }}
        />
      )}
      <Box mt={4}>
        <Grid
          container
          spacing={1}
          alignItems={"center"}
          justifyContent={"flex-end"}
        >
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleUpdateMenu}>
              Update Menu
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ConfirmationModal
        open={showConfirmationModal}
        message={"Are you sure you want to delete this dish?"}
        onCancel={handleConfirmationModalClose}
        onConfirm={handleConfirmationModalConfirm}
      />
      <UpdateMenuModal
        open={showUpdateMenuModal}
        message={"Are you sure you want to update the menu?"}
        onCancel={handleUpdateMenuModalClose}
        onConfirm={handleUpdateMenuModalConfirm}
      />
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

export default AdminPage;
