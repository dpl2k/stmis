import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

const DishForm = ({ onSubmit }) => {
  const [dishName, setDishName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [koreanName, setKoreanName] = useState("");
  const [description, setDescription] = useState("");
  const [allergicWarning, setAllergicWarning] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [availableStatus, setAvailableStatus] = useState("");
  const [sellingDate, setSellingDate] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      dishName,
      englishName,
      koreanName,
      description,
      allergicWarning,
      price,
      image,
      availableStatus,
      sellingDate,
      type,
    });
    setDishName("");
    setEnglishName("");
    setKoreanName("");
    setDescription("");
    setAllergicWarning("");
    setPrice("");
    setImage("");
    setAvailableStatus("");
    setSellingDate("");
    setType("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <TextField
          label="Dish Name"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
        />
        <TextField
          label="English Name"
          value={englishName}
          onChange={(e) => setEnglishName(e.target.value)}
        />
        <TextField
          label="Korean Name"
          value={koreanName}
          onChange={(e) => setKoreanName(e.target.value)}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Allergic Warning"
          value={allergicWarning}
          onChange={(e) => setAllergicWarning(e.target.value)}
        />
        <TextField
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          label="Image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <InputLabel id="available-status-label">Available Status</InputLabel>
        <Select
          labelId="available-status-label"
          value={availableStatus}
          onChange={(e) => setAvailableStatus(e.target.value)}
        >
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Not Available">Not Available</MenuItem>
        </Select>
        <TextField
          label="Selling Date"
          type="date"
          value={sellingDate}
          onChange={(e) => setSellingDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="Core">Core</MenuItem>
          <MenuItem value="Seasonal">Seasonal</MenuItem>
        </Select>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </FormControl>
    </form>
  );
};

export default DishForm;
