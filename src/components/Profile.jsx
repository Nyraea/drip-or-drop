import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/profile.scss";

import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [userImages, setUserImages] = useState([]);

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
          setUserDetails(docSnap.data());
        } else {
          console.log("User document does not exist");
        }
      });
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserImages = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          return; // Exit early if user is not logged in
        }

        const q = query(
          collection(db, "images"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });

        setUserImages(images);
      });
    };

    fetchUserImages();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (

    //MAIN DIV
    <div className="container-fluid">

      {/* ACCOUNT INFORMATION*/}
      <div className="row profile">

        {/* PROFILE PIC */}
        <div className="col-2">
          <div className="">
            {userDetails && userDetails.photo ? (
              <img
                src={userDetails.photo}
                className=""
                alt="Profile"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserCircle}
                style={{ color: "#000000" }}
                size="10x"
              />
            )}
          </div>
        </div>
        {/* PROFILE INFORMATION & ACTIONS */}
        <div className="col-4">
          <div className="">
            {userDetails ? (
              <>
                <p className="info">Username: {userDetails.username}</p>
                <p className="info">Email: {userDetails.email}</p>
                <p className="info">
                  {userDetails.firstName} {userDetails.lastName}
                </p>
              </>
            ) : (
              <p className="info">Loading...</p>
            )}
          </div>
          {/* LOGOUT & UPLOAD BUTTONS */}

          <div className="">
            <button className="actions" onClick={handleLogout}>
              Logout
            </button>
            <button className="actions">
              <Link to="/upload" className="">Go to Image Upload</Link>
            </button>
          </div>
        </div>
      </div>

      {/* USER UPLOADS */}
      <div className="uploads">

        {/* USER IMAGES MAP */}
        {userImages.map((image) => (
          <div key={image.id} className="upload_container">
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/drip-or-drop-dev.appspot.com/o/${encodeURIComponent(
                image.imageUrl
              )}?alt=media`}
              alt={image.description}
              className="upload"
            />
            <div className="upload_details">
              <p>Description: {image.description}</p>
              <p>Tags: {image.tags.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
