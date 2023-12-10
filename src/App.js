import React, { useState, useEffect } from "react";
import "./App.css";
import PageTitle from "./components/PageTitle";
import AddPopup from "./components/AddPopup";
import TaskContent from "./components/TaskContent";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { FaSearch } from "react-icons/fa";
import InputAdornment from "@mui/material/InputAdornment";
import { Select, MenuItem } from "@mui/material";

const App = () => {
  const [openAddTaskPopup, setOpenAddTaskPopup] = useState(false);
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // State for filtering tasks

  const handleOpenAddTask = () => {
    setOpenAddTaskPopup(true);
  };

  const handleCloseAddTask = () => {
    setOpenAddTaskPopup(false);
  };

  const handleTaskShow = () => {
    fetchTodos();
  };

  const fetchTodos = async () => {
    try {
      let apiUrl = `http://localhost/reactapp/api/todo.php?search=${searchTerm}`;

      const response = await axios.get(apiUrl);
      let fetchedTodos = response.data || [];

      if (!Array.isArray(fetchedTodos)) {
        fetchedTodos = [];
      } else {
        if (filterStatus === "completed") {
          fetchedTodos = fetchedTodos.filter(
            todo => localStorage.getItem(`task_${todo.todoid}`) === "completed"
          );
        } else if (filterStatus === "incomplete") {
          fetchedTodos = fetchedTodos.filter(
            todo =>
              !localStorage.getItem(`task_${todo.todoid}`) ||
              localStorage.getItem(`task_${todo.todoid}`) !== "completed"
          );
        }
      }

      setTodos(fetchedTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]); // Set todos to an empty array on error
    }
  };

  useEffect(
    () => {
      fetchTodos();
    },
    [searchTerm, filterStatus]
  );

  const handleFilterChange = event => {
    setFilterStatus(event.target.value);
  };

  // Calculate the count of incomplete and completed tasks for all tasks
  const incompleteTasksOverall = todos.filter(
    todo =>
      !localStorage.getItem(`task_${todo.todoid}`) ||
      localStorage.getItem(`task_${todo.todoid}`) !== "completed"
  );
  const completedTasksOverall = todos.length - incompleteTasksOverall.length;

  // Calculate the count of incomplete and completed tasks based on filter status
  let incompleteTasks = incompleteTasksOverall;
  let completedTasks = completedTasksOverall;

  if (filterStatus === "completed") {
    incompleteTasks = [];
  } else if (filterStatus === "incomplete") {
    completedTasks = 0;
  }

  // Define the paragraphs based on filterStatus
  let statusParagraph;
  if (filterStatus === "all") {
    statusParagraph = (
      <p className="text-center text-xs sm:text-sm text-slate-500 m-2">
        You have {incompleteTasksOverall.length} incomplete task(s) and{" "}
        {completedTasksOverall} completed task(s) in total.
      </p>
    );
  } else if (filterStatus === "completed") {
    statusParagraph = (
      <p className="text-center  text-xs sm:text-sm text-slate-500 m-2">
        You have {completedTasksOverall} completed task(s) in total.
      </p>
    );
  } else if (filterStatus === "incomplete") {
    statusParagraph = (
      <p className="text-center  text-xs sm:text-sm text-slate-500 m-2">
        You have {incompleteTasksOverall.length} incomplete task(s) in total.
      </p>
    );
  }
  return (
    <div>
      <PageTitle title="TODO LIST" />
      <ToastContainer />
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-center items-center m-2 gap-5 sm:gap-22 md:gap-32 lg:gap-52 xl:gap-96 sm:w-3/4 md:w-2/3 lg:w-full">
          <button
            onClick={handleOpenAddTask}
            style={{
              backgroundColor: "#3498DB",
              color: "white",
              borderRadius: "10px",
              padding: "8px 18px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Add Task
          </button>
          <FormControl>
            <OutlinedInput
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{
                background: "white",
                borderRadius: 3,
                fontSize: 14,
                height: "45px",
                transition: "border-color 0.3s, box-shadow 0.3s",
                "&:focus": {
                  outline: "none"
                }
              }}
              endAdornment={
                <InputAdornment position="end">
                  <FaSearch />
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
      </div>
      <div className="flex justify-center ml-3 mr-3 mt-5 mb-2">
        <div className="bg-gray-200 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-2/4">
          {statusParagraph}
        </div>
      </div>
      <div className="flex justify-center ml-3 mr-3">
        <div className="bg-gray-200 rounded-3xl w-full sm:w-3/4 md:w-2/3 lg:w-2/4">
          <div className="p-4 mx-auto">
            <div className="m-2">
              <Select
                variant="outlined"
                value={filterStatus}
                onChange={handleFilterChange}
                sx={{
                  width: "130px",
                  background: "white",
                  borderRadius: 3,
                  position: "relative",
                  border: "1px ",
                  fontSize: 14,
                  height: "45px",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  "&:focus": {
                    outline: "none"
                  }
                }}
                MenuProps={{
                  MenuListProps: {
                    style: {
                      fontSize: 14
                    }
                  }
                }}
              >
                <MenuItem style={{ fontSize: 14 }} value="all">
                  All
                </MenuItem>
                <MenuItem style={{ fontSize: 14 }} value="completed">
                  Completed
                </MenuItem>
                <MenuItem style={{ fontSize: 14 }} value="incomplete">
                  Incomplete
                </MenuItem>
              </Select>
            </div>
            {todos.length === 0
              ? <div className="flex justify-center items-center h-10 bg-gray-300 rounded-xl">
                  <p className="text-center text-gray-600 font-semibold text-lg">
                    No Todos!
                  </p>
                </div>
              : todos.map((todo, index) =>
                  <TaskContent
                    key={todo.todoid}
                    title={todo.title}
                    description={todo.description}
                    time_date={todo.time_date}
                    todoid={todo.todoid}
                    onTaskDeleted={handleTaskShow}
                    onTaskEdited={handleTaskShow}
                    onTaskChecked={handleTaskShow}
                  />
                )}
          </div>
        </div>
      </div>

      <AddPopup
        openPopup={openAddTaskPopup}
        setOpenPopup={handleCloseAddTask}
        onTaskCreated={handleTaskShow}
      />
      <p className=" text-center text-xs md:text-sm text-slate-500 mt-10 mb-6">
        © 2023 All rights reserved by Mark Daniel Edillor
      </p>
    </div>
  );
};

export default App;
