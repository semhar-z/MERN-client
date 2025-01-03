// components/BookSearch.jsx
import { useState, useEffect } from "react";
import { searchBooks, saveBook, fetchSavedBooks, deleteBook, checkBookAvailability } from "../services/api";

function BookSearch() {
  const [query, setQuery] = useState(""); // Search query
  const [books, setBooks] = useState([]); // Fetched books
  const [savedBooks, setSavedBooks] = useState([]); // Saved books
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch books from the API
  const fetchBooks = async (page = 1) => {
    setLoading(true); // Set loading to true during the fetch process
    try {
      const data = await searchBooks(query, page, 10); // Fetch books
      setBooks(data.data); // Update books state
      setTotalPages(data.totalPages); // Update total pages
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching books:", error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Load saved books from the database
  const loadSavedBooks = async () => {
    try {
      const data = await fetchSavedBooks(); // Fetch saved books
      setSavedBooks(data); // Update saved books state
    } catch (error) {
      console.error("Error fetching saved books:", error.message);
    }
  };

  useEffect(() => {
    loadSavedBooks(); // Fetch saved books when the component mounts
  }, []);

  // Save a book to the database
  const handleSaveBook = async (book) => {
    try {
      await saveBook(book);
      alert(`Book "${book.title}" saved successfully!`);
      loadSavedBooks(); // Reload saved books
    } catch (error) {
      console.error("Error saving book:", error.message);
    }
  };

  // Delete a saved book from the database
  const handleDeleteBook = async (isbn) => {
    try {
      await deleteBook(isbn);
      alert("Book deleted successfully!");
      loadSavedBooks(); // Reload saved books
    } catch (error) {
      console.error("Error deleting book:", error.message);
    }
  };

  // Check availability in nearby libraries
  const handleCheckAvailability = async (isbn) => {
    try {
      const url = await checkBookAvailability(isbn);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error checking availability:", error.message);
    }
  };

  // Handle search query submission
  const handleSearch = () => {
    if (!query.trim()) {
      alert("Please enter a valid search query.");
      return;
    }
    setCurrentPage(1); // Reset to the first page
    fetchBooks(1); // Fetch books
  };

  return (
    <div style={styles.container}>
      <h2>Search for Books</h2>

      {/* Search Input */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Enter keywords"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p>Loading books, please wait...</p>}

      {/* Books List */}
      <div style={styles.bookList}>
        {books.map((book) => (
          <div key={book.isbn} style={styles.bookItem}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Published Year:</strong> {book.publish_year}</p>
            <p><strong>Description:</strong> {book.description}</p>
            {book.cover && <img src={book.cover} alt={book.title} style={styles.bookImage} />}
            <button onClick={() => handleSaveBook(book)} style={styles.button}>Save</button>
            <button onClick={() => handleCheckAvailability(book.isbn)} style={styles.button}>
              Find in Library
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => {
            if (currentPage > 1) {
            fetchBooks(currentPage - 1)
          }
        }}
          disabled={currentPage === 1 || loading}
          style={styles.button}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => {
            if (currentPage < totalPages) {
              fetchBooks(currentPage + 1);
            }
          }}
          disabled={currentPage === totalPages || loading}
          style={styles.button}
        >
          Next
        </button>
      </div>

      {/* Saved Books Section */}
      <div style={styles.savedBooksContainer}>
        <h2>Saved Books</h2>
        <div style={styles.savedBooksList}>
          {savedBooks.map((book) => (
            <div key={book.isbn} style={styles.savedBookItem}>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Published Year: {book.publish_year}</p>
              {book.cover && <img src={book.cover} alt={book.title} style={styles.bookImage} />}
              <button onClick={() => handleDeleteBook(book.isbn)} style={styles.button}>Delete</button>
              <button onClick={() => handleCheckAvailability(book.isbn)} style={styles.button}>
                Find in Library
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "300px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#7b1fa2",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    margin: "5px",
  },
  bookList: {
    // display: "flex",
    // flexWrap: "wrap",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)", // 5 books per row
    // justifyContent: "center",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  bookItem: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
    width: "200px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  bookImage: {
    width: "100%",
    height: "auto",
    marginBottom: "10px",
  },
  pagination: {
    marginTop: "20px",
  },
  savedBooksContainer: {
    marginTop: "30px",
  },
  savedBooksList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  savedBookItem: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
    width: "200px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default BookSearch;

