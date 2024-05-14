import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/profile.module.scss";
import "../styles/global.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import loading from "../assets/loading.gif";
import farquad from "../assets/farquad.svg";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [userImages, setUserImages] = useState([]);
  const [show, setShow] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false); // State for the settings popup
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showPopupButtons, setShowPopupButtons] = useState(false); // State for the new popup
  const [selectedAction, setSelectedAction] = useState("");
  const [editableDescription, setEditableDescription] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [totalUpvotes, setTotalUpvotes] = useState(0);

  const handleImageClick = (imageUrl, description, tags, id) => {
    setSelectedImage({ imageUrl, description, tags, id });
    setSelectedDescription(description);
    setSelectedTags(tags);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleDeletePost = async () => {
    try {
      const user = auth.currentUser;
      if (user && selectedImage && selectedImage.id) {
        const postRef = doc(db, "images", selectedImage.id); // Use selectedImage.id
        await deleteDoc(postRef);
        console.log("Post deleted successfully!");

        // Remove the deleted image from the state
        setUserImages((prevImages) =>
          prevImages.filter((image) => image.id !== selectedImage.id)
        );

        // Close the popup modal after deletion
        handleClosePopup();
        handleClosePopupButtons(); // Close the popup buttons modal
      } else {
        console.log("User not logged in or no image selected");
      }
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  const handleEditDescription = () => {
    setEditableDescription(selectedDescription);
    setEditingDescription(true);
    handleClosePopupButtons();
  };
  const updateDescriptionInDatabase = async (newDescription) => {
    const user = auth.currentUser;
    if (user && selectedImage && selectedImage.id) {
      try {
        const imageRef = doc(db, "images", selectedImage.id);
        await updateDoc(imageRef, {
          description: newDescription,
        });
        console.log("Description updated in the database");

        // Update the description in the local state
        setUserImages((prevImages) =>
          prevImages.map((image) =>
            image.id === selectedImage.id
              ? { ...image, description: newDescription }
              : image
          )
        );
      } catch (error) {
        console.error("Error updating description:", error.message);
      }
    }
  };
  const handleSaveDescription = () => {
    setSelectedDescription(editableDescription);
    setEditingDescription(false);
    handleClosePopupButtons(); // Close the popup after saving
    updateDescriptionInDatabase(editableDescription); // Update the description in the database
  };

  // Use Effect to update userDetails after description changes
  useEffect(() => {
    if (userDetails) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        description: editableDescription,
      }));
    }
  }, [editableDescription]);

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
          return;
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
        setImageCount(images.length);

        const totalUpvotes = images.reduce(
          (sum, image) => sum + (image.upvote || 0),
          0
        );
        setTotalUpvotes(totalUpvotes);
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

  const handleAction1 = () => {};

  const handleAction2 = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirmation = () => {
    handleLogout();
    setShowLogoutConfirmation(false);
  };

  const handleCloseLogoutConfirmation = () => {
    setShowLogoutConfirmation(false);
  };

  const handleShowPopupButtons = () => {
    setShowPopupButtons(true);
  };

  const handleClosePopupButtons = () => {
    setShowPopupButtons(false);
  };

  const DeleteAction = () => {
    setSelectedAction("Action 2");
    handleDeletePost();
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
              <br />
              <h4>{imageCount}</h4>
            </div>

            {/* DRIP SCORE */}
            <div className="d-flex flex-column justify-content-center align-items-center col-1 px-2">
              <h6>drip score</h6>
              <br />
              <h4>{totalUpvotes}</h4>
            </div>
          </>
        ) : (
          <>
            {/* TOTAL DRIP SKELETON */}
            <div className="d-flex flex-column justify-content-center offset-1 col-1 px-2">
              <Skeleton containerClassName="flex-1" />
              <br />
              <Skeleton
                containerClassName="flex-1"
                className={`${styles.sk_total}`}
              />
            </div>

            {/* AVERAGE DRIP SCORE SKELETON*/}
            <div className="d-flex flex-column justify-content-center col-2 px-2">
              <Skeleton containerClassName="flex-1" />
              <br />
              <Skeleton
                containerClassName="flex-1"
                className={`${styles.sk_average}`}
              />
            </div>

            {/* DRIP SCORE SKELETON*/}
            <div className="d-flex flex-column justify-content-center col-1 px-2">
              <Skeleton containerClassName="flex-1" />
              <br />
              <Skeleton
                containerClassName="flex-1"
                className={`${styles.sk_score}`}
              />
            </div>
          </>
        )}

        {/* PROFILE PIC */}
        <div className={` col-2 center`}>
          <div className="">
            {userDetails && userDetails.profilePic ? (
              <a href="" onClick={(event) => event.preventDefault()}>
                <img
                  src={userDetails.profilePic}
                  className={`${styles.profile_pic}`}
                  alt="Profile"
                />
              </a>
            ) : (
              <a
                href=""
                onClick={(event) => {
                  event.preventDefault();
                  handleShow();
                }}
              >
                <img
                  className={`${styles.profile_pic}`}
                  src={farquad}
                  alt="sigma"
                ></img>
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
                <p className={`${styles.info}`}>{userDetails.bio}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-2">
              {/* PROFILE INFO SKELETON */}
              <div className="">
                <Skeleton
                  containerClassName="flex-1"
                  className={`${styles.sk_username}`}
                />
              </div>

              <br />

              <div className="">
                <Skeleton
                  count={4}
                  containerClassName="flex-1"
                  className={`${styles.sk_bio}`}
                />
              </div>
            </div>
          </>
        )}

        {userDetails ? (
          <>
            {/* UPLOAD & EDIT PROFILE BUTTONS */}
            <div className="d-flex flex-column justify-content-around align-items-center col-2 ">
              <div className={`${styles.actions}`}>
                <Link to="/upload" className={`${styles.button}`}>
                  {" "}
                  Upload Image{" "}
                </Link>
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
        ) : (
          <>
            {/* UPLOAD & EDIT PROFILE SKELETON */}
            <div
              className={`d-flex flex-column justify-content-around offset-1 col-2`}
            >
              {/* EDIT PROFILE SKELETON */}
              <Skeleton
                containerClassName="flex-1"
                className={`${styles.sk_edit}`}
              />

              <Skeleton
                containerClassName="flex-1"
                className={`${styles.sk_settings}`}
              />
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
                  onClick={() =>
                    handleImageClick(
                      image.imageUrl,
                      image.description,
                      image.tags,
                      image.id
                    )
                  }
                />
                <div className={`${styles.upload_details}`}>
                  <p>Description: {image.description}</p>
                  <p>Tags: {image.tags.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
          <br />
          <br />
          <br />
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
          <br />
          <br />
          <br />
        </>
      )}

      {/* CHANGE DP MODAL */}
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <b>Change Profile Picture</b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <FontAwesomeIcon
              icon={faUserCircle}
              style={{ color: "#000000" }}
              size="10x"
            />
          </Modal.Body>
          <Modal.Footer className={`${styles.actions}`}>
            <button className={`${styles.button}`}>Upload</button>
            <button className={`${styles.button}`} onClick={handleClose}>
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </>

      {/* ACCOUNT SETTINGS MODAL */}
      <Modal show={showSettingsPopup} onHide={handleCloseSettingsPopup}>
        <Modal.Body className="d-flex flex-column align-items-center">
          <Link to="/resetpass" variant="primary">
            Reset Password
          </Link>
          <br></br>
          <br></br>
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

      <Modal
        show={showLogoutConfirmation}
        onHide={handleCloseLogoutConfirmation}
      >
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
      <Modal show={showPopup} onHide={handleClosePopup}>
        <Modal.Header closeButton>
          <Modal.Title>Image Details</Modal.Title>
          {/* Move the pencil icon here */}
          <FontAwesomeIcon
            icon={faEllipsisV}
            onClick={handleShowPopupButtons}
            style={{ cursor: "pointer", marginLeft: "250px" }} // Align to the right
          />
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div className={`${styles.upload_container}`}>
              <img
                src={`https://firebasestorage.googleapis.com/v0/b/drip-or-drop-dev.appspot.com/o/${encodeURIComponent(
                  selectedImage.imageUrl
                )}?alt=media`}
                alt={selectedImage.description}
                className={`${styles.upload}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
                // Ensure the whole image is visible
              />
              <p>Description: {selectedDescription}</p>
              <p>Tags: {selectedTags.join(", ")}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={editingDescription}
        onHide={() => setEditingDescription(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={editableDescription}
            onChange={(e) => setEditableDescription(e.target.value)}
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setEditingDescription(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveDescription}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Popup buttons */}
      <Modal show={showPopupButtons} onHide={handleClosePopupButtons}>
        <Modal.Body
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: "1",
            }}
          >
            <Button
              variant="primary"
              onClick={handleEditDescription}
              style={{ width: "100%" }}
            >
              Edit
            </Button>
            <br />
            <Button
              variant="primary"
              onClick={DeleteAction}
              style={{ width: "100%" }}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Profile;
