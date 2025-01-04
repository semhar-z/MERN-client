import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';

const NavBar = ({ isAuthenticated, setIsAuthenticated }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/booksearch?query=${searchQuery}`); // Navigate to Search page with query
    };

    const handleLogout = () => {
        removeToken(); // Clear the token
        setIsAuthenticated(false); // Update authentication state
        navigate('/login'); // Redirect to Login
    };

    return (
        <nav style={navBarStyles}>
            <ul style={navListStyles}>
                {/* Home Link */}
                <li style={navItemStyles}>
                    <button onClick={() => navigate('/')} style={linkStyles}>Home</button>
                    {/* <Link to="/" style={linkStyles}>Home</Link> */}
                </li>

                {isAuthenticated ? (
                    <>
                        {/* Profile Link (Visible When Logged In) */}
                        <li style={navItemStyles}>
                            {/* <Link to="/profile" style={linkStyles}>Profile</Link> */}
                            <button onClick={() => navigate('/profile')} style={linkStyles}>Profile</button>
                        </li>

                         {/* Tasks Link */}
                         <li style={navItemStyles}>
                            <button onClick={() => navigate('/tasks')} style={linkStyles}>
                                Tasks
                            </button>
                        </li>
                        
                        {/* Logout Button */}
                        <li style={navItemStyles}>
                            <button onClick={handleLogout} style={linkStyles}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        {/* Login Link (Visible When Logged Out) */}
                        <li style={navItemStyles}>
                            <button onClick={() => navigate('/login')} style={linkStyles}>Login</button>
                        </li>
                        {/* Sign Up Link (Visible When Logged Out) */}
                        <li style={navItemStyles}>
                            <button onClick={() => navigate('/signup')} style={linkStyles}>Sign Up</button>
                        </li>
                    </>
                )}

                {/* Search Form (Visible to All Users) */}
                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                    {/* <input
                        type="text"
                        placeholder="Search Books"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '5px', marginRight: '10px' }}
                    /> */}
                    <button type="submit" style={linkStyles}>Search</button>
                </form>
            </ul>
        </nav>
    );
};

// Define styles
const navBarStyles = {
    backgroundColor: '#7b1fa2',
    padding: '10px 0',
   };

const navListStyles = {
    listStyleType: 'none',
    display: 'flex',
    justifyContent: 'center',
    margin: '0',
    padding: '0',
};


const navItemStyles = {
    margin: '0 15px',
};

const linkStyles = {
    color: 'white',
    backgroundColor: '#4b0082',
    textDecoration: 'none',
    fontSize: '16px',
};

export default NavBar;
