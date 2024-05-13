import "../styles/discover.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  increment,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import loading from "../assets/loading.gif";

function Discover() {
  const [favorited, setFavorited] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const toggleFavorite = () => {
    setFavorited(!favorited);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === postId
          ? { ...post, isLiked: !post.isLiked, isDisliked: false }
          : post
      )
    );
    // Add your logic to update like status in the database using postId
    console.log("Toggle like for post with ID:", postId);
  };

  const toggleDislike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === postId
          ? { ...post, isDisliked: !post.isDisliked, isLiked: false }
          : post
      )
    );
    // Add your logic to update dislike status in the database using postId
    console.log("Toggle dislike for post with ID:", postId);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const usersCollectionRef = collection(db, "Users");
        const usersQuerySnapshot = await getDocs(usersCollectionRef);

        const fetchedPosts = [];

        for (const userDoc of usersQuerySnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;

          // Query the "images" collection based on the username
          const imagesCollectionRef = collection(db, "images");
          const imagesQuerySnapshot = await query(
            imagesCollectionRef,
            where("userId", "==", userId)
          );
          const imagesDocsSnapshot = await getDocs(imagesQuerySnapshot);

          imagesDocsSnapshot.forEach((imageDoc) => {
            const imageData = imageDoc.data();

            // Create post object if image data exists
            if (imageData) {
              const post = {
                username: userData.username || "Unknown User",
                profileImageUrl:
                  userData.profileImageUrl || "/images/default_profile.jpg",
                imageUrl:
                  `https://firebasestorage.googleapis.com/v0/b/drip-or-drop-dev.appspot.com/o/${encodeURIComponent(
                    imageData.imageUrl
                  )}?alt=media` || "/images/default_profile.jpg",
                isNSFW: imageData.isNSFW || false,
                caption: imageData.description || "",
                tags: imageData.tags || [],
                postId: imageDoc.id, // Add postId for unique identification
                isLiked: false, // Initialize isLiked status
                isDisliked: false, // Initialize isDisliked status
              };

              fetchedPosts.push(post);
            }
          });
        }

        setPosts(fetchedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  // DELAY UPLOADS RENDER BY 1.75 SECONDS
  const [delayedRender, setDelayedRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedRender(true);
    }, 1750);

    return () => clearTimeout(timer); // This will clear the timer when the component unmounts
  }, []);

  return (
    <div className="main_section">
      {posts ? (
        <div className="posts_container">
          {isLoading ? (
            <div className="uploads_loading">
              <img src={loading} className="icon" alt="Loading..." />
            </div>
          ) : (
            <div className="posts">
              {posts.map((post, index) => (
                <div key={index} className="post">
                  <div className="info">
                    <div className="person">
                      <img src={post.profileImageUrl} alt="Profile" />
                      <Link to={`/profile/${post.username}`}>
                        {post.username}
                      </Link>
                    </div>
                    <div className="more">
                      <img src="/images/show_more.png" alt="Show more" />
                    </div>
                  </div>

                  <div
                    className="image"
                    onClick={() => handleImageClick(post.imageUrl)}
                  >
                    {post.isNSFW ? (
                      <div className="image-nsfw-container">
                        <img
                          src={post.imageUrl}
                          alt="Post"
                          className="image-nsfw"
                        />
                        <div className="image-text">
                          <strong>Sensitive Content</strong>
                          <br />
                          This photo contains sensitive content which people may
                          find offensive or disturbing.
                        </div>
                      </div>
                    ) : (
                      <button
                        className="image"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(post.imageUrl);
                        }}
                      >
                        <img src={post.imageUrl} alt="Post" />
                      </button>
                    )}
                  </div>

                  <div className="desc">
                    <div className="icons">
                      <div className="icon_left d-flex">
                        <div
                          className="like"
                          onClick={() => toggleLike(post.postId)}
                        >
                          <img
                            src={
                              post.isLiked
                                ? "/images/dripclicked.png"
                                : "/images/drip.png"
                            }
                            alt="drip"
                          />
                        </div>
                        <div
                          className="like"
                          onClick={() => toggleDislike(post.postId)}
                        >
                          <img
                            src={
                              post.isDisliked
                                ? "/images/trashbagclicked.png"
                                : "/images/trashbag.png"
                            }
                            alt="trashbag"
                          />
                        </div>
                      </div>

                      <div className="save not_saved" onClick={toggleFavorite}>
                        <img src="/images/save-instagram.png" alt="Not Saved" />
                      </div>
                    </div>

                    <div className="liked">
                      <a className="">
                        {post.tags.map((tag) => `#${tag}`).join(", ")}
                      </a>
                    </div>

                    <div className="liked">
                      <a className="bold" href="">
                        {post.likes} likes
                      </a>
                    </div>

                    <div className="post_desc">
                      <p>
                        <a className="bold" href="">
                          {post.username}
                        </a>{" "}
                        {post.caption}
                      </p>
                      <p>
                        <a className="gray" href="">
                          View all {post.comments} comments
                        </a>
                      </p>
                      <input type="text" placeholder="Add a comment..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Skeleton Loading
        <div className="w-100">
          <Skeleton containerClassName="flex-1" />
          eggs
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <p>Modal Content Here</p>
          </div>
        </div>
      )}
      {/* Add a console.log to check showModal value */}
      {console.log("showModal:", showModal)}
    </div>
  );
}

export default Discover;
