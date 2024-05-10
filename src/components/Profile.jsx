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
import "bootstrap/dist/css/bootstrap.min.css";
import "/profile.css";
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
    <div className="container">
      <div className="row">
        <div className="col-md-2">
          <div className="profile-pic">
            {userDetails && userDetails.photo ? (
              <img
                src={userDetails.photo}
                className="profile-image"
                alt="Profile"
              />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} size="10x" />
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="profile-info">
            {userDetails ? (
              <>
                <p>Username: {userDetails.username}</p>
                <p>Email: {userDetails.email}</p>
                <p>
                  {userDetails.firstName} {userDetails.lastName}
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="actions">
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
            <button className="btn btn-primary">
              <Link to="/upload">Go to Image Upload</Link>
            </button>
          </div>
        </div>
      </div>
      <div className="user-images">
        {userImages.map((image) => (
          <div key={image.id} className="image-container">
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/drip-or-drop-dev.appspot.com/o/${encodeURIComponent(
                image.imageUrl
              )}?alt=media`}
              alt={image.description}
              className="user-image"
            />
            <div className="image-details">
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
