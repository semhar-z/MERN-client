import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateUserEmail, deleteUserProfile } from "../services/api";
import "./LoginSignup.css";

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
        navigate("/login");
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
      navigate("/signup");
    } catch (error) {
      alert("Failed to delete profile.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="profile-container d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4 text-center profile-card">
        <div className="card-body">
          <h2 className="card-title text-primary mb-4">Welcome, {userData?.name}</h2>
          <p className="text-muted mb-4">
            <strong>Current Email:</strong> {userData?.email}
          </p>

          {/* Update Email Section */}
          <div className="mb-4">
            <h5 className="text-secondary mb-3">Update Email</h5>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new email"
              className="form-control mb-3"
            />
            <button onClick={handleUpdateEmail} className="btn btn-primary w-100">
              Update Email
            </button>
          </div>

          {/* Delete Profile Section */}
          <div className="mb-4">
            <h5 className="text-danger mb-3">Delete Profile</h5>
            <button
              onClick={handleDeleteProfile}
              className="btn btn-danger w-100"
            >
              Delete Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
