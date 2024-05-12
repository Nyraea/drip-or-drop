import React, { useState, useEffect } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Link } from "react-router-dom";

function EditProfile() {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await docRef.get();
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData(userData);
        } else {
          console.log("User document does not exist");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      const { username, firstName, lastName } = formData;
      if (!username || !firstName || !lastName) {
        alert("Please fill in all required fields.");
        return;
      }
      setLoading(true); // Set loading to true when saving changes
      const userDocRef = doc(db, "Users", user.uid);
      try {
        await setDoc(userDocRef, formData, { merge: true });
        console.log("Profile updated successfully!");
        // Redirect to profile page
        window.location.href = "/profile";
      } catch (error) {
        console.error("Error updating profile:", error.message);
      } finally {
        setLoading(false); // Set loading back to false after changes are saved
        alert("Changes saved successfully!"); // Alert when changes are saved
      }
    }
  };

  return (
    <div className="container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-dark">
          Save Changes
        </button>
        <button className="btn btn-dark">
          <Link to="/profile" className="text-decoration-none text-light">
            Back
          </Link>
        </button>
      </form>
      {loading && <div className="alert alert-info">Loading changes...</div>}
    </div>
  );
}

export default EditProfile;
