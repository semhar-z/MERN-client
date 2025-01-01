// services/api.jsx
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/books";

// Search Books with Pagination
export const searchBooks = async (query, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { query, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.message);
    throw error;
  }
};
