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

const post_data = [
  [
    "./images/images7.jpg",
    "t0hyang",
    45,
    "./images/post2.jpg",
    2,
    "coffee not effective on this dude",
    2,
    "not-nsfw",
  ],
  [
    "./images/images1.jpg",
    "zeke",
    1,
    "./images/postnsfw.jpg",
    2,
    "Why is this tagged NSFW",
    1,
    "NSFW",
  ],
];

export { post_data };

function Discover() {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

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
          {post_data.map((post, i) => (
            <div key={i} className="post">
              <div className="info">
                <div className="person">
                  <img src={post[0]} alt="Profile" />
                  <a href="">{post[1]}</a>
                  {/* <span className="circle">.</span>
                  <span>{post[2]}m</span> */}
                </div>
                <div className="more">
                  <img src="./images/show_more.png" alt="Show more" />
                </div>
              </div>

              {/* Div class for image and if statement for NSFW */}
              <div className="image">
                {post[7] === "NSFW" ? (
                  <div className="image-nsfw-container">
                    <img src={post[3]} alt="Post" className="image-nsfw" />{" "}
                    {/* Displaying the image */}
                    <div className="image-text">
                      <strong>Sensitive Content</strong>
                      <br />
                      This photo contains sensitive content which people may
                      find offensive or disturbing.
                    </div>
                    {}
                  </div>
                ) : (
                  <img src={post[3]} alt="Post" />
                )}
              </div>

              {/* Div class for Description  */}
              <div className="desc">
                <div className="icons">
                  <div className="icon_left d-flex">
                    <div className="like" onClick={toggleLike}>
                      {liked ? (
                        <img src="./images/heart.png" alt="Heart" />
                      ) : (
                        <img src="./images/love.png" alt="Love" />
                      )}
                    </div>
                  </div>

                  <div className="save not_saved" onClick={toggleFavorite}>
                    {favorited ? (
                      <img src="./images/save_black.png" alt="Saved" />
                    ) : (
                      <img src="./images/save-instagram.png" alt="Not Saved" />
                    )}
                  </div>
                </div>

                <div className="liked">
                  <a className="bold" href="">
                    {post[4]} likes
                  </a>
                </div>
                <div className="post_desc">
                  <p>
                    <a className="bold" href="">
                      {post[1]}
                    </a>{" "}
                    {post[5]}
                  </p>
                  <p>
                    <a className="gray" href="">
                      View all {post[6]} comments
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
