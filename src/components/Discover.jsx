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
} from "firebase/firestore";
import { Link } from "react-router-dom";

import loading from "../assets/loading.gif";

function Discover() {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const usersCollectionRef = collection(db, "Users");
        const usersQuerySnapshot = await getDocs(usersCollectionRef);

        const fetchedPosts = [];

        for (const userDoc of usersQuerySnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;
          console.log("User data:", userData);

          // Query the "images" collection based on the username
          const imagesCollectionRef = collection(db, "images");
          const imagesQuerySnapshot = await query(
            imagesCollectionRef,
            where("userId", "==", userId)
          );
          const imagesDocsSnapshot = await getDocs(imagesQuerySnapshot);

          imagesDocsSnapshot.forEach((imageDoc) => {
            const imageData = imageDoc.data();
            console.log("Image data:", imageData);

            // Create post object if image data exists
            if (imageData) {
              const post = {
                username: userData.username || "Unknown User",
                profileImageUrl:
                  userData.profileImageUrl || "/images/images1.jpg",
                imageUrl: imageData.imageUrl || "/images/images1.jpg",
                isNSFW: imageData.isNSFW || false,
              };

              fetchedPosts.push(post);
            }
          });
        }

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleFavorite = () => {
    setFavorited(!favorited);
  };

  return (
    <div className="main_section">
      <div className="posts_container">
        {/*Top part*/}
        <div className="posts">
          {posts.map((post, index) => (
            <div key={index} className="post">
              {/* Render post content */}
              <div className="info">
                <div className="person">
                  <img src={post.profileImageUrl} alt="Profile" />
                  <a href="">{post.username}</a>
                </div>
                <div className="more">
                  <img src="/images/show_more.png" alt="Show more" />
                </div>
              </div>

              <div className="image">
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
                  <img src={post.imageUrl} alt="Post" />
                )}
              </div>

              <div className="desc">
                <div className="icons">
                  <div className="icon_left d-flex">
                    <div className="like" onClick={toggleLike}>
                      <img src="/images/heart.png" alt="Heart" />
                    </div>
                  </div>

                  <div className="save not_saved" onClick={toggleFavorite}>
                    <img src="/images/save-instagram.png" alt="Not Saved" />
                  </div>
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
      </div>
    </div>
  );
}

export default Discover;
