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
import DishTable from "../../components/DishTable";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  getAllDishes,
  addNewDish,
  deleteDish,
  updateDish,
  getAllDeliveryCategories,
  getAllDineInCategories
} from "../../api";

const DishPage = () => {
  const [dishes, setDishes] = useState([]);
  const [deliveryCategories, setDeliveryCategories] = useState([]);
  const [dineInCategories, setDineInCategories] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [editDishId, setEditDishId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [reloadTable, setReloadTable] = useState(false); // State variable to trigger table reload
  const [originalCategoryName, setOriginalCategoryName] = useState("");
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrors({}); // Clear the errors
    setOpen(false);
  }

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await getAllDishes();
        if (data.statusCode !== 200) {
          throw new Error("Failed to get dishes. Please wait and try again.");
        } 
        setDishes(data.result);
      } catch (error) {
        setSnackbarMessage("Failed to get dishes. Please wait and try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchDishes();
    fetchDeliveryCategories();
    fetchDineInCategories();
  }, [reloadTable]);

  const fetchDeliveryCategories = async () => {
    try {
      const data = await getAllDeliveryCategories();
      if (data.statusCode !== 200) {
        throw new Error("Failed to get delivery categories. Please wait and try again.");
      }
      setDeliveryCategories(data.result);
    } catch (error) {
      setSnackbarMessage("Failed to get delivery categories. Please wait and try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const fetchDineInCategories = async () => {
    try {
      const data = await getAllDineInCategories();
      if (data.statusCode !== 200) {
        throw new Error("Failed to get dine in categories. Please wait and try again.");
      }
      setDineInCategories(data.result);
    } catch (error) {
      setSnackbarMessage("Failed to get dine in categories. Please wait and try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };


  const handleDelete = (dishId) => {
    setSelectedDish(dishId);
    setShowConfirmationModal(true);
  };

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmationModalConfirm = async () => {
    try {
      const result = await deleteDish(selectedDish);
      if (result.statusCode !== 200) {
        throw new Error("Failed to delete dish. Please try again.");
      }
      setShowConfirmationModal(false);
      setSnackbarMessage("Successfully delete dish");
      setSnackbarSeverity("info");
      setOpenSnackbar(true);
      setReloadTable(prevState => !prevState); // Toggle reloadTable state
    } catch (error) {
      setShowConfirmationModal(false);
      setSnackbarMessage("Failed to delete dish");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const [dishForm, setDishForm] = useState({
    dishName: "",
    shortName: "",
    englishName: "",
    koreanName: "",
    description: "",
    allergy: "",
    price: null,
    imageUrl: "",
    dineInType: "",
    deliveryType: "",
    isAvailable: false,
    sellingDate: null,
    dineInCategoryId: null,
    deliveryCategoryId: null,
  });

  const handleInputChange = (event) => {
    const newValue = (event.target.value) ? event.target.value : null;
    setDishForm({
      ...dishForm,
      [event.target.name]: newValue,
    });
  };

  const handleCheckboxChange = (event) => {
    setDishForm({
      ...dishForm,
      [event.target.name]: event.target.checked,
    });
  };

  const handleEdit = (dishId) => {
    const dishToEdit = dishes.find(dish => dish.dishId === dishId);
    console.log(dishToEdit);
    if (dishToEdit) {
      setDishForm({
        dishName: dishToEdit.dishName,
        shortName: dishToEdit.shortName,
        englishName: dishToEdit.englishName,
        koreanName: dishToEdit.koreanName,
        description: dishToEdit.description,
        allergy: dishToEdit.allergy,
        price: dishToEdit.price,
        imageUrl: dishToEdit.imageUrl,
        isAvailable: dishToEdit.isAvailable,
        sellingDate: dishToEdit.sellingDate,
        dineInCategoryId: dishToEdit.dineInCategory ? dishToEdit.dineInCategory.categoryId: null,
        deliveryCategoryId: dishToEdit.deliveryCategory ? dishToEdit.deliveryCategory.categoryId: null,
      });
      setOriginalCategoryName(dishToEdit.dishName);
      handleOpen();
      setEditDishId(dishId);
      setShowEditForm(true);
    }
  };

  const resetDishForm = () => {
    setDishForm({
      dishName: "",
      shortName: "",
      englishName: "",
      koreanName: "",
      description: "",
      allergy: "",
      price: null,
      imageUrl: "",
      dineInType: "",
      deliveryType: "",
      isAvailable: false,
      sellingDate: null,
      dineInCategoryId: null,
      deliveryCategoryId: null,
    });
  };

  const handleOpenAddNewDishDialog = () => {
    resetDishForm(); // Reset dishForm state to initial empty values
    handleOpen(); // Open the dialog
    setShowEditForm(false); // Ensure edit form is not shown
  };

  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.dishName = dishForm.dishName ? "" : "This field is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await addNewDish(dishForm);
        if (result.statusCode !== 200) {
          throw new Error("Failed to add new dish. Please try again.");
        }
        setSnackbarMessage("Successfully added new dish");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleClose();
        setReloadTable(prevState => !prevState); // Toggle reloadTable state
      } catch (error) {
        setSnackbarMessage("Failed to add new dish");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await updateDish(editDishId, dishForm);
        if (result.statusCode !== 200) {
          throw new Error("Failed to update dish. Please try again.");
        }
        setSnackbarMessage("Successfully updated dish");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleClose();
        setReloadTable(prevState => !prevState); // Toggle reloadTable state
      } catch (error) {
        setSnackbarMessage("Failed to update dish");
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
              <Button variant="contained" color="success" onClick={handleOpenAddNewDishDialog}>
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
                        name="allergy"
                        value={dishForm.allergy}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter allergic warning"
                        error={Boolean(errors.allergy)}
                        helperText={errors.allergy}
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
                      <Typography variant="h7">DineIn Type</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="dineInType"
                        value={dishForm.dineInType}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter dineIn type"
                        error={Boolean(errors.dineInType)}
                        helperText={errors.dineInType}
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
                      <Typography variant="h7">Delivery Type</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="deliveryType"
                        value={dishForm.deliveryType}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter delivery type"
                        error={Boolean(errors.deliveryType)}
                        helperText={errors.deliveryType}
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
                        name="imageUrl"
                        value={dishForm.imageUrl}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter imageUrl URL"
                        error={Boolean(errors.imageUrl)}
                        helperText={errors.imageUrl}
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
                            checked={dishForm.isAvailable}
                            onChange={handleCheckboxChange}
                            name="isAvailable"
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
                      <Typography variant="h7">DineIn Category</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      {/* <TextField
                        required={true}
                        name="dineInCategory"
                        value={dishForm.dineInCategory}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter DineIn Category"
                        error={Boolean(errors.dineInCategory)}
                        helperText={errors.dineInCategory}
                      /> */}
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="dineInCategoryLabel">DineInCategory</InputLabel>
                        <Select
                          labelId="dineInCategoryLabel"
                          id="dineInCategory"
                          value={dishForm.dineInCategoryId || ''}
                          onChange={handleInputChange}
                          label="DineIn Category"
                          name="dineInCategoryId"
                        >
                          <MenuItem value="">None</MenuItem>
                          {dineInCategories.map(category => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                              {category.categoryName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      display="flex"
                      alignItems="center"
                    >
                      <Typography variant="h7">Delivery Category</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      {/* <TextField
                        required={true}
                        name="deliveryCategory"
                        value={dishForm.deliveryCategory}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter Delivery Category"
                        error={Boolean(errors.deliveryCategory)}
                        helperText={errors.deliveryCategory}
                      /> */}
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="deliveryCategoryLabel">DeliveryCategory</InputLabel>
                        <Select
                          labelId="deliveryCategoryLabel"
                          id="deliveryCategory"
                          value={dishForm.deliveryCategoryId || ''}
                          onChange={handleInputChange}
                          label="Delivery Category"
                          name="deliveryCategoryId"
                        >
                          <MenuItem value="">None</MenuItem>
                          {deliveryCategories.map(category => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                              {category.categoryName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
      <DishTable dishes={dishes} isAdmin={true} onDelete={handleDelete} onEdit={handleEdit} />
      {showEditForm && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle fontSize={25} fontWeight="bold">
            Edit {originalCategoryName}
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
                  name="allergy"
                  value={dishForm.allergy}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Enter allergic warning"
                  error={Boolean(errors.allergy)}
                  helperText={errors.allergy}
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
                <Typography variant="h7">DineIn Type</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required={true}
                  name="dineInType"
                  value={dishForm.dineInType}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Enter dineIn type"
                  error={Boolean(errors.dineInType)}
                  helperText={errors.dineInType}
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
                <Typography variant="h7">Delivery Type</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required={true}
                  name="deliveryType"
                  value={dishForm.deliveryType}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Enter delivery type"
                  error={Boolean(errors.deliveryType)}
                  helperText={errors.deliveryType}
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
                  name="imageUrl"
                  value={dishForm.imageUrl}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Enter imageUrl URL"
                  error={Boolean(errors.imageUrl)}
                  helperText={errors.imageUrl}
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
                      checked={dishForm.isAvailable}
                      onChange={handleCheckboxChange}
                      name="isAvailable"
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
                  value={dishForm.sellingDate ? dishForm.sellingDate.split('T')[0] : ''}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Enter selling date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
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
                <Typography variant="h7">DineIn Category</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                {/* <TextField
                  required={true}
                  name="dineInCategory"
                  value={dishForm.dineInCategory}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Enter DineIn Category"
                  error={Boolean(errors.dineInCategory)}
                  helperText={errors.dineInCategory}
                /> */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="dineInCategoryLabel">DineInCategory</InputLabel>
                  <Select
                    labelId="dineInCategoryLabel"
                    id="dineInCategory"
                    value={dishForm.dineInCategoryId || ''}
                    onChange={handleInputChange}
                    label="DineIn Category"
                    name="dineInCategoryId"
                  >
                    <MenuItem value="">None</MenuItem>
                    {dineInCategories.map(category => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                container
                display="flex"
                alignItems="center"
              >
                <Typography variant="h7">Delivery Category</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                {/* <TextField
                  required={true}
                  name="deliveryCategory"
                  value={dishForm.deliveryCategory}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Enter Delivery Category"
                  error={Boolean(errors.deliveryCategory)}
                  helperText={errors.deliveryCategory}
                /> */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="deliveryCategoryLabel">DeliveryCategory</InputLabel>
                  <Select
                    labelId="deliveryCategoryLabel"
                    id="deliveryCategory"
                    value={dishForm.deliveryCategoryId || ''}
                    onChange={handleInputChange}
                    label="Delivery Category"
                    name="deliveryCategoryId"
                  >
                    <MenuItem value="">None</MenuItem>
                    {deliveryCategories.map(category => (
                      <MenuItem key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
              onClick={handleEditSubmit}
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <ConfirmationModal
        open={showConfirmationModal}
        message={"Are you sure you want to delete this dish?"}
        onCancel={handleConfirmationModalClose}
        onConfirm={handleConfirmationModalConfirm}
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

export default DishPage;