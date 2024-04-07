import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmationModal = ({ open, message, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} 
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                onCancel();
              }
            }}
    >
      <DialogTitle>
        Confirmation
        <IconButton
          style={{ position: "absolute", right: "8px", top: "8px" }}
          onClick={onCancel}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="error" variant="contained">Cancel</Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
