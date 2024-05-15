import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/profile.module.scss";
import "../styles/global.scss";
import "react-loading-skeleton/dist/skeleton.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import loading from "../assets/loading.gif";
import Modal from "react-bootstrap/Modal";
import farquad from "../assets/farquad.svg";

function UserProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [userImages, setUserImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [totalUpvotes, setTotalUpvotes] = useState(0);
  const [totalDownvotes, setTotalDownvotes] = useState(0);
  const { username } = useParams();

  const handleImageClick = (imageUrl, description, tags, id) => {
    setSelectedImage({ imageUrl, description, tags, id });
    setSelectedDescription(description);
    setSelectedTags(tags);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // FETCH USER DATA
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(
          collection(db, "Users"),
          where("username", "==", username)
        );
        const querySnapshot = await getDocs(q);

        // Check if user data exists
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserDetails(userData);
        } else {
          console.log("User not found");
          // You can set some default or error state here if needed
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        // Handle the error accordingly
      }
    };

    fetchUserData();
  }, [username]);

  // FETCH USER IMAGES
  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        // Query the Users collection to get the userId based on the username
        const usersCollectionRef = collection(db, "Users");
        const userQuerySnapshot = await getDocs(
          query(usersCollectionRef, where("username", "==", username))
        );

        if (userQuerySnapshot.empty) {
          console.log("User not found");
          // Handle the case where the user is not found
          return;
        }

        const userId = userQuerySnapshot.docs[0].id;

        // Query the images collection based on the userId
        const imagesCollectionRef = collection(db, "images");
        const imagesQuerySnapshot = await getDocs(
          query(imagesCollectionRef, where("userId", "==", userId))
        );

        const images = imagesQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserImages(images);
        setImageCount(images.length);

        const totalUpvotes = images.reduce(
          (sum, image) => sum + (image.upvote || 0),
          0
        );
        setTotalUpvotes(totalUpvotes);

        const totalDownvotes = images.reduce(
          (sum, image) => sum + (image.downvote || 0),
          0
        );
        setTotalDownvotes(totalDownvotes);
      } catch (error) {
        console.error("Error fetching user images:", error.message);
        // Handle the error accordingly
      }
    };

    fetchUserImages();
  }, [username]);

  const averageDrip = (
    ((totalUpvotes - totalDownvotes) / (totalUpvotes + totalDownvotes || 1)) *
    5
  ).toFixed(2);

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

            {/* TOTAL DRIP UPVOTE */}
            <div className="d-flex flex-column justify-content-center align-items-center col-2 px-2">
              <h6>drip upvotes</h6>
              <br />
              <h4>{totalUpvotes}</h4>
            </div>

            {/* AVERAGE DRIP*/}
            <div className="d-flex flex-column justify-content-center align-items-center col-2 px-2">
              <h6>drip score</h6>
              <br />
              <h4>{averageDrip}</h4>
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
              <a>
                <img
                  src={userDetails.profilePic}
                  className={`${styles.profile_pic}`}
                  alt="Profile"
                />
              </a>
            ) : (
              <a href="">
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
      </div>

      {/* USER UPLOADS */}
      {userImages && delayedRender ? (
        <>
          <div className="d-flex justify-content-center mt-3">
            <h2 className={`${styles.uploads_title}`}>my drips</h2>
          </div>
          <br />
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
      {/* IMAGE DETAILS */}
      <Modal show={showPopup} onHide={handleClosePopup}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Dripscription</h3>
          </Modal.Title>
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
              <div className="borderedsquare">
                <p>{selectedDescription}</p>
              </div>
              <div className="borderedsquare">
                <p>Tags: {selectedTags.join(", ")}</p>{" "}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserProfile;
