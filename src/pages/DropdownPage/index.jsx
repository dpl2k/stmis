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
    FormControlLabel,
    Checkbox,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
    FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DropdownTable from "../../components/DropdownTable";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
    getAllDropdowns,
    addNewDropdown,
    deleteDropdown,
    updateDropdown
} from "../../api";

const DropdownPage = () => {
    const [dropdowns, setDropdowns] = useState([]);
    const [selectedDropdown, setSelectedDropdown] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [editDropdownId, setEditDropdownId] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [reloadTable, setReloadTable] = useState(false); // State variable to trigger table reload
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [originalCategoryName, setOriginalCategoryName] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setErrors({}); // Clear the errors
        setOpen(false);
    }

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const data = await getAllDropdowns();
                if(data.statusCode !== 200) {
                    throw new Error("Failed to get dropdowns. Please wait and try again.");
                }
                setDropdowns(data.result);
            } catch (error) {
                setSnackbarMessage("Failed to get dropdowns. Please wait and try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        };
        fetchDropdowns();
    }, [reloadTable]);

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);
    };

    // delete
    const handleDelete = (dropdownId) => {
        setSelectedDropdown(dropdownId);
        setShowConfirmationModal(true);
    };

    const handleConfirmationModalClose = () => {
        setShowConfirmationModal(false);
    };

    const handleConfirmationModalConfirm = async () => {
        try {
            const result = await deleteDropdown(selectedDropdown);
            if (result.statusCode !== 200) {
                throw new Error("Failed to delete dropdown. Please try again.");
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

    const [dropdownForm, setDropdownForm] = useState({
        name: "",
        value: "",
        type: "",
        module: "",
        description: "",
        isActive: false,
    });

    const handleInputChange = (event) => {
        setErrors({});
        const { name, value } = event.target;
        if (name === 'name') {
            setDropdownForm({
                ...dropdownForm,
                name: value,
                value: value, // Set the value field equal to the name field
            });
        } else {
            setDropdownForm({
                ...dropdownForm,
                [name]: value,
            });
        }
    };

    const handleCheckboxChange = (event) => {
        setDropdownForm({
            ...dropdownForm,
            [event.target.name]: event.target.checked,
        });
    };

    const handleEdit = (dropdownId) => {
        const dropdownToEdit = dropdowns.find(dropdown => dropdown.dropdownId === dropdownId);
        if (dropdownToEdit) {
            setDropdownForm({
                name: dropdownToEdit.name,
                value: dropdownToEdit.value,
                type: dropdownToEdit.type,
                module: dropdownToEdit.module,
                description: dropdownToEdit.description,
                isActive: dropdownToEdit.isActive,
            });
            setOriginalCategoryName(dropdownToEdit.name);
            handleOpen();
            setEditDropdownId(dropdownId);
            setShowEditForm(true);
        }
    };

    const resetDropdownForm = () => {
        setDropdownForm({
            name: "",
            value: "",
            type: "",
            module: "",
            description: "",
            isActive: false,
        });
    };

    const handleOpenAddNewDropdownDialog = () => {
        resetDropdownForm(); // Reset dropdownForm state to initial empty values
        handleOpen(); // Open the dialog
        setShowEditForm(false); // Ensure edit form is not shown
    };

    const isDuplicateName = (name) => {
        return dropdowns.some(dropdown => dropdown.name === name);
    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.name = dropdownForm.name ? ((dropdownForm.name === originalCategoryName || !isDuplicateName(dropdownForm.name)) ? "" : "Name already exists") : "This field is required";
        tempErrors.type = dropdownForm.type ? "" : "This field is required.";
        tempErrors.module = dropdownForm.module ? "" : "This field is required.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm() && !isDuplicateName(dropdownForm.name)) {
            try {
                const result = await addNewDropdown(dropdownForm);
                if (result.statusCode !== 200) {
                    throw new Error("Failed to add new dropdown. Please try again.");
                }
                handleClose();
                setSnackbarMessage("Successfully added new dropdown");
                setSnackbarSeverity("info");
                setOpenSnackbar(true);
                setReloadTable(prevState => !prevState); // Toggle reloadTable state
            } catch (error) {
                setSnackbarMessage("Failed to add new dropdown");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        if (validateForm() && (dropdownForm.name === originalCategoryName || !isDuplicateName(dropdownForm.name))) {
            try {
                const result = await updateDropdown(editDropdownId, dropdownForm);
                if (result.statusCode !== 200) {
                    throw new Error("Failed to update dropdown. Please try again.");
                }
                handleClose();
                setSnackbarMessage("Successfully update dropdown");
                setSnackbarSeverity("info");
                setOpenSnackbar(true);
                setReloadTable(prevState => !prevState); // Toggle reloadTable state
            } catch (error) {
                setSnackbarMessage("Failed to update dropdown");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        }
    };

    return (
        <Box p={3} pt={1}>
            <h1>Dropdown Page</h1>
            <Box mb={4}>
                <Grid
                    container
                    spacing={1}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                >
                    <Grid item>
                        <Box display="flex" gap={2}>
                            <Button variant="contained" color="success" onClick={handleOpenAddNewDropdownDialog}>
                                Add New Dropdown
                            </Button>
                            <Dialog open={open} 
                                onClose={(event, reason) => {
                                    if (reason !== 'backdropClick') {
                                        handleClose();
                                    }
                                }}
                            >
                                <DialogTitle fontSize={25} fontWeight="bold">
                                    Add New Dropdown
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
                                                value={dropdownForm.name}
                                                onChange={handleInputChange}
                                                fullWidth
                                                placeholder="Enter dropdown name"
                                                error={Boolean(errors.name)}
                                                helperText={errors.name}
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
                                            <Typography variant="h7">Value</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <TextField
                                                name="value"
                                                value={dropdownForm.value}
                                                onChange={handleInputChange}
                                                fullWidth
                                                placeholder="Enter dropdown value"
                                                InputProps={{
                                                    readOnly: true,
                                                    style: {
                                                        backgroundColor: 'lightgray',
                                                    },
                                                }}
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
                                                value={dropdownForm.type}
                                                onChange={handleInputChange}
                                                fullWidth
                                                placeholder="Enter dropdown type"
                                                error={Boolean(errors.type)}
                                                helperText={errors.type}
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
                                            <Typography variant="h7">Module</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <FormControl fullWidth variant="outlined" error={Boolean(errors.module)}>
                                                <InputLabel id="moduleLabel">Module</InputLabel>
                                                <Select
                                                    labelId="moduleLabel"
                                                    id="module"
                                                    value={dropdownForm.module}
                                                    onChange={handleInputChange}
                                                    label="Module"
                                                    name="module"
                                                >
                                                    <MenuItem value="DineIn">DineIn</MenuItem>
                                                    <MenuItem value="Delivery">Delivery</MenuItem>
                                                </Select>
                                                {errors.module && <FormHelperText>{errors.module}</FormHelperText>}
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
                                            <Typography variant="h7">Description</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <TextField
                                                required={true}
                                                name="description"
                                                value={dropdownForm.description}
                                                onChange={handleInputChange}
                                                fullWidth
                                                placeholder="Enter dropdown description"
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
                                            <Typography variant="h7">Status</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={dropdownForm.isActive}
                                                        onChange={handleCheckboxChange}
                                                        name="isActive"
                                                    />
                                                }
                                                label=""
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
            <DropdownTable dropdowns={dropdowns} onDelete={handleDelete} onEdit={handleEdit} />
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
                                    value={dropdownForm.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    placeholder="Enter dropdown name"
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
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
                                <Typography variant="h7">Value</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    name="value"
                                    value={dropdownForm.value}
                                    onChange={handleInputChange}
                                    fullWidth
                                    placeholder="Enter dropdown value"
                                    InputProps={{
                                        readOnly: true,
                                        style: {
                                            backgroundColor: 'lightgray',
                                        },
                                    }}
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
                                    value={dropdownForm.type}
                                    onChange={handleInputChange}
                                    fullWidth
                                    placeholder="Enter dropdown type"
                                    error={Boolean(errors.type)}
                                    helperText={errors.type}
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
                                <Typography variant="h7">Module</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControl fullWidth variant="outlined" error={Boolean(errors.module)}>
                                    <InputLabel id="moduleLabel">Module</InputLabel>
                                    <Select
                                        labelId="moduleLabel"
                                        id="module"
                                        value={dropdownForm.module}
                                        onChange={handleInputChange}
                                        label="Module"
                                        name="module"
                                    >
                                        <MenuItem value="DineIn">DineIn</MenuItem>
                                        <MenuItem value="Delivery">Delivery</MenuItem>
                                    </Select>
                                    {errors.module && <FormHelperText>{errors.module}</FormHelperText>}
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
                                <Typography variant="h7">Description</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    required={true}
                                    name="description"
                                    value={dropdownForm.description}
                                    onChange={handleInputChange}
                                    fullWidth
                                    placeholder="Enter dropdown description"
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
                                <Typography variant="h7">Status</Typography>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={dropdownForm.isActive}
                                            onChange={handleCheckboxChange}
                                            name="isActive"
                                        />
                                    }
                                    label=""
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

export default DropdownPage;
