import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
} from "@mui/material";

const DishHistoryPage = () => {
    const { dishId } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/dishpage');
    };

    return (
        <Box p={3} pt={1}>
            <h1>History of dish {dishId}</h1>
            <Box mb={4}>
                <Button
                    color="primary"
                    onClick={handleBack}
                    variant="contained"
                    // style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default DishHistoryPage;