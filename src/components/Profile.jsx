import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/profile.module.scss";
import "../styles/global.scss";

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
import loading from "../assets/loading.gif";

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

  // DELAY UPLOADS RENDER BY 1.75 SECONDS
  const [delayedRender, setDelayedRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedRender(true);
    }, 1750);

    return () => clearTimeout(timer); // This will clear the timer when the component unmounts
  }, []);

  return (

    //MAIN DIV
    <div className="container-fluid">

      {/* ACCOUNT INFORMATION*/}
      <div className={`row ${styles.profile}`}>

        {/* PROFILE PIC */}
        <div className="col-2 center">
          <div className="">
            {userDetails && userDetails.photo ? (
              
                <a href = "" onClick={(event) => event.preventDefault()}>
                  <img
                    src={userDetails.photo}
                    className={`${styles.profile_pic}`}
                    alt="Profile"
                  />
                </a>
            ) : (
              <a href = "" onClick={(event) => event.preventDefault()}>
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className={`${styles.default_pic}`}
                  style={{ color: "#000000" }}
                  size="10x"
                />
              </a>
            )}
          </div>
        </div>

        {/* PROFILE INFORMATION & ACTIONS */}
        {userDetails ? (
          <>
            <div className="col-4">

              {/* PROFILE INFO */}
              <div className="">

                <p className={`${styles.info}`}>Username: {userDetails.username}</p>
                <p className={`${styles.info}`}>Email: {userDetails.email}</p>
                <p className={`${styles.info}`}>
                  {userDetails.firstName} {userDetails.lastName}
                </p>

              </div>

              {/* LOGOUT & UPLOAD BUTTONS */}
              <div className="">
                <button className={`${styles.actions}`} onClick={handleLogout}>
                  Logout
                </button>
                <button className={`${styles.actions}`}>
                  <Link to="/upload" className="">Upload </Link>
                </button>
              </div>

             </div>
          </>
            ) : (
              <div className="col-4 d-flex">
                <img src={loading} className={`${styles.icon}`} alt="" />
                </div>
            )}
      </div>

      {/* USER UPLOADS */}
      {userImages && delayedRender ? (
      <div className={`${styles.uploads}`}>
        
        {/* USER IMAGES MAP */}
        {userImages.map((image) => (
          <div key={image.id} className={`${styles.upload_container}`}>
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/drip-or-drop-dev.appspot.com/o/${encodeURIComponent(
                image.imageUrl
              )}?alt=media`}
              alt={image.description}
              className={`${styles.upload}`}
            />
            <div className={`${styles.upload_details}`}>
              <p>Description: {image.description}</p>
              <p>Tags: {image.tags.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
      ) : (
          <div className={`${styles.uploads_loading}`}>
            <img src={loading} className={`${styles.icon}`} alt="" />
          </div>
        )}
    </div>
  );
}

export default Profile;
