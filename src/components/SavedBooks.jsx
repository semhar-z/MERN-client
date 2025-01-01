import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";

function SavedBooks() {
    const [savedBooks, setSavedBooks] = useState([]);

    useEffect(() => {
        const fetchSavedBooks = async () => {
            try {
                const token = getToken();
                const response = await axios.get("http://localhost:5000/api/savedBooks/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
               
                setSavedBooks(response.data.data);
            } catch (error) {
                console.error("Error fetching saved books:", error.response?.data || error.message);
                if (error.response?.status === 403 || error.response?.status === 401) {
                    alert("Session expired. Please log in again.");
                    window.location.href = "/login"; // Redirect to login
            } }

        };


        fetchSavedBooks();
    }, []);


    const handleCheckAvailability = async (isbn) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/savedBooks/availability/${isbn}`)

            const availabilityUrl = response.data.url;

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
            <ul>
                {savedBooks.map((book, index) => (
                    <li key={index}>
                        <h3>{book.title}</h3>
                        <p>Author: {book.author}</p>
                        {book.cover && <img src={book.cover} alt={book.title} />}
                        <button onClick={() => handleCheckAvailability(book.isbn)}>
                            Check Availability
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SavedBooks;