import React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeletePopup = ({ openPopup, setOpenPopup, todoid, onTaskDeleted }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost/reactapp/api/todo.php/${todoid}`);
      toast.success("Task Deleted");
      onTaskDeleted(); // Fetch updated data after deletion
      setOpenPopup(false); // Close the delete popup after deletion
    } catch (error) {
      toast.error("Error deleting task");
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setOpenPopup(false); // Close the delete popup without performing deletion
  };

  return (
    <div className="bg-white dark-bg-[#42464D]">
      <Modal open={openPopup}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle style={{ justifyContent: "center" }}>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent className="md-max-sm-flex">
            Are you sure you want to delete this?
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              variant="solid"
              onClick={handleDelete}
              style={{
                backgroundColor: "#3498DB",
                color: "white"
              }}
            >
              Delete
            </Button>
            <Button variant="plain" color="neutral" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default DeletePopup;
