// components/Login.jsx
import { useState } from 'react';
import { loginUser } from '../services/api'; // Import login function
import { storeToken } from '../utils/auth'; // Import token storage function
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Login Attempt: Email -", email, "Password -", password);

    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    try {
      // Call loginUser function from api.jsx
      const token = await loginUser(email.trim(), password);

      // Store the token and update authentication state
      storeToken(token);
      setIsAuthenticated(true);
      alert("Login successful!");

      // Redirect to the book search page
      navigate('/booksearch');
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#4b0082',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default Login;
