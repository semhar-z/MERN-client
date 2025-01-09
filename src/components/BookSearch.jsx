import { useState, useEffect } from "react";
import {
  searchBooks,
  saveBook,
  fetchSavedBooks,
  deleteBook,
  checkBookAvailability,
} from "../services/api";

function BookSearch() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false); // Track if search is performed

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const data = await searchBooks(query, page, 10);
      setBooks(data.data);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
      setSearchPerformed(true); // Mark search as performed
    } catch (error) {
      console.error("Error fetching books:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async (book) => {
    try {
      await saveBook(book);
      alert(`Book "${book.title}" saved successfully!`);
    } catch (error) {
      console.error("Error saving book:", error.message);
    }
  };

  const handleCheckAvailability = async (isbn) => {
    try {
      const url = await checkBookAvailability(isbn);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error checking availability:", error.message);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) {
      alert("Please enter a valid search query.");
      return;
    }
    setCurrentPage(1);
    fetchBooks(1);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search for Books</h2>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Enter keywords"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.searchButton} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && <p>Loading books, please wait...</p>}

      {searchPerformed && books.length === 0 && !loading && (
        <p style={styles.noResults}>No books found. Please try a different search query.</p>
      )}

      <div style={styles.bookList}>
        {books.map((book) => (
          <div key={book.isbn} style={styles.bookItem}>
            <h3>{book.title}</h3>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>
              <strong>Published Year:</strong> {book.publish_year}
            </p>
            <p>
              <strong>Description:</strong> {book.description}
            </p>
            {book.cover && (
              <img src={book.cover} alt={book.title} style={styles.bookImage} />
            )}
            <button onClick={() => handleSaveBook(book)} style={styles.button}>
              Save
            </button>
            <button onClick={() => handleCheckAvailability(book.isbn)} style={styles.button}>
              Find in Library
            </button>
          </div>
        ))}
      </div>

      {books.length > 0 && (
        <div style={styles.pagination}>
          <button
            onClick={() => currentPage > 1 && fetchBooks(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            style={styles.paginationButton}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => currentPage < totalPages && fetchBooks(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            style={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#4b0082",
    fontWeight: "bold",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    padding: "12px",
    width: "350px",
    borderRadius: "30px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  searchButton: {
    padding: "12px 25px",
    backgroundColor: "#4b0082",
    color: "white",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  bookList: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  bookItem: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  bookImage: {
    width: "100%",
    height: "auto",
    marginBottom: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4b0082",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    margin: "5px",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  paginationButton: {
    padding: "10px",
    backgroundColor: "#7b1fa2",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    margin: "5px",
  },
  noResults: {
    fontSize: "18px",
    color: "#666",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default BookSearch;
