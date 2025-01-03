// components/profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateUserEmail, deleteUserProfile } from "../services/api";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUserData(data);
        setEmail(data.email);
      } catch (error) {
        alert("You are not authenticated!");
        navigate("/login"); // Redirect to login on failure
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleUpdateEmail = async () => {
    try {
      const updatedData = await updateUserEmail(email);
      setUserData(updatedData);
      alert("Email updated successfully!");
    } catch (error) {
      alert("Failed to update email.");
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteUserProfile();
      alert("Profile deleted successfully!");
      navigate("/signup"); // Redirect to signup
    } catch (error) {
      alert("Failed to delete profile.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.profile}>
        <h2>Welcome, {userData?.name}</h2>
        <p>Current Email: {userData?.email}</p>

        {/* Update Email Form */}
        <div>
          <h3>Update Email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter new email"
            style={styles.input}
          />
          <button onClick={handleUpdateEmail} style={styles.button}>
            Update Email
          </button>
        </div>

        {/* Delete Profile */}
        <div>
          <h3>Delete Profile</h3>
          <button onClick={handleDeleteProfile} style={{ ...styles.button, backgroundColor: "red" }}>
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  profile: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "400px",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#4b0082",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Profile;


