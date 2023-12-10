import React, { useState, useEffect } from "react";
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

const EditPopup = ({ openPopup, setOpenPopup, todoid, onTaskEdited }) => {
  const isMobile = window.innerWidth <= 768 && window.innerHeight <= 1024;

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          if (!todoid) {
            toast.error("Invalid task ID");
            return;
          }

          const response = await axios.get(
            `http://localhost/reactapp/api/todo.php/${todoid}`
          );
          const userData = response.data;

          if (userData && Object.keys(userData).length > 0) {
            setTitle(userData.todotitle);
            setDescription(userData.tododescription);
          } else {
            toast.error("No task records found for this ID.");
          }
        } catch (error) {
          toast.error("Error fetching task data: " + error.message);
        }
      };

      fetchData();
    },
    [todoid]
  );

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

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all the required fields");
      setTitleError(!title.trim() ? "Title is required" : "");
      setDescriptionError(!description.trim() ? "Description is required" : "");
      return;
    }

    try {
      const updateData = {
        todoid: todoid,
        title: title,
        description: description,
        completed: "Incomplete" // Assuming "Incomplete" as default status
      };

      const response = await axios.put(
        `http://localhost/reactapp/api/todo.php/${todoid}`,
        updateData
      );

      if (response.data) {
        // Update the state with the new data received after update
        setTitle(response.data.title);
        setDescription(response.data.description);
        toast.success("Task Updated Successfully");
        onTaskEdited();
        setOpenPopup(false);
      } else {
        toast.error("No updated task records found.");
      }
    } catch (err) {
      toast.error("Error updating task");
      console.error("Error:", err);
    }
  };

  const dynamicPopupStyles = {
    position: "absolute",
    top: isMobile ? "50%" : "50%",
    left: "48%",
    width: "min(88%, 600px)",
    height: isMobile ? "75vh" : "min(70%, 50vh)", // Adjusted height for mobile view
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
          <PopupTitle title="Edit Task" className="mb-3" />
          <Divider />
          <div className="mt-5 mb-5">
            <p className="mb-1 text-sm">Title</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput
                  value={title}
                  onChange={handleTitleChange}
                />{" "}
                {/* Display the fetched title */}
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
                minRows={isMobile ? 6 : 3} // Adjust the number of rows as needed
              />{" "}
              {/* Display the fetched description */}
            </div>
            <div id="createHelp" className="text-red-500 text-sm">
              {descriptionError}
            </div>
          </div>
          <button
            type="button"
            onClick={handleUpdate}
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
            Update Task
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default EditPopup;
