import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Box, TableFooter, TablePagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const DeliveryCategoryTable = ({ deliveryCategories, onDelete, onEdit }) => {
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
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Name</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Parent Category</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? deliveryCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : deliveryCategories
                    ).map((deliveryCategory, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : 'white' }}>
                            <TableCell>{deliveryCategory.categoryId}</TableCell>
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
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, { label: 'All', value: -1 }]}
                            colSpan={4}
                            count={deliveryCategories.length}
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

export default DeliveryCategoryTable;
