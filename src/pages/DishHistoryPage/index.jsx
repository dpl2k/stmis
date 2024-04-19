import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Snackbar,
    Alert
} from "@mui/material";
import ChangeLogTable from "../../components/ChangeLogTable";
import { getChangeLogsbyRecordId } from "../../api";

const DishHistoryPage = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [page, setPage] = useState(0);
    const [changelogs, setChangeLogs] = useState([]);
    const { dishId } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/dishpage');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getChangeLogsbyRecordId(dishId);
                if (data.statusCode !== 200) {
                    throw new Error("Failed to get changelogs");
                }
                setChangeLogs(data.result);
                setPage(0);
            } catch (error) {
                setSnackbarMessage("Failed to get changelogs. Please wait and try again.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        };
        fetchData();
    }, [dishId]);

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);
    };

    return (
        <Box p={3} pt={1} >
            <Box display="flex" alignItems="center">
                <Box mr={2}>
                    <Button
                        color="primary"
                        onClick={handleBack}
                        variant="contained"
                        >
                        Back
                    </Button>
                </Box>
                <h1>History of dish {dishId}</h1>
            </Box>
            <ChangeLogTable changelogs={changelogs} page={page} setPage={setPage}/>
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

export default DishHistoryPage;