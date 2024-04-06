import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const DropdownTable = ({ dropdowns, onDelete, onEdit }) => {
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
                    {dropdowns.map((dropdown, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : 'white' }}>
                            <TableCell>{dropdown.dropdownId}</TableCell>
                            <TableCell>{dropdown.name}</TableCell>
                            <TableCell>{dropdown.value}</TableCell>
                            <TableCell>{dropdown.type}</TableCell>
                            <TableCell>{dropdown.module}</TableCell>
                            <TableCell>{dropdown.description}</TableCell>
                            <TableCell>{dropdown.isActive ? "Active" : "Inactive"}</TableCell>
                            <TableCell>
                                <Box display="flex">
                                    <Tooltip title="Edit">
                                        <IconButton color="info" onClick={() => onEdit(dropdown.dropdownId)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={() => onDelete(dropdown.dropdownId)}>
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

export default DropdownTable;