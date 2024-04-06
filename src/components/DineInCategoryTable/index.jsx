import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const DineInCategoryTable = ({ dineInCategories, onDelete, onEdit }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow style={{ backgroundColor: '#3f51b5' }}>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Dropdown ID</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Name</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Value</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Type</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Module</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Description</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Status</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dineInCategories.map((dineInCategory, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : 'white' }}>
                            <TableCell>{dineInCategory.dropdownId}</TableCell>
                            <TableCell>{dineInCategory.name}</TableCell>
                            <TableCell>{dineInCategory.value}</TableCell>
                            <TableCell>{dineInCategory.type}</TableCell>
                            <TableCell>{dineInCategory.module}</TableCell>
                            <TableCell>{dineInCategory.description}</TableCell>
                            <TableCell>{dineInCategory.isActive ? "Active" : "Inactive"}</TableCell>
                            <TableCell>
                                <Box display="flex">
                                    <Tooltip title="Edit">
                                        <IconButton color="info" onClick={() => onEdit(dineInCategory.dropdownId)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={() => onDelete(dineInCategory.dropdownId)}>
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

export default DineInCategoryTable;