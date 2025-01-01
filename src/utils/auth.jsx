// src/utils/auth.jsx

// Function to store the token in localStorage
export const storeToken = (token) => {
    localStorage.setItem('token', token);
};

// Function to get the token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

export const removeToken = () => localStorage.removeItem('token');

// Function to fetch user data using the stored token
export const fetchUserData = async () => {
    const token = getToken(); // Retrieve the token from localStorage

    if (!token) {
        console.error('No token found. Please log in.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            return data.data; // Return user data
        } else {
            console.error('Failed to fetch user data:', data.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};