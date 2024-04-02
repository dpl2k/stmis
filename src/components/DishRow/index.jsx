import React from "react";
import { TableRow, TableCell } from "@mui/material";

const DishRow = ({ dish }) => {
  return (
    <TableRow key={dish.id}>
      <TableCell>{dish.dishName}</TableCell>
      <TableCell>{dish.englishName}</TableCell>
      <TableCell>{dish.koreanName}</TableCell>
      <TableCell>{dish.description}</TableCell>
      <TableCell>{dish.allergicWarning}</TableCell>
      <TableCell>{dish.price}</TableCell>
      <TableCell>{dish.image}</TableCell>
      <TableCell>{dish.availableStatus}</TableCell>
      <TableCell>{dish.sellingDate}</TableCell>
      <TableCell>{dish.type}</TableCell>
    </TableRow>
  );
};

export default DishRow;
