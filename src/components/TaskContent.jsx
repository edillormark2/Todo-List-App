import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import DeletePopup from "./DeletePopup";
import EditPopup from "./EditPopup";
import axios from "axios";
import { Checkbox } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskContent = ({
  todoid,
  title,
  description,
  time_date,
  onTaskDeleted,
  onTaskEdited,
  onTaskChecked
}) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(
    localStorage.getItem(`task_${todoid}`) === "completed"
  );

  const handleDeletePopup = () => {
    setOpenPopup(true);
  };

  const handleEditPopup = () => {
    setOpenEditPopup(true);
  };

  const handleTaskDelete = async () => {
    try {
      await axios.delete(`http://localhost/reactapp/api/todo.php/${todoid}`);
      onTaskDeleted();
      setOpenPopup(false);
      localStorage.removeItem(`task_${todoid}`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskEdited = () => {
    onTaskEdited();
    setOpenEditPopup(false);
  };

  const handleTaskCompletion = event => {
    const isChecked = event.target.checked;

    if (isChecked) {
      localStorage.setItem(`task_${todoid}`, "completed");
      // Display toast message with the completed task's title
      toast.success(`Task "${title}" is completed`);
    } else {
      localStorage.removeItem(`task_${todoid}`);
    }

    setTaskCompleted(isChecked);
    onTaskChecked(todoid, isChecked);
  };

  useEffect(
    () => {
      // Check local storage for task completion status
      const status = localStorage.getItem(`task_${todoid}`);
      if (status === "completed") {
        setTaskCompleted(true);
      }
    },
    [todoid]
  );

  return (
    <div className="bg-white rounded-md m-2 p-5 flex items-center">
      <div className="flex items-center flex-grow">
        <Checkbox
          color="primary"
          checked={taskCompleted}
          onChange={handleTaskCompletion}
          sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
        />
        <div className="flex flex-grow flex-col pl-3">
          <div className="flex justify-end gap-1">
            <button
              className="hover:drop-shadow-md"
              onClick={handleDeletePopup}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                border: "none",
                cursor: "pointer",
                borderRadius: "30%",
                textDecoration: "none",
                backgroundColor: "#D6DBDF"
              }}
            >
              <MdDelete
                title="Delete"
                style={{
                  color: "#2C3E50",
                  fontSize: "20px"
                }}
              />
            </button>
            <button
              className="hover:drop-shadow-md"
              onClick={handleEditPopup}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                border: "none",
                cursor: "pointer",
                borderRadius: "30%",
                textDecoration: "none",
                backgroundColor: "#D6DBDF"
              }}
            >
              <MdEdit
                title="Edit"
                style={{
                  color: "#2C3E50",
                  fontSize: "20px"
                }}
              />
            </button>
          </div>
          <p
            className={`text-sm sm:text-base font-semibold ${taskCompleted
              ? "line-through text-slate-400"
              : "text-slate-600"}`}
          >
            Title: {title}
          </p>
          <p
            className={`text-xs sm:text-sm ${taskCompleted
              ? "line-through text-slate-400"
              : "text-slate-600"}`}
          >
            Description: {description}
          </p>
          <p className="mt-2 text-xs sm:text-sm  text-slate-400">
            {time_date}
          </p>
        </div>
      </div>
      <DeletePopup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        todoid={todoid}
        onTaskDeleted={handleTaskDelete}
      />
      <EditPopup
        openPopup={openEditPopup}
        setOpenPopup={setOpenEditPopup}
        todoid={todoid}
        onTaskEdited={handleTaskEdited}
      />
    </div>
  );
};

export default TaskContent;
