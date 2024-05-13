import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/profile.module.scss";
import "../styles/global.scss";
import 'react-loading-skeleton/dist/skeleton.css'

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

import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import loading from "../assets/loading.gif";
import farquad from "../assets/farquad.svg";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [show, setShow] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false); // State for the settings popup
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
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

  const handleSettings = () => {
    setShowSettingsPopup(true);
  };

  const handleCloseSettingsPopup = () => {
    setShowSettingsPopup(false);
  };

  const handleAction1 = () => {
    // Handle action 1
  };

  const handleAction2 = () => {
    // Show the logout confirmation popup
    setShowLogoutConfirmation(true);
  };
  
  const handleLogoutConfirmation = () => {
    // Perform logout action
    handleLogout();
    // Close the logout confirmation popup
    setShowLogoutConfirmation(false);
  };
  
  const handleCloseLogoutConfirmation = () => {
    // Close the logout confirmation popup without logging out
    setShowLogoutConfirmation(false);
  };
  return (

    //MAIN DIV
    <div className="w-100">

      {/* ACCOUNT INFORMATION*/}
      <div className={` ${styles.profile}`}>

        {userDetails ? (
          <>
            {/* TOTAL DRIP */}
            <div className="d-flex flex-column justify-content-center align-items-center col-1 px-2">
              <h6>total drip</h6>
              <br/>
              <h4>455</h4>
            </div>

            {/* AVERAGE DRIP*/}
            <div className="d-flex flex-column justify-content-center align-items-center col-2 px-2">
              <h6>average drip</h6>
              <br/>
              <h4>69420</h4>
            </div>

            {/* DRIP SCORE */}
            <div className="d-flex flex-column justify-content-center align-items-center col-2 px-2">
              <h6>drip score</h6>
              <br/>
              <h4>80085</h4>
            </div>
          </>
        ): (
          <>
            {/* TOTAL DRIP SKELETON */}
            <div className="d-flex flex-column col-1 px-2">
              <Skeleton containerClassName="flex-1"/>
              <br/>
              <Skeleton containerClassName="flex-1" className={`${styles.sk_total}`}/>
            </div>

            {/* AVERAGE DRIP SCORE SKELETON*/}
            <div className="d-flex flex-column col-2 px-2">
              <Skeleton containerClassName="flex-1"/>
              <br/>
              <Skeleton containerClassName="flex-1" className={`${styles.sk_average}`}/>
            </div>

            {/* DRIP SCORE SKELETON*/}
            <div className="d-flex flex-column col-2 px-2">
              <Skeleton containerClassName="flex-1"/>
              <br/>
              <Skeleton containerClassName="flex-1" className={`${styles.sk_score}`}/>
            </div>
          </>
        )}


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
              <a href = "" onClick={(event) => {event.preventDefault(); handleShow();}}>
                <img src={farquad} alt = "sigma">

                </img>
              </a>
            )}
          </div>
        </div>

        {/* PROFILE INFORMATION & ACTIONS */}
        {userDetails ? (
          <>
            <div className="d-flex flex-column justify-content-center col-2">

              {/* PROFILE INFO */}
              <div className="">

                <h2 className={`${styles.info}`}>{userDetails.username}</h2>

              </div>

              <div className="">

                <p className={`${styles.info}`}>Lorem ipsum solanum toberosum</p>

              </div>

            </div>
          </>
            ) : (
          <>
            <div className="col-2">

              {/* PROFILE INFO SKELETON */}
              <div className="">

                <Skeleton containerClassName="flex-1" className={`${styles.sk_username}`}/>

              </div>

              <br/>

              <div className="">

                <Skeleton count={4} containerClassName="flex-1" className={`${styles.sk_bio}`}/>

              </div>

            </div>
          </>
            )}

        {userDetails ? (
          <>
            {/* UPLOAD & EDIT PROFILE BUTTONS */}
            <div className="d-flex flex-column justify-content-around align-items-center col-2 ">
              <div className={`${styles.actions}`}>
                <Link to="/upload" className={`${styles.button}`}> Upload Image </Link>
              </div>
          {/* Settings (gear icon) button */}
          <Button variant="outline-secondary" onClick={handleSettings}>
            <FontAwesomeIcon
              icon={faCog}
              style={{ color: "#000000" }}
              size="lg"
            />
          </Button>
        </div>
          </>
        ): (
          <>
            {/* UPLOAD & EDIT PROFILE SKELETON */}
            <div className={`d-flex flex-column justify-content-around offset-1 col-2`}>

              {/* EDIT PROFILE SKELETON */}
              <Skeleton containerClassName="flex-1" className={`${styles.sk_edit}`}/>
            
            </div>
          </>
        )}
      </div>

      {/* USER UPLOADS */}
      {userImages && delayedRender ? (
      <>
        <div className="d-flex justify-content-center mt-3">
          <h2 className={`${styles.uploads_title}`}>my drips</h2>  
        </div>
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
      </>
      ) : (
        <>
        <SkeletonTheme height={350} width={250}>
          <div className="d-flex row justify-content-center w-100 px-5 mt-4 g-2">
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
            <div className="d-flex justify-content-center col">
              <Skeleton containerClassName="flex-1" />
            </div>
          </div>
        </SkeletonTheme>
      </>
        )}

        {/* CHANGE DP MODAL */}
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title><b>Change Profile Picture</b></Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex justify-content-center">
              <FontAwesomeIcon
                  icon={faUserCircle}
                  style={{ color: "#000000" }}
                  size="10x"
              />
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

         {/* ACCOUNT SETTINGS MODAL */}
        <Modal show={showSettingsPopup} onHide={handleCloseSettingsPopup}>
          <Modal.Body className="d-flex flex-column align-items-center">
            <Button variant="primary" onClick={handleAction1}>
              Settings
            </Button><br></br><br></br>
            <Button variant="secondary" onClick={handleAction2}>
              Log Out
            </Button>
          {/* Add more buttons or content as needed */}
          </Modal.Body>
          <Modal.Footer className="d-flex flex-column align-items-center">
            <Button variant="secondary" onClick={handleCloseSettingsPopup}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

      <Modal show={showLogoutConfirmation} onHide={handleCloseLogoutConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Logout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogoutConfirmation}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogoutConfirmation}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>

    
  );
}

export default Profile;
