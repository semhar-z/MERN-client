 // components/BookSearch.jsx
import { useState, useEffect } from "react";
import { searchBooks } from "../services/api"; // Open Library API fetch
import axios from "axios"; // For backend communication
import { getToken } from "../utils/auth";

function BookSearch() {
  const [query, setQuery] = useState(""); // Search query
  const [books, setBooks] = useState([]); // Search results
  const [savedBooks, setSavedBooks] = useState([]); // Saved books from MongoDB
  const [currentPage, setCurrentPage] = useState(1); // Pagination current page
  const [totalPages, setTotalPages] = useState(1); // Pagination total pages

  const fetchBooks = async (page = 1) => {
    try {
      const response = await searchBooks(query, page, 10); // Fetch books
      console.log("API Response:", response); // Debug the raw response
  
      // Extract books data from response
      const booksArray = response.data || []; // Ensure data is an array
      console.log("Books Array:", booksArray); // Debug the books array
  
      // Map over booksArray to create a consistent structure
      const mappedBooks = booksArray.map((book) => ({
        title: book.title || "Unknown Title",
        author: book.author || "Unknown Author",
        isbn: book.isbn?.[0] || "Unknown ISBN",
        // isbn: book.isbn || book.isbn_13 || book.isbn_10 || "Unknown ISBN",
        cover: book.cover || "https://via.placeholder.com/128x192?text=No+Image",
        publish_year: book.publish_year || "Unknown Year",
        editions: book.editions?.map((edition) => ({
          title: edition.title || "Unknown Edition Title",
          language: edition.language || "Unknown Language",
          ebook_access: edition.ebook_access || "No Access",
          link: edition.key ? `https://openlibrary.org${edition.key}` : null,
        }) ) || [], // Default to an empty array if editions are missing
      }));
      // Update state with mapped books
      setBooks(mappedBooks);
      setTotalPages(response.totalPages || 1); // Update total pages
      console.log("Mapped Books:", mappedBooks); // Debug the mapped books
    } catch (error) {
      console.error("Failed to fetch books:", error.message);
    }
  };
  
  // Fetch saved books from the backend
  const fetchSavedBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/savedBooks/all",  {
        headers: { Authorization: `Bearer ${getToken()}` },
    });
      setSavedBooks(response.data.data);
    } catch (error) {
      console.error("Failed to fetch saved books:", error.message);
    }
  };

  useEffect(() => {
    fetchSavedBooks(); // Fetch saved books on component load
  }, []);

  // Save a book to MongoDB
  const handleSaveBook = async (book) => {
    console.log("Saving book:", book);

    const token = getToken();
  if (!token) {
    alert("You must be logged in to save a book.");
    return;
  }
    try {
      
      await axios.post("http://localhost:5000/api/savedBooks/save", {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        cover: book.cover,
        publish_year: book.publish_year,
        editions: book.editions, 
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` }, // Ensure token is sent
      });

      alert(`Book "${book.title}" saved successfully!`);
      fetchSavedBooks(); // Refresh saved books
    } catch (error) {
      console.error("Error saving book:", error.message);
      console.error("Error Response:", error.response?.data);
      alert("Failed to save the book.");
    }
  };

  // Delete a saved book from MongoDB
  const handleDeleteBook = async (isbn) => {
    try {
      await axios.delete(`http://localhost:5000/api/savedBooks/delete/${isbn}`);
      alert("Book deleted successfully!");
      fetchSavedBooks(); // Refresh saved books
    } catch (error) {
      console.error("Error deleting book:", error.message);
      alert("Failed to delete the book.");
    }
  };

  // Check availability in libraries using WorldCat
  const handleCheckAvailability = (isbn) => {
    const worldCatUrl = `https://www.worldcat.org/isbn/${isbn}`;
    window.open(worldCatUrl, "_blank");
  };

  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page for a new query
    fetchBooks(1);
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      fetchBooks(page);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Search for Books</h2>
      <input
        type="text"
        placeholder="Enter keywords"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>
        Search
      </button>

      {/* Search results */}
      <ul style={styles.bookList}>
  {books.map((book, index) => (
    <li key={index} style={styles.bookItem}>
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Published Year: {book.publish_year}</p>
      {book.cover && <img src={book.cover} alt={book.title} />}
      
      {/* Editions Section */}
      {book.editions.length > 0 && (
        <div>
          <h4>Editions:</h4>
          <ul>
            {book.editions.map((edition, edIndex) => (
              <li key={edIndex}>
                <p>Edition Title: {edition.title}</p>
                <p>Language: {edition.language}</p>
                {edition.ebook_access === "public" ? (
                  <p>
                    <a href={edition.link} target="_blank" rel="noopener noreferrer">
                      Read eBook (Public Access)
                    </a>
                  </p>
                ) : (
                  <p>No eBook access available</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) }

      {/* Save and Find in Library Buttons */}
      <button onClick={() => handleSaveBook(book)} style={styles.button}>Save</button>
      <button onClick={() => handleCheckAvailability(book.isbn)} style={styles.button}>
        Find in Library
      </button>
    </li>
  ))}
</ul>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={styles.button}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={styles.button}
        >
          Next
        </button>
      </div>
      
      <div style={styles.savedBooksContainer}>
      <h2>Saved Books</h2>
      {/* Saved books */}
      <ul style={styles.savedBooksList}>
        {savedBooks.map((book, index) => (
         <li key={index} style={styles.savedBookItem}>
          <div style={styles.savedBookDetails}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Published Year: {book.publish_year}</p>
          </div>
            {book.cover && <img src={book.cover} alt={book.title} style={styles.savedBookImage} />}
            <button onClick={() => handleDeleteBook(book.isbn)} style={styles.button}>Delete</button>
            <button onClick={() => handleCheckAvailability(book.isbn)} style={styles.button}>
              Find in Library
            </button>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

 // Inline styles for the component
//  const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "100vh",
//     backgroundColor: "#f5f5f5",
//     flexDirection: "column",
//   },
//   bookList: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "20px",
//     justifyContent: "center",
//     listStyle: "none",
//     padding: "0",
//     margin: "0",
//   },
//   bookItem: {
//     textAlign: "center",
//     backgroundColor: "white",
//     padding: "15px",
//     borderRadius: "8px",
//     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//     maxWidth: "200px",
//   },
//   input: {
//     marginBottom: "20px",
//     padding: "10px",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     fontSize: "16px",
//     width: "300px",
//   },
//   button: {
//     margin: "5px",
//     padding: "10px 15px",
//     border: "none",
//     borderRadius: "4px",
//     backgroundColor: "#4b0082",
//     color: "white",
//     cursor: "pointer",
//     fontSize: "12px",
//   },
//   pagination: {
//     marginTop: "20px",
//   },
// };


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  input: {
    padding: "10px",
    width: "300px",
    margin: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4b0082",
    color: "white",
    border: "none",
    cursor: "pointer",
    margin: "10px",
  },
  bookList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  bookItem: {
    textAlign: "center",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  savedBooksContainer: {
    marginTop: "40px",
    textAlign: "center",
    width: "100%",
  },
  savedBooksList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    listStyle: "none",
    padding: "0",
  },
  savedBookItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  savedBookDetails: {
    marginBottom: "10px",
  },
  savedBookImage: {
    width: "100px",
    height: "150px",
    objectFit: "cover",
  },
};

export default BookSearch;
