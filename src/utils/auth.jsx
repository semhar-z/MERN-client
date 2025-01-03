// src/utils/auth.jsx
export const storeToken = (token) => {
    if (typeof token !== "string") {
      console.error("Expected a string token but received:", token);
      throw new Error("Invalid token format. Expected a string.");
    }
    localStorage.setItem("token", token);
  };
  
  export const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage.");
    }
    console.log("Retrieved token:", token);
    return token; // Return the plain string
  };
  

export const removeToken = () => localStorage.removeItem('token');

