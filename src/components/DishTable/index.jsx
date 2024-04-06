import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const DishTable = ({ dishes, isAdmin, onDelete, onEdit }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow style={{backgroundColor: '#3f51b5'}}>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Image</TableCell>
                        {/* <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>DishId</TableCell> */}
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Dish Name</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Short Name</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>English Name</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Korean Name</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Description</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Allergy</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Price</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>DineIn Type</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Delivery Type</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Status</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Selling Date</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>DineIn Category</TableCell>
                        <TableCell style={{fontWeight: '600', color: '#ffffff'}}>Delivery Category</TableCell>
                        {isAdmin && (
                            <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Actions</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dishes.map((dish, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : 'white' }}>
                            <TableCell>
                                <img src={dish.imageUrl} alt={dish.dishName} style={{ width: '50px', height: '50px' }} />
                            </TableCell>
                            {/* <TableCell>{dish.dishId}</TableCell> */}
                            <TableCell>{dish.dishName}</TableCell>
                            <TableCell>{dish.shortName ? dish.shortName : "N/A"}</TableCell>
                            <TableCell>{dish.englishName ? dish.englishName : "N/A"}</TableCell>
                            <TableCell>{dish.koreanName ? dish.koreanName : "N/A"}</TableCell>
                            <TableCell>{dish.description ? dish.description: "N/A"}</TableCell>
                            <TableCell>{dish.allergy ? dish.allergy : "N/A"}</TableCell>
                            <TableCell>{dish.price}</TableCell>
                            <TableCell>{dish.dineInType ? dish.dineInType : "N/A"}</TableCell>
                            <TableCell>{dish.deliveryType ? dish.deliveryType : "N/A"}</TableCell>
                            <TableCell>{dish.isAvailable ? "In stock" : "Out of stock"}</TableCell>
                            <TableCell>{(dish.sellingDate !== null) ? new Date(dish.sellingDate).toLocaleDateString() : "N/A"}</TableCell>
                            <TableCell>{dish.dineInCategory ? dish.dineInCategory.categoryName: "N/A"}</TableCell>
                            <TableCell>{dish.deliveryCategory ? dish.deliveryCategory.categoryName: "N/A"}</TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <Box display="flex">
                                        <Tooltip title="Edit">
                                            <IconButton color="info" onClick={() => onEdit(dish.dishId)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => onDelete(dish.dishId)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DishTable;