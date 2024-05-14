import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/trending.scss";

import { useCallback, useEffect, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { db } from "./firebase"; // Adjust the import path as needed
import { collection, query, where, getDocs } from "firebase/firestore";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;

function Trending() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUnsplashImages = async (query, page) => {
    const { data } = await axios.get(
      `${API_URL}?query=${query}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
        import.meta.env.VITE_API_KEY
      }`
    );
    return data;
  };

  const fetchFirebaseImages = async (queryText) => {
    const imagesRef = collection(db, "images");
    const q = query(imagesRef, where("tags", "array-contains", queryText));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const imageData = doc.data();
      return {
        ...imageData,
        imageUrl:
          `https://firebasestorage.googleapis.com/v0/b/drip-or-drop-dev.appspot.com/o/${encodeURIComponent(
            imageData.imageUrl
          )}?alt=media` || "/images/default_profile.jpg",
      };
    });
  };

  const fetchImages = useCallback(async () => {
    try {
      const queryText = searchInput.current.value;
      if (queryText) {
        setErrorMsg("");
        setLoading(true);

        const [unsplashData, firebaseImages] = await Promise.all([
          fetchUnsplashImages(queryText, page),
          fetchFirebaseImages(queryText),
        ]);

        console.log("Unsplash Data:", unsplashData.results);
        console.log("Firebase Data:", firebaseImages);

        const combinedImages = [
          ...firebaseImages.map((img) => ({ ...img, source: "firebase" })),
          ...unsplashData.results.map((img) => ({
            ...img,
            source: "unsplash",
          })),
        ];

        setImages(combinedImages);
        setTotalPages(unsplashData.total_pages);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later.");
      console.log(error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  return (
    <div className="trendingcontainer">
      <h1 className="trendingtitle">See what's drippin'</h1>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelection("Trending Fashion Shoes")}>
          Shoes
        </div>
        <div onClick={() => handleSelection("Trending Fashion Shirts")}>
          Shirts
        </div>
        <div onClick={() => handleSelection("Trending Fashion Dresses")}>
          Dresses
        </div>
        <div onClick={() => handleSelection("Trending Fashion Pants")}>
          Pants
        </div>
      </div>
      {loading ? (
        <>
          <SkeletonTheme height={350} width={250}>
            <div className="d-flex row justify-content-center w-100 px-5 mt-4 g-2">
              {[...Array(16)].map((_, index) => (
                <div className="d-flex justify-content-center col" key={index}>
                  <Skeleton containerClassName="flex-1" />
                </div>
              ))}
            </div>
          </SkeletonTheme>
          <br />
          <br />
          <br />
        </>
      ) : (
        <>
          <div className="images">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.urls ? image.urls.small : image.imageUrl}
                alt={image.alt_description || image.description}
                className="image"
              />
            ))}
          </div>
          <div className="buttons">
            {page > 1 && (
              <button onClick={() => setPage(page - 1)} className="previous">
                Previous
              </button>
            )}
            {page < totalPages && (
              <button onClick={() => setPage(page + 1)} className="next">
                Next
              </button>
            )}
          </div>
          <br />
          <br />
          <br />
        </>
      )}
    </div>
  );
}

export default Trending;
