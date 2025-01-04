import axios from "axios";
import { getToken, storeToken, removeToken} from "../utils/auth";

// Base URL for your API
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://mern-server-9nl3.onrender.com/api";

// Function to get headers (for authenticated requests)
const getHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/auth/login`, { email, password });
    storeToken(response.data.token); // Store the token
    return response.data.token;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// Fetch User Profile Data
export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile`, getHeaders());
       return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw error;
  }
};

// Update User Email
export const updateUserEmail = async (email) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/profile`,
      { email },
      getHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating email:", error.message);
    throw error;
  }
};

// Delete User Profile
export const deleteUserProfile = async () => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    removeToken(); // Clear token
    return response.data;
  } catch (error) {
    console.error("Error deleting profile:", error.message);
    throw error;
  }
};

// Search Books
export const searchBooks = async (query, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books/search`, {
      params: { query, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching books:", error.message);
    throw error;
  }
};

// Fetch Saved Books
export const fetchSavedBooks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/savedBooks/all`, getHeaders());
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      removeToken();
      window.location.href = "/login"; // Redirect to login page
    }
    throw error; // Re-throw the error for other handling if needed
  }
};

// Save a Book
export const saveBook = async (book) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/savedBooks/save`, book, getHeaders());
    return response.data.data;
  } catch (error) {
    console.error("Error saving book:", error.message);
    throw error;
  }
};

// Delete a Saved Book
export const deleteBook = async (isbn) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/savedBooks/delete/${isbn}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error deleting book:", error.message);
    throw error;
  }
};

// Check Availability in Libraries
export const checkBookAvailability = async (isbn) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/savedBooks/availability/${isbn}`);
    return response.data.url;
  } catch (error) {
    console.error("Error checking book availability:", error.message);
    throw error;
  }
};

// Register a new user (Signup)
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/auth/register`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Error during user registration:", error.message);
    throw error;
  }
};

// Fetch all tasks
export const fetchAllTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/tasks/all`, getHeaders());
    return response.data.data;
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
};

// Add a new task
export const addTask = async (task, dueDate) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/tasks/add`,
      { task, dueDate },
      getHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding task:", error.message);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/tasks/delete/${id}`, getHeaders());
  } catch (error) {
    console.error("Error deleting task:", error.message);
    throw error;
  }
};


