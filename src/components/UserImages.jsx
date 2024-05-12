import styles from "../styles/profile.module.scss";

import React, { useState, useEffect } from "react";
import { db } from "./firebase";

function UserImages({ userId }) {
  const [userImages, setUserImages] = useState([]);

  useEffect(() => {
    const fetchUserImages = async () => {
      if (!userId) return;

      const imagesRef = db.collection("images");
      const query = imagesRef.where("userId", "==", userId);
      const snapshot = await query.get();

      const images = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });

      setUserImages(images);
    };

    fetchUserImages();
  }, [userId]);

  return (
    <div className = "">
      <div className={`${styles.user_images}`}>
        {userImages.map((image) => (
          <div key={image.id} className="image-container">
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/drip-or-drop-dev.appspot.com/o/${encodeURIComponent(
                image.imageUrl
              )}?alt=media`}
              alt={image.description}
              className={`${styles.user_image}`}
            />
            <div className={`${styles.image_details}`}>
              <p>Description: {image.description}</p>
              <p>Tags: {image.tags.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserImages;
