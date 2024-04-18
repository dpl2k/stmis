import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box, TableFooter, TablePagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const RestaurantTable = ({ restaurants, onDelete, onEdit }) => {
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
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow style={{ backgroundColor: '#3f51b5' }}>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>ID</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Restaurant Name</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? restaurants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : restaurants
                    ).map((restaurant, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : 'white' }}>
                            <TableCell>{restaurant.restaurantId}</TableCell>
                            <TableCell>{restaurant.name}</TableCell>
                            <TableCell>
                                <Box display="flex">
                                    <Tooltip title="Edit">
                                        <IconButton color="info" onClick={() => onEdit(restaurant.restaurantId)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={() => onDelete(restaurant.restaurantId)}>
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
                            colSpan={3}
                            count={restaurants.length}
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

export default RestaurantTable;