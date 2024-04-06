import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const DeliveryCategoryTable = ({ deliveryCategories, onDelete, onEdit }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow style={{ backgroundColor: '#3f51b5' }}>
                        {/* <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Category ID</TableCell> */}
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Name</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Parent Category</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deliveryCategories.map((deliveryCategory, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : 'white' }}>
                            {/* <TableCell>{deliveryCategory.categoryId}</TableCell> */}
                            <TableCell>{deliveryCategory.categoryName}</TableCell>
                            <TableCell>{deliveryCategory.parentCategory ? deliveryCategory.parentCategory.categoryName : "N/A"}</TableCell>
                            <TableCell>
                                <Box display="flex">
                                    <Tooltip title="Edit">
                                        <IconButton color="info" onClick={() => onEdit(deliveryCategory.categoryId)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={() => onDelete(deliveryCategory.categoryId)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DeliveryCategoryTable;
