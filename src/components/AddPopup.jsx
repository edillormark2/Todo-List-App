import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ModalClose from "@mui/joy/ModalClose";
import PopupTitle from "./PopupTitle";
import Textarea from "@mui/joy/Textarea";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Divider } from "@mui/joy";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPopup = props => {
  const { openPopup, setOpenPopup } = props;
  const isMobile = window.innerWidth <= 768 && window.innerHeight <= 1024;

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleTitleChange = event => {
    const value = event.target.value;
    setTitle(value);

    if (!value.trim()) {
      setTitleError("Title is required");
    } else {
      setTitleError("");
    }
  };

  const handleDescriptionChange = event => {
    const value = event.target.value;
    setDescription(value);

    if (!value.trim()) {
      setDescriptionError("Description is required");
    } else {
      setDescriptionError("");
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all the required fields");

      setTitleError(!title.trim() ? "Title is required" : "");
      setDescriptionError(!description.trim() ? "Description is required" : "");

      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    try {
      await axios.post("http://localhost/reactapp/api/todo.php", {
        title: title,
        description: description,
        time_date: formattedDate // Add formatted date/time here
      });
      toast.success("Task added successfully");
      setTitle("");
      setDescription("");
      props.onTaskCreated();
      setOpenPopup(false);
    } catch (err) {
      toast.error("Error adding task");
    }
  };

  const dynamicPopupStyles = {
    position: "absolute",
    top: isMobile ? "50%" : "50%",
    left: "48%",
    width: "min(88%, 600px)",
    height: isMobile ? "75vh" : "min(70%, 50vh)",
    transform: "translate(-50%, -50%)",
    overflowY: "auto",
    p: 4
  };

  return (
    <div>
      <Modal open={openPopup} onClose={() => setOpenPopup(false)}>
        <Box
          sx={dynamicPopupStyles}
          style={
            isMobile || window.innerWidth <= window.innerHeight * 2
              ? dynamicPopupStyles
              : null
          }
          className="m-2 md:m-10 mt-10 p-4 md:p-10 bg-white rounded-md"
        >
          <ModalClose variant="outlined" onClick={() => setOpenPopup(false)} />
          <PopupTitle title="Add Task" className="mb-3" />
          <Divider />
          <div className="mt-5 mb-5">
            <p className="mb-1 text-sm">Title</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput value={title} onChange={handleTitleChange} />
              </FormControl>
            </form>
            <div id="createHelp" className="text-red-500 text-sm">
              {titleError}
            </div>
            <div className="mt-5">
              <p className="mb-1 text-sm">Description</p>
              <Textarea
                className="w-full p-2 border rounded"
                value={description}
                onChange={handleDescriptionChange}
                minRows={isMobile ? 6 : 3}
              />
            </div>
            <div id="createHelp" className="text-red-500 text-sm">
              {descriptionError}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#3498DB",
              color: "white",
              borderRadius: "10px",
              padding: "10px 20px",
              border: "none",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Add Task
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default AddPopup;
