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
    Alert,
    FormControl,
    Select,
    MenuItem,
    InputLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeliveryCategoryTable from "../../components/DeliveryCategoryTable";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
    getAllDeliveryCategories,
    addNewDeliveryCategory,
    deleteDeliveryCategory,
    updateDeliveryCategory
} from "../../api";

const DeliveryCategoryPage = () => {
    const [deliveryCategories, setDeliveryCategories] = useState([]);
    const [selectedDeliveryCategory, setSelectedDeliveryCategory] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [editDeliveryCategoryId, setEditDeliveryCategoryId] = useState(null);
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
        const fetchDeliveryCategories = async () => {
            try {
                const data = await getAllDeliveryCategories();
                if (data.statusCode !== 200) {
                    throw new Error("Failed to get deliveryCategories. Please wait and try again.");
                }
                setDeliveryCategories(data.result);
            } catch (error) {
                setSnackbarMessage("Failed to get deliveryCategories. Please wait and try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        };
        fetchDeliveryCategories();
    }, [reloadTable]);

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);
    };

    // delete
    const handleDelete = (dropdownId) => {
        setSelectedDeliveryCategory(dropdownId);
        setShowConfirmationModal(true);
    };

    const handleConfirmationModalClose = () => {
        setShowConfirmationModal(false);
    };

    const handleConfirmationModalConfirm = async () => {
        try {
            const result = await deleteDeliveryCategory(selectedDeliveryCategory);
            if (result.statusCode !== 200) {
                throw new Error("Failed to delete dineInCategory");
            }
            setShowConfirmationModal(false);
            setSnackbarMessage("Successfully delete dineInCategory");
            setSnackbarSeverity("info");
            setOpenSnackbar(true);
            setReloadTable(prevState => !prevState); // Toggle reloadTable state
        } catch (error) {
            setShowConfirmationModal(false);
            setSnackbarMessage("Failed to delete dineInCategory");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const [deliveryCategoryForm, setDeliveryCategoryForm] = useState({
        categoryName: "",
        parentCategoryId: null,
    });

    const handleInputChange = (event) => {
        const newValue = (event.target.value) ? event.target.value : null;
        setDeliveryCategoryForm({
            ...deliveryCategoryForm,
            [event.target.name]: newValue,
        });
    };

    const handleEdit = (categoryId) => {
        const deliveryCategoryToEdit = deliveryCategories.find(deliveryCategory => deliveryCategory.categoryId === categoryId);
        if (deliveryCategoryToEdit) {
            setDeliveryCategoryForm({
                categoryName: deliveryCategoryToEdit.categoryName,
                parentCategoryId: deliveryCategoryToEdit.parentCategory ? deliveryCategoryToEdit.parentCategory.categoryId : null,
            });
            setOriginalCategoryName(deliveryCategoryToEdit.categoryName); // Set the original category name
            handleOpen();
            setEditDeliveryCategoryId(categoryId);
            setShowEditForm(true);
        }
    };

    const resetDeliveryCategoryForm = () => {
        setDeliveryCategoryForm({
            categoryName: "",
            parentCategoryId: null,
        });
    };

    const handleOpenAddNewDeliveryCategoryForm = () => {
        resetDeliveryCategoryForm(); // Reset deliveryCategoryForm state to initial empty values
        handleOpen(); // Open the dialog
        setShowEditForm(false); // Ensure edit form is not shown
    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.name = deliveryCategoryForm.categoryName ? "" : "This field is required.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const result = await addNewDeliveryCategory(deliveryCategoryForm);
                if (result.statusCode !== 200) {
                    throw new Error("Failed to add new dineInCategory");
                }
                handleClose();
                setSnackbarMessage("Successfully added new dineInCategory");
                setSnackbarSeverity("info");
                setOpenSnackbar(true);
                setReloadTable(prevState => !prevState); // Toggle reloadTable state

            } catch (error) {
                setSnackbarMessage("Failed to add new dineInCategory");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const result = await updateDeliveryCategory(editDeliveryCategoryId, deliveryCategoryForm);
                if (result.statusCode !== 200) {
                    throw new Error("Failed to update dineInCategory");
                }
                handleClose();
                setSnackbarMessage("Successfully update dineInCategory");
                setSnackbarSeverity("info");
                setOpenSnackbar(true);
                setReloadTable(prevState => !prevState); // Toggle reloadTable state
            } catch (error) {
                setSnackbarMessage("Failed to update dineInCategory");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        }
    };

    return (
        <Box p={3} pt={1}>
            <h1>DeliveryCategory Page</h1>
            <Box mb={4}>
                <Grid
                    container
                    spacing={1}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                >
                    <Grid item>
                        <Box display="flex" gap={2}>
                            <Button variant="contained" color="success" onClick={handleOpenAddNewDeliveryCategoryForm}>
                                Add New DeliveryCategory
                            </Button>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle fontSize={25} fontWeight="bold">
                                    Add New DeliveryCategory
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
                                                name="categoryName"
                                                value={deliveryCategoryForm.categoryName}
                                                onChange={handleInputChange}
                                                fullWidth
                                                placeholder="Enter dineIn category name"
                                                error={Boolean(errors.categoryName)}
                                                helperText={errors.categoryName}
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
                                            <Typography variant="h7">Parent Category</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel id="parentCategoryLabel">Parent Category</InputLabel>
                                                <Select
                                                    labelId="parentCategoryLabel"
                                                    id="parentCategory"
                                                    value={deliveryCategoryForm.parentCategoryId || ''}
                                                    onChange={handleInputChange}
                                                    label="Parent Category"
                                                    name="parentCategoryId"
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
            <DeliveryCategoryTable deliveryCategories={deliveryCategories} onDelete={handleDelete} onEdit={handleEdit} />
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
                                <Typography variant="h7">Name</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    required={true}
                                    name="categoryName"
                                    value={deliveryCategoryForm.categoryName}
                                    onChange={handleInputChange}
                                    fullWidth
                                    placeholder="Enter dineIn category name"
                                    error={Boolean(errors.categoryName)}
                                    helperText={errors.categoryName}
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
                                <Typography variant="h7">Parent Category</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="parentCategoryLabel">Parent Category</InputLabel>
                                    <Select
                                        labelId="parentCategoryLabel"
                                        id="parentCategory"
                                        value={deliveryCategoryForm.parentCategoryId || ''}
                                        onChange={handleInputChange}
                                        label="Parent Category"
                                        name="parentCategoryId"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        {deliveryCategories
                                            .filter(category => category.categoryId !== editDeliveryCategoryId) // Exclude the current edit category
                                            .map(category => (
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
                message={"Are you sure you want to delete this dropdown?"}
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

export default DeliveryCategoryPage;
