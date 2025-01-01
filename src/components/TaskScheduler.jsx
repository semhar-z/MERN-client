// components/TaskScheduler.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";

function TaskScheduler() {
    const [tasks, setTasks] = useState([]); // Array of tasks
    const [task, setTask] = useState(''); // Input for task name
    const [dueDate, setDueDate] = useState(''); // Input for due date
    const [error, setError] = useState(''); // Error handling

    // Fetch tasks from MongoDB
    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users/tasks/all", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setTasks(response.data.data);
        } catch (error) {
            console.error("Error fetching tasks:", error.message);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add a new task
    const handleAddTask = async () => {
        if (!task || !dueDate) {
            setError("Both task and due date are required.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/users/tasks/add",
                { task, dueDate },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setTasks([...tasks, response.data.data]);
            setTask('');
            setDueDate('');
            setError('');
            fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error.message);
            setError("Failed to add task.");
        }
    };

    // Delete a task
    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/tasks/delete/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setTasks(tasks.filter((t) => t._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.form}>
                <h2>Task Scheduler</h2>
                <input
                    type="text"
                    placeholder="Enter Task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleAddTask} style={styles.button}>
                    Add Task
                </button>
                {error && <p style={styles.error}>{error}</p>}
            </div>

            <ul style={styles.taskList}>
                {tasks.map((t) => (
                    <li key={t._id} style={styles.taskItem}>
                        <div>
                            <strong>Task:</strong> {t.task}
                            <br />
                            <strong>Due Date:</strong> {new Date(t.dueDate).toDateString()}
                        </div>
                        <button
                            onClick={() => handleDeleteTask(t._id)}
                            style={styles.deleteButton}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    form: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        marginBottom: '20px',
    },
    input: {
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        maxWidth: '300px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#4b0082',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
    taskList: {
        listStyleType: 'none',
        padding: '0',
        margin: '0',
        width: '100%',
        maxWidth: '400px',
    },
    taskItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '10px',
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 10px',
        cursor: 'pointer',
    },
};

export default TaskScheduler;
