import styles from "../styles/upload.module.scss";

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadString } from "firebase/storage";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
function ImageUpload() {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [user, setUser] = useState(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const storage = getStorage();
  const imagesRef = collection(db, "images");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleFileInputChange = (e) => {
    setSelectedFiles(e.target.files);
    setImages([]);
    for (let i = 0; i < e.target.files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prevImages) => [...prevImages, e.target.result]);
      };
      reader.readAsDataURL(e.target.files[i]);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTagChange = (e) => {
    setTagInputValue(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInputValue.trim() !== "") {
      setTags((prevTags) => [...prevTags, tagInputValue.trim()]);
      setTagInputValue("");
    }
  };

  const handleUpload = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    // Check if description is empty
    if (description.trim() === "") {
      alert("Please enter a description for the image.");
      return;
    }

    // Check if tags array is empty
    if (tags.length === 0) {
      alert("Please add at least one tag for the image.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload an image.");
      return;
    }

    for (let i = 0; i < images.length; i++) {
      try {
        const imageId = Date.now(); // Generate a unique timestamp for each image
        const timestamp = new Date().toISOString();
        const imageRef = ref(storage, `images/${user.uid}/${imageId}`); // Create a reference for the image
        await uploadString(imageRef, images[i], "data_url"); // Upload the image

        // Create a new document in the "images" collection
        const imageDoc = await addDoc(imagesRef, {
          userId: user.uid,
          description,
          tags,
          imageUrl: `images/${user.uid}/${imageId}`,
          upvote: 0,
          timestamp: timestamp,
          downvote: 0,
        });

        console.log("Image uploaded successfully!", imageDoc.id);

        // Show the success message popup
        alert("Image uploaded!");

        // Redirect to the profile using useHistory()
        navigate("/profile");
      } catch (error) {
        console.error("Error uploading image:", error.message);
      }
    }
  };

  return (
    // MAIN DIV
    <div className={`${styles.upload_section}`}>
      <h2>Upload a drip</h2>

      {/* UPLOAD FILE */}
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
        />
      </div>

      {/* UPLOAD DESCRIPTION */}
      <div className="mb-3">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className="form-control"
        />
      </div>

      {/* UPLOAD TAGS */}
      <div className="mb-3">
        <label>Tags:</label>
        <div className="d-flex">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="badge d-flex align-items-center bg-dark m-1"
            >
              {tag}
            </span>
          ))}

          {/* TAG INPUT */}
          <input
            type="text"
            value={tagInputValue}
            onChange={handleTagChange}
            className="form-control m-1"
          />

          {/* ADD TAG BUTTON */}
          <button
            className={`${styles.actions} ${styles.tags} ${styles.upload} m-1`}
            onClick={handleAddTag}
          >
            Add Tag
          </button>
        </div>
      </div>

      {/* UPLOAD PREVIEWS */}
      <div className={`${styles.uploadpreview}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="p-2"
            style={{
              width: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={image}
              alt={`image-${index}`}
              className="img-fluid rounded"
              style={{ maxHeight: "200px" }}
            />
          </div>
        ))}
      </div>

      {/* UPLOAD BUTTON */}
      <div className={`${styles.uploadpreview}`}>
        <button
          className={`${styles.actions} ${styles.upload}`}
          onClick={handleUpload}
        >
          Upload Drip
        </button>

        {/* BACK BUTTON */}
        <button className={`${styles.actions} ${styles.upload}`}>
          <Link to="/profile" className="text-decoration-none text-light my-1">
            Back
          </Link>
        </button>
      </div>

      <br />
      <br />
      <br />
    </div>
  );
}

export default ImageUpload;
