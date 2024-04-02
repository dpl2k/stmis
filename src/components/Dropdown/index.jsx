import React from "react";
import { Select, MenuItem } from "@mui/material";

const Dropdown = ({ options, selectedOption, onOptionChange }) => {
  return (
    <Select value={selectedOption} onChange={onOptionChange}>
      {options.map((option, index) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default Dropdown;
