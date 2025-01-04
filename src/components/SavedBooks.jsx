import { useState, useEffect } from "react";
import { fetchSavedBooks, checkBookAvailability } from "../services/api";

function SavedBooks() {
  const [savedBooks, setSavedBooks] = useState([]);

  // Fetch saved books on component mount
  useEffect(() => {
    const loadSavedBooks = async () => {
      try {
        const books = await fetchSavedBooks();
        setSavedBooks(books);
      } catch (error) {
        console.error("Error fetching saved books:", error.message);
        alert("Session expired. Please log in again.");
        window.location.href = "/login"; // Redirect to login
      }
    };

    loadSavedBooks();
  }, []);

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
    <div>
      <h2>Saved Books</h2>
      <ul style={styles.list}>
        {savedBooks.map((book, index) => (
          <li key={index} style={styles.listItem}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            {book.cover && <img src={book.cover} alt={book.title} style={styles.image} />}
            <button onClick={() => handleCheckAvailability(book.isbn)} style={styles.button}>
              Check Availability
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  list: {
    listStyleType: "none",
    padding: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  listItem: {
    textAlign: "center",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    width: "200px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "4px",
    margin: "10px 0",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4b0082",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    marginTop: "10px",
  },
};

export default SavedBooks;
