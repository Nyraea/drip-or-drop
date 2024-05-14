import styles from "../styles/edit.module.scss";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { auth, db, storage } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import farquad from "../assets/farquad.svg";
import load from "../assets/loading.gif";

function EditProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    bio: "", // Added bio field
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [profilePic, setProfilePic] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchUserData = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          console.log("User is not logged in");
          return;
        }

        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDetails(userData);
          setFormData(userData);
          setProfilePic(userData.profilePic || farquad);
        } else {
          console.log("User document does not exist");
        }
      });
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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    const storageRef = ref(
      storage,
      `profilePictures/${auth.currentUser.uid}/${image.name}`
    );
    await uploadBytes(storageRef, image);

    const downloadURL = await getDownloadURL(storageRef);
    setProfilePic(downloadURL);

    const userDocRef = doc(db, "Users", auth.currentUser.uid);
    await setDoc(userDocRef, { profilePic: downloadURL }, { merge: true });

    setLoading(false);
    handleClose();
  };

  const checkUsernameExists = async (username) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      const { username, firstName, lastName, bio } = formData;
      if (!username || !firstName || !lastName) {
        alert("Please fill in all required fields.");
        return;
      }

      setLoading(true);
      try {
        if (username !== userDetails.username) {
          const usernameExists = await checkUsernameExists(username);
          if (usernameExists) {
            alert(
              "Username already exists. Please choose a different username."
            );
            setLoading(false);
            return;
          }
        }

        const userDocRef = doc(db, "Users", user.uid);
        await setDoc(userDocRef, formData, { merge: true });
        console.log("Profile updated successfully!");
        window.location.href = "/profile";
      } catch (error) {
        console.error("Error updating profile:", error.message);
      } finally {
        setLoading(false);
        alert("Changes saved successfully!");
      }
    }
  };

  return (
    <div className={`${styles.edit_section}`}>
      <br />
      <br />
      {userDetails ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="">
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handleShow();
                }}
              >
                <img
                  src={profilePic}
                  alt="Profile"
                  className={`${styles.profile_pic}`}
                />
              </a>
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`${styles.input} form-control`}
                id="username"
                name="username"
                placeholder={userDetails.username}
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
                className={`${styles.input} form-control`}
                id="firstName"
                name="firstName"
                placeholder={userDetails.firstName}
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
                className={`${styles.input} form-control`}
                id="lastName"
                name="lastName"
                placeholder={userDetails.lastName}
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">
                {" "}
                {/* Added label for bio */}
                Bio
              </label>
              <textarea
                className={`${styles.input} form-control`}
                id="bio"
                name="bio"
                placeholder={userDetails.bio}
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <br/>
            <br/>
            <div className={`${styles.actions}`}>
              {loading ? (
                <button className={`${styles.save}`}>
                  <img src={load} alt = "..." className={`${styles.loading}`}/>
                </button>
              ) : (              
              <button type="submit" className={`${styles.button}`}>
                Save Changes
              </button>)}
              <br/>
              <br/>
                <Link to="/profile" className={`${styles.button} text-center`}>
                  Back
                </Link>
            </div>
          </form>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <b>Change Profile Picture</b>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-center">
              <div>
                <input type="file" onChange={handleImageChange} />
              </div>
            </Modal.Body>
            <Modal.Footer className={`${styles.actions}`}>
              <button className={`${styles.button}`} onClick={handleUpload}>
                Upload
              </button>
              <button className={`${styles.button}`} onClick={handleClose}>
                Cancel
              </button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <div className={`${styles.loading}`}>
          <img src={load} alt="loading" className={`${styles.load}`} />
        </div>
      )}
      <br />
      <br />
      <br />
    </div>
  );
}

export default EditProfile;
