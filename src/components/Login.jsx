import { useState } from 'react';
import { loginUser } from '../services/api';
import { storeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import "./LoginSignup.css";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }
    try {
      const token = await loginUser(email.trim(), password);
      storeToken(token);
      setIsAuthenticated(true);
      alert('Login successful!');
      navigate('/booksearch');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="form-card">
        <h2 className="form-title">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
