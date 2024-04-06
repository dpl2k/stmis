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
import DineInCategoryTable from "../../components/DineInCategoryTable";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
    getAllDineInCategories,
    addNewDineInCategory,
    deleteDineInCategory,
    updateDineInCategory
} from "../../api";

const DineInCategoryPage = () => {
    const [dineInCategories, setDineInCategories] = useState([]);
    const [selectedDineInCategory, setSelectedDineInCategory] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [editDineInCategoryId, setEditDineInCategoryId] = useState(null);
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
        const fetchDineInCategories = async () => {
            try {
                const data = await getAllDineInCategories();
                if(data.statusCode !== 200) {
                    throw new Error("Failed to get dineInCategories. Please wait and try again.");
                }
                setDineInCategories(data.result);
            } catch (error) {
                setSnackbarMessage("Failed to get dineInCategories. Please wait and try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        };
        fetchDineInCategories();
    }, [reloadTable]);

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);
    };

    // delete
    const handleDelete = (dropdownId) => {
        setSelectedDineInCategory(dropdownId);
        setShowConfirmationModal(true);
    };

    const handleConfirmationModalClose = () => {
        setShowConfirmationModal(false);
    };

    const handleConfirmationModalConfirm = async () => {
        try {
            const result = await deleteDineInCategory(selectedDineInCategory);
            if(result.statusCode !== 200) {
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

    const [dineInCategoryForm, setDineInCategoryForm] = useState({
        categoryName: "",
        parentCategoryId: null,
    });

    const handleInputChange = (event) => {
        const newValue = (event.target.value) ? event.target.value : null;
        setDineInCategoryForm({
            ...dineInCategoryForm,
            [event.target.name]: newValue,
        });
    };

    const handleEdit = (categoryId) => {
        const dineInCategoryToEdit = dineInCategories.find(dineInCategory => dineInCategory.categoryId === categoryId);
        if (dineInCategoryToEdit) {
            setDineInCategoryForm({
                categoryName: dineInCategoryToEdit.categoryName,
                parentCategoryId: dineInCategoryToEdit.parentCategory ? dineInCategoryToEdit.parentCategory.categoryId : null,
            });
            setOriginalCategoryName(dineInCategoryToEdit.categoryName); // Set the original category name
            handleOpen();
            setEditDineInCategoryId(categoryId);
            setShowEditForm(true);
        }
    };

    const resetDineInCategoryForm = () => {
        setDineInCategoryForm({
            categoryName: "",
            parentCategoryId: null,
        });
    };

    const handleOpenAddNewDineInCategoryForm = () => {
        resetDineInCategoryForm(); // Reset dineInCategoryForm state to initial empty values
        handleOpen(); // Open the dialog
        setShowEditForm(false); // Ensure edit form is not shown
    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.name = dineInCategoryForm.categoryName ? "" : "This field is required.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const result = await addNewDineInCategory(dineInCategoryForm);
                if(result.statusCode !== 200) {
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
                const result = await updateDineInCategory(editDineInCategoryId, dineInCategoryForm);
                if(result.statusCode !== 200) {
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
            <h1>DineInCategory Page</h1>
            <Box mb={4}>
                <Grid
                    container
                    spacing={1}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                >
                    <Grid item>
                        <Box display="flex" gap={2}>
                            <Button variant="contained" color="success" onClick={handleOpenAddNewDineInCategoryForm}>
                                Add New DineInCategory
                            </Button>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle fontSize={25} fontWeight="bold">
                                    Add New DineInCategory
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
                                                value={dineInCategoryForm.categoryName}
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
                                                    value={dineInCategoryForm.parentCategoryId || ''}
                                                    onChange={handleInputChange}
                                                    label="Parent Category"
                                                    name="parentCategoryId"
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
            <DineInCategoryTable dineInCategories={dineInCategories} onDelete={handleDelete} onEdit={handleEdit} />
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
                                    value={dineInCategoryForm.categoryName}
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
                                        value={dineInCategoryForm.parentCategoryId || ''}
                                        onChange={handleInputChange}
                                        label="Parent Category"
                                        name="parentCategoryId"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        {dineInCategories
                                            .filter(category => category.categoryId !== editDineInCategoryId) // Exclude the current edit category
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

export default DineInCategoryPage;
