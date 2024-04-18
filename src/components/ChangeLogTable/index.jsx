import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination } from '@mui/material';

const ChangeLogTable = ({ changelogs }) => {
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
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>RecordID</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Table Name</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Column Name</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Old Value</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>New Value</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Action</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Created On</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? changelogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : changelogs
                    ).map((changelog, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : 'white' }}>
                            <TableCell>{changelog.changeLogId}</TableCell>
                            <TableCell>{changelog.recordId}</TableCell>
                            <TableCell>{changelog.tableName}</TableCell>
                            <TableCell>{changelog.columnName}</TableCell>
                            <TableCell>{changelog.oldValue ? changelog.oldValue : "N/A"}</TableCell>
                            <TableCell>{changelog.newValue ? changelog.newValue : "N/A"}</TableCell>
                            <TableCell>{changelog.action}</TableCell>
                            <TableCell>{changelog.createdOn ? changelog.createdOn: "N/A"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, { label: 'All', value: -1 }]}
                            colSpan={8}
                            count={changelogs.length}
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

export default ChangeLogTable;