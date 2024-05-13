import styles from "../styles/edit.module.scss";

import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import farquad from "../assets/farquad.svg";

function EditProfile() {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [show, setShow] = useState(false); //MODAL STATE

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

    //MAIN DIV
    <div className={`${styles.edit_section}`}>

      {/* FORM */}
      <form onSubmit={handleSubmit}>

        {/* PROFILE PICTURE */}
        <div className="">
          <a href = "" onClick={(event) => {event.preventDefault(); handleShow();}}>
            <img src={farquad} alt = "sigma" className={`${styles.profile_pic}`}>

            </img>
          </a>
        </div>

        {/* USERNAME */}
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

          {/* FIRST NAME */}
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

        {/* LAST NAME */}
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

          {/* SAVE CHANGES */}
        <div className={`${styles.actions}`}>
          <button type="submit" className={`${styles.button}`}>
            Save Changes
          </button>

        {/* BACK BUTTON */}
          <button className={`${styles.button}`}>
            <Link to="/profile" className="text-decoration-none text-light my-1">
              Back
            </Link>
          </button>
        </div>
      </form>
      {loading && <div className="alert alert-info">Loading changes...</div>}

      {/* CHANGE DP MODAL */}
      <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title><b>Change Profile Picture</b></Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-center">
              
              <img src={farquad} alt = "sigma"/>

            </Modal.Body>
            <Modal.Footer className={`${styles.actions}`}>
            <button className={`${styles.button}`}>
                Upload 
              </button>
              <button className={`${styles.button}`} onClick={handleClose}>
                Cancel 
              </button>
            </Modal.Footer>
          </Modal>
        </>
    </div>
    
  );
}

export default EditProfile;
