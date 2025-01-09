import { useState, useEffect } from "react";
import { fetchAllTasks, addTask, deleteTask } from "../services/api";
import "./LoginSignup.css";

function TaskScheduler() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  // Fetch tasks from MongoDB
  const loadTasks = async () => {
    try {
      const tasks = await fetchAllTasks();
      setTasks(tasks);
    } catch (error) {
      console.error("Error loading tasks:", error.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    if (!task || !dueDate) {
      setError("Both task and due date are required.");
      return;
    }

    try {
      const newTask = await addTask(task, dueDate);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTask("");
      setDueDate("");
      setError("");
    } catch (error) {
      console.error("Error adding task:", error.message);
      setError("Failed to add task.");
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  return (
    <div className="task-scheduler-container">
      <div className="task-scheduler-card">
        <h2 className="form-title">Task Scheduler</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group mb-3">
          <label htmlFor="task">Task</label>
          <input
            type="text"
            id="task"
            className="form-control"
            placeholder="Enter Task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleAddTask}>
          Add Task
        </button>
      </div>

      <div className="tasks-container">
        <h3 className="tasks-title">Tasks</h3>
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t._id} className="task-item">
              <div className="task-content">
                <p className="task-text"> 
                  <strong>Task:</strong> {t.task}</p>
                <p className="task-text">
                  <strong>Due Date:</strong> {new Date(t.dueDate).toDateString()}
                </p>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteTask(t._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TaskScheduler;


