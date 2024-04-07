import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestaurantTable from "../../components/RestaurantTable";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  getAllRestaurants,
  addNewRestaurant,
  deleteRestaurant,
  updateRestaurant
} from "../../api";

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [editRestaurantId, setEditRestaurantId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [reloadTable, setReloadTable] = useState(false); // State variable to trigger table reload
  const [errors, setErrors] = useState({});
  const [originalCategoryName, setOriginalCategoryName] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrors({}); // Clear the errors
    setOpen(false);
  }

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        if(data.statusCode !== 200) {
          throw new Error("Failed to get restaurants. Please wait and try again.");
        }
        setRestaurants(data.result);
      } catch (error) {
        setSnackbarMessage("Failed to get restaurants. Please wait and try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchRestaurants();
  }, [reloadTable]);

  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  // delete
  const handleDelete = (restaurantId) => {
    setSelectedRestaurant(restaurantId);
    setShowConfirmationModal(true);
  };

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmationModalConfirm = async () => {
    try {
      const result = await deleteRestaurant(selectedRestaurant);
      if(result.statusCode !== 200) {
        throw new Error("Failed to delete restaurant. Please try again.");
      }
      setShowConfirmationModal(false);
      setSnackbarMessage("Successfully delete restaurant");
      setSnackbarSeverity("info");
      setOpenSnackbar(true);
      setReloadTable(prevState => !prevState); // Toggle reloadTable state
    } catch (error) {
      setShowConfirmationModal(false);
      setSnackbarMessage("Failed to delete restaurant");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
  });

  const handleInputChange = (event) => {
    setRestaurantForm({
      ...restaurantForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleEdit = (restaurantId) => {
    const restaurantToEdit = restaurants.find(restaurant => restaurant.restaurantId === restaurantId);
    if (restaurantToEdit) {
      setRestaurantForm({
        name: restaurantToEdit.name,
      });
      setOriginalCategoryName(restaurantToEdit.name);
      handleOpen();
      setEditRestaurantId(restaurantId);
      setShowEditForm(true);
    }
  };

  const resetRestaurantForm = () => {
    setRestaurantForm({
      name: ""
    });
  };

  const handleOpenAddNewRestaurantDialog = () => {
    resetRestaurantForm(); // Reset restaurantForm state to initial empty values
    handleOpen(); // Open the dialog
    setShowEditForm(false); // Ensure edit form is not shown
  };

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.name = restaurantForm.name ? "" : "This field is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await addNewRestaurant(restaurantForm);
        if(result.statusCode !== 200) {
          throw new Error("Failed to add new restaurant");
        }
        handleClose();
        setSnackbarMessage("Successfully added new restaurant");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        setReloadTable(prevState => !prevState); // Toggle reloadTable state
      } catch (error) {
        setSnackbarMessage("Failed to add new restaurant");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await updateRestaurant(editRestaurantId, restaurantForm);
        if(result.statusCode !== 200) {
          throw new Error("Failed to update restaurant");
        }
        handleClose();
        setSnackbarMessage("Successfully update restaurant");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);
        setReloadTable(prevState => !prevState); // Toggle reloadTable state
      } catch (error) {
        setSnackbarMessage("Failed to update restaurant");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <Box p={3} pt={1}>
      <h1>Restaurant Page</h1>
      <Box mb={4}>
        <Grid
          container
          spacing={1}
          alignItems={"center"}
          justifyContent={"flex-end"}
        >
          <Grid item>
            <Box display="flex" gap={2}>
              <Button variant="contained" color="success" onClick={handleOpenAddNewRestaurantDialog}>
                Add New Restaurant
              </Button>
              <Dialog open={open} 
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick') {
                    handleClose();
                  }
                }}
              >
                <DialogTitle fontSize={25} fontWeight="bold">
                  Add New Restaurant
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
                      <Typography variant="h7">Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        required={true}
                        name="name"
                        value={restaurantForm.name}
                        onChange={handleInputChange}
                        fullWidth
                        placeholder="Enter restaurant name"
                        error={Boolean(errors.name)}
                        helperText={errors.name}
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
      <RestaurantTable restaurants={restaurants} onDelete={handleDelete} onEdit={handleEdit} />
      {showEditForm && (
        <Dialog open={open} 
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              handleClose();
            }
          }}
        >
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
                <Typography variant="h7">Name</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required={true}
                  name="name"
                  value={restaurantForm.name}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Enter restaurant name"
                  error={Boolean(errors.name)}
                  helperText={errors.name}
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
        message={"Are you sure you want to delete this restaurant?"}
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

export default RestaurantPage;
