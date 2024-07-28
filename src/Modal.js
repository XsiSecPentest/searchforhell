import React from "react";
import {
  Modal,
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";

const UserDetailsModal = ({ open, handleClose, user }) => {
  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="user-details-modal"
      aria-describedby="user-details-description"
    >
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="user-details-modal" variant="h6" component="h2">
          User Details
        </Typography>
        <Typography id="user-details-description" sx={{ mt: 2 }}>
          ID: {user.id}
        </Typography>
        <Typography id="user-details-description" sx={{ mt: 2 }}>
          Name: {user.name}
        </Typography>
        <Typography id="user-details-description" sx={{ mt: 2 }}>
          Email: {user.email}
        </Typography>
        <Typography id="user-details-description" sx={{ mt: 2 }}>
          Role: {user.role}
        </Typography>
        {/* Add more user details as needed */}
        <Button onClick={handleClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Paper>
    </Modal>
  );
};

export default UserDetailsModal;
