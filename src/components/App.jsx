import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.scss";

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Login";
import SignUp from "./Register";
import Profile from "./Profile";
import ImageUpload from "./ImageUpload";
import Trending from "./Trending";
import UserImages from "./UserImages";
import Homepage from "./Homepage";
import Navbar from "./Navbar";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Router>
      <div className="canvas">
        {user && <Navbar/> }
        <Routes>
          {user ? (
            <>
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/images" element={<UserImages />} />
              <Route path="/upload" element={<ImageUpload />} />
            </>
          ) : (
            <>
              <Route
                path="/login"
                element={
                      <Login />
                }
              />
              <Route
                path="/register"
                element={
                      <SignUp />
                }
              />
            </>
          )}
          <Route path="/trending" element={<Trending />} />
          <Route
            path="*"
            element={
              user ? <Navigate to="/profile" /> : <Navigate to="/login" />
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
