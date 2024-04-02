import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DishTable = ({ dishes }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Dish Name</TableCell>
                        <TableCell>English Name</TableCell>
                        <TableCell>Korean Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Allergic Warning</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Available Status</TableCell>
                        <TableCell>Selling Date</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dishes.map((dish) => (
                        <TableRow key={dish.id}>
                            <TableCell>{dish.image}</TableCell>
                            <TableCell>{dish.dishName}</TableCell>
                            <TableCell>{dish.englishName}</TableCell>
                            <TableCell>{dish.koreanName}</TableCell>
                            <TableCell>{dish.description}</TableCell>
                            <TableCell>{dish.allergicWarning}</TableCell>
                            <TableCell>{dish.price}</TableCell>
                            <TableCell>{dish.availableStatus}</TableCell>
                            <TableCell>{dish.sellingDate}</TableCell>
                            <TableCell>{dish.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DishTable;