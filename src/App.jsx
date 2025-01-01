// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from "./components/HomePage"; 
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import BookSearch from './components/BookSearch';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { getToken, removeToken } from './utils/auth';
import SavedBooks from './components/SavedBooks';
import TaskScheduler from './components/TaskScheduler';
import './styles.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getToken();
        setIsAuthenticated(!!token); // Check token presence
    }, []);

    return (
        <div>
            <Header />
            <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <div style={{ padding: '20px' }}>
                <Routes>
                    {/* Home Route */}
                    <Route path="/" element={<HomePage/>} />
                    
                    {/* Login Route */}
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/booksearch" />
                            ) : (
                                <Login setIsAuthenticated={setIsAuthenticated} />
                            )
                        }
                    />
                    
                    {/* Sign Up Route */}
                    <Route
                        path="/signup"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/booksearch" />
                            ) : (
                                <Signup />
                            )
                        }
                    />
                    
                    {/* Profile Route */}
                    <Route
                        path="/profile"
                        element={
                            isAuthenticated ? <Profile /> : <Navigate to="/login" />
                        }
                    />
                    
                    {/* Book Search Route */}
                    <Route
                        path="/booksearch"
                        element={
                            isAuthenticated ? <BookSearch /> : <Navigate to="/login" />
                        }
                    />

                    {/* Other routes */}
                    <Route path="/saved-books" element={<SavedBooks />} />
                    <Route path="/tasks"
                           element={isAuthenticated ? <TaskScheduler /> : <Navigate to="/login" />

                           }
                    />
    
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
