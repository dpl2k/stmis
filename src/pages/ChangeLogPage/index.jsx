import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    // MenuItem,
    Button
} from "@mui/material";
import ChangeLogTable from "../../components/ChangeLogTable";
import {
    getAllDishes,
    getDeliveryMenu
} from "../../api";

const ChangeLogPage = () => {
    const [changelogs, setChangeLogs] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedRecordId, setSelectedRecordId] = useState("");
    const [selectedAction, setSelectedAction] = useState("");
    const [applyDisabled, setApplyDisabled] = useState(true);
    const [clearDisabled, setClearDisabled] = useState(true);

    useEffect(() => {
        const fetchChangeLogs = async () => {
            try {
                const data = await getAllDishes();
                if (data.statusCode !== 200) {
                    throw new Error("Failed to get changelogs. Please wait and try again.");
                }
                setChangeLogs(data.result);
            } catch (error) {
                setSnackbarMessage("Failed to get changelogs. Please wait and try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        };
        fetchChangeLogs();
    }, []);

    useEffect(() => {
        if (selectedTable || selectedRecordId || selectedAction) {
            setApplyDisabled(false);
            setClearDisabled(false);
        } else {
            setApplyDisabled(true);
            setClearDisabled(true);
        }
    }, [selectedTable, selectedRecordId, selectedAction]);

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);
    };

    const fetchAllChangeLogs = async () => {
        try {
            const data = await getAllDishes();
            if (data.statusCode !== 200) {
                throw new Error("Failed to get changelogs. Please wait and try again.");
            }
            setChangeLogs(data.result);
        } catch (error) {
            setSnackbarMessage("Failed to get changelogs. Please wait and try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    }

    const handleApply = async () => {
        try {
            const data = await getDeliveryMenu(selectedTable, selectedRecordId, selectedAction);
            if (data.statusCode !== 200) {
                throw new Error("Failed to get menu items");
            }
            setChangeLogs(data.result);
        } catch (error) {
            setSnackbarMessage("Failed to get menu items. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    return (
        <Box p={3} pt={1}>
            <h1>Change Log Page</h1>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Box mb={4} display="flex" alignItems="center">
                        <FormControl fullWidth style={{ marginRight: '8px' }}>
                            <InputLabel id="tableLabel">Table Name</InputLabel>
                            <Select
                                labelId="tableLabel"
                                value={selectedTable}
                                onChange={(e) => setSelectedTable(e.target.value)}
                                input={<OutlinedInput label="Table Name" />}
                            >
                                {/* {tables.map((table) => (
                                    <MenuItem value={table.name}>
                                        {table.name}
                                    </MenuItem>
                                ))} */}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth style={{ marginRight: '8px' }}>
                            <InputLabel id="RecordIdLabel">Record ID</InputLabel>
                            <Select
                                labelId="RecordIdLabel"
                                id="recordId"
                                value={selectedRecordId}
                                onChange={(e) => setSelectedRecordId(e.target.value)}
                                input={<OutlinedInput label="Record ID" />}
                            >
                                {/* {recordIds.map(recordId => (
                                    <MenuItem value={recordId.value}>
                                        {recordId.name}
                                    </MenuItem>
                                ))} */}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth style={{ marginRight: '8px' }}>
                            <InputLabel id="actionLabel">Action</InputLabel>
                            <Select
                                labelId="actionLabel"
                                id="action"
                                value={selectedAction}
                                onChange={(e) => setSelectedAction(e.target.value)}
                                input={<OutlinedInput label="Action" />}
                            >
                                {/* {actions.map(action => (
                                    <MenuItem key={action.name} value={action.name}>
                                        {action.name}
                                    </MenuItem>
                                ))} */}
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
                                setSelectedTable("");
                                setSelectedRecordId("");
                                setSelectedAction("");
                                setChangeLogs([]);
                                fetchAllChangeLogs();
                            }}
                            disabled={clearDisabled}
                        >
                            Clear
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <ChangeLogTable changelogs={changelogs} />
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

export default ChangeLogPage;
