# React + Vite
 
 # BookWizards app

-  It is a web application that allows users to search for books using the Open Library API,   
-  It allows users to save their favorite books, and manage tasks. 
-  The application features a user authentication system,  book management, and a task scheduler.

# Technologies used

React.js: For building the user interface.

Axios: HTTP client for making API requests.

React Router: For handling navigation.

CSS: For styling components.

Vite: Development build tool for faster performance.


## Features

*User Authentication:*

Login and Signup forms for user authentication.

*Book Search:*

Search for books using the Open Library API.

View book details and editions.

*Saved Books:*

Save favorite books to the user's profile.

Delete saved books.

*Task Scheduler:*

Add and manage tasks with a due date.

Delete tasks.



To ensure your app fetches books specifically for kids and supports searching by levels such as "Level 1," "Level 2," etc., you can adjust your query string in the books.js route. Open Library supports keyword-based queries, so including terms like kids, Level 1, or Level 2 in your query should return more relevant results.

Adjusted books.js Route for Kids Books
Here’s the updated route to focus on kids' books and allow level-specific queries:

javascript
Copy code
// routes/books.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Search books for kids with pagination
router.get("/search", async (req, res) => {
    const { query = "", page = 1, limit = 10 } = req.query;

    if (!query) {
        return res.status(400).json({
            success: false,
            message: "Please provide a search query",
        });
    }

    // Validate page and limit as numbers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    try {
        // Call Open Library API with pagination and include kids-specific keywords
        const searchQuery = `${query} kids books`;
        const response = await axios.get(`https://openlibrary.org/search.json`, {
            params: {
                q: searchQuery,
                page: pageNum,
                limit: limitNum,
            },
        });

        const { docs, numFound } = response.data;
        const totalPages = Math.ceil(numFound / limitNum);

        const books = docs.map((book) => ({
            title: book.title || "Unknown Title",
            author: book.author_name?.join(", ") || "Unknown Author",
            publish_year: book.first_publish_year || "Unknown Year",
            cover: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "https://via.placeholder.com/128x192?text=No+Image",
            isbn: book.isbn?.[0] || "Unknown ISBN",
            description: book.first_sentence?.[0] || "Description not available",
        }));

        res.status(200).json({
            success: true,
            currentPage: pageNum,
            totalPages,
            totalBooks: numFound,
            data: books,
        });
    } catch (error) {
        console.error("Error fetching books: ", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});

export default router;
Key Changes
Kids-Specific Search:

The query string includes kids books to ensure results are focused on children's literature.
javascript
Copy code
const searchQuery = `${query} kids books`;
Search Levels:

Users can now search by terms like Level 1 kids books, and the Open Library API will filter results accordingly.
Description:

The description field uses the first sentence if available, providing a summary for the user.
Error Handling:

Returns an error message if no query is provided.
Example Queries
Here are examples of how users can search:

"Level 1": To find beginner-level books for kids.
"Level 2": To find intermediate-level books.
"fairy tales": For books about fairy tales targeted at children.
"science kids books": For children's books related to science.
