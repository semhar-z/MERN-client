import { useState, useEffect } from "react";
import { fetchSavedBooks, checkBookAvailability, deleteBook } from "../services/api";
import { useNavigate } from 'react-router-dom';

function SavedBooks() {
  const [savedBooks, setSavedBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch saved books on component mount
  useEffect(() => {
    const loadSavedBooks = async () => {
      try {
        const books = await fetchSavedBooks();
        setSavedBooks(books);
      } catch (error) {
        console.error("Error fetching saved books:", error.message);
        alert("Session expired. Please log in again.");
       navigate('/login'); // Redirect to login
      }
    };

    loadSavedBooks();
  }, []);

  // Handle delete book (reusing logic from BookSearch)
  const handleDeleteBook = async (isbn) => {
    try {
      await deleteBook(isbn);
      alert("Book deleted successfully!");
      // Reload the saved books list after deletion
      const updatedBooks = await fetchSavedBooks();
      setSavedBooks(updatedBooks);
    } catch (error) {
      console.error("Error deleting book:", error.message);
    }
  };

  // Handle availability check
  const handleCheckAvailability = async (isbn) => {
    try {
      const availabilityUrl = await checkBookAvailability(isbn);
      if (availabilityUrl) {
        window.open(availabilityUrl, "_blank");
      } else {
        alert("No availability information found for this book.");
      }
    } catch (error) {
      console.error("Error checking availability:", error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Saved Books</h2>
      <div style={styles.bookList}>
        {savedBooks.map((book, index) => (
          <div key={index} style={styles.bookItem}>
            <h3>{book.title}</h3>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            {book.cover && <img src={book.cover} alt={book.title} style={styles.image} />}
            <button onClick={() => handleCheckAvailability(book.isbn)} style={styles.button}>
              Check Availability
            </button>
            <button onClick={() => handleDeleteBook(book.isbn)} style={styles.deleteButton}>
              Delete
            </button>
          </div>
        ))}
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
  title: {
    fontSize: "24px",
    marginBottom: "20px",
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
  image: {
    width: "100%",
    height: "auto",
    marginBottom: "10px",
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
  deleteButton: {
    padding: "10px",
    backgroundColor: "#d9534f", // Red for delete
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    margin: "5px",
  },
};

export default SavedBooks;
