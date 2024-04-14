import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box, TableFooter, TablePagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const DropdownTable = ({ dropdowns, onDelete, onEdit }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper} style={{ overflowX: "initial" }}>
            <Table>
                <TableHead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <TableRow style={{ backgroundColor: '#3f51b5' }}>
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
                    {(rowsPerPage > 0
                        ? dropdowns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
                        : dropdowns
                    ).map((dropdown, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : 'white' }}>
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
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, { label: 'All', value: -1 }]}
                            colSpan={7}
                            count={dropdowns.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            slotProps={{
                                select: {
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }
                            }}
                            sx={{ backgroundColor: 'lightyellow' }}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default DropdownTable;