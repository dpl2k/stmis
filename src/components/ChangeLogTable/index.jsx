import React , { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import "../ChangeLogTable/ChangeLogTable.css";
import { getAllDeliveryCategories, getAllDineInCategories } from '../../api';

const ChangeLogTable = ({ changelogs, page, setPage }) => {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deliveryCategories, setDeliveryCategories] = useState([]);
    const [dineInCategories, setDineInCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deliveryData = await getAllDeliveryCategories();
                if (deliveryData.statusCode !== 200) {
                    throw new Error("Failed to get restaurants");
                }
                setDeliveryCategories(deliveryData.result);
                const dineInData = await getAllDineInCategories();
                if (dineInData.statusCode !== 200) {
                    throw new Error("Failed to get dishes");
                }
                setDineInCategories(dineInData.result);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const groupedChangeLogs = changelogs.reduce((acc, log) => {
        const key = `${log.changeLogId}-${log.recordId}`;
        if (!acc[key]) {
            acc[key] = {
                changeLogId: log.changeLogId,
                recordId: log.recordId,
                tableName: log.tableName,
                action: log.action,
                createdOn: log.createdOn,
                changes: [],
            };
        }
        acc[key].changes.push({
            columnName: log.columnName,
            oldValue: log.oldValue,
            newValue: log.newValue,
        });
        return acc;
    }, {});

    const groupedChangeLogsArray = Object.values(groupedChangeLogs);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow style={{ backgroundColor: '#3f51b5' }}>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Change Log ID</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Dish ID</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Table</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Action</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Created On</TableCell>
                        <TableCell style={{ fontWeight: '600', color: '#ffffff' }}>Changes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0 
                        ? groupedChangeLogsArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : groupedChangeLogsArray    
                    ).map((log, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f3f3f3' : 'white' }}>
                            <TableCell>{log.changeLogId}</TableCell>
                            <TableCell>{log.recordId}</TableCell>
                            <TableCell>{log.tableName}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.createdOn ? new Date(log.createdOn).toISOString().split('T')[0] : "N/A"}</TableCell>
                            {(log.action === "Update") ?
                                <TableCell>
                                    {log.changes.map((change, index) => (
                                        <div key={index} className='changecell'>
                                            <b>{
                                                change.columnName === 'IsAvailable' ? 'Status' :
                                                    change.columnName === 'DeliveryCategoryId' ? 'Delivery Category' :
                                                        change.columnName === 'DineInCategoryId' ? 'Dine In Category' :
                                                            change.columnName.replace(/([A-Z])/g, ' $1').trim()
                                            }:</b>
                                            <div>
                                                {change.columnName === 'SellingDate' && change.oldValue ? new Date(change.oldValue).toISOString().split('T')[0] :
                                                    change.columnName === 'IsAvailable' ? (change.oldValue === 'True' ? 'In stock' : 'Out of stock') :
                                                        change.columnName === 'DeliveryCategoryId' ? (change.oldValue ? deliveryCategories.find(cat => cat.categoryId.toString() === change.oldValue)?.categoryName : "N/A") :
                                                            change.columnName === 'DineInCategoryId' ? (change.oldValue ? dineInCategories.find(cat => cat.categoryId.toString() === change.oldValue)?.categoryName : "N/A") :
                                                                change.oldValue ? change.oldValue : "N/A"}
                                            </div>
                                            <ArrowForwardIcon fontSize='small' />
                                            <div>
                                                {change.columnName === 'SellingDate' && change.newValue ? new Date(change.newValue).toISOString().split('T')[0] :
                                                    change.columnName === 'IsAvailable' ? (change.newValue === 'True' ? 'In stock' : 'Out of stock') :
                                                        change.columnName === 'DeliveryCategoryId' ? (change.newValue ? deliveryCategories.find(cat => cat.categoryId.toString() === change.newValue)?.categoryName : "N/A") :
                                                            change.columnName === 'DineInCategoryId' ? (change.newValue ? dineInCategories.find(cat => cat.categoryId.toString() === change.newValue)?.categoryName : "N/A") :
                                                                change.newValue ? change.newValue : "N/A"}
                                            </div>
                                        </div>
                                    ))}
                                </TableCell>
                                : (log.action === "Create" 
                                    ? 
                                    <TableCell>
                                        <div>Create new dish</div>
                                    </TableCell>
                                    :
                                    <TableCell>
                                        <div>Delete dish</div>
                                    </TableCell>
                                )
                            }
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, { label: 'All', value: -1 }]}
                            colSpan={6}
                            count={groupedChangeLogsArray.length}
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
}

export default ChangeLogTable;