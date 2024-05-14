import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/app.module.scss";

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
import Discover from "./Discover";
import EditProfile from "./EditProfile";
import Footer from "./Footer";
import ResetPassword from "./ResetPassword";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Router>
      {user && <Navbar />}
      <div className={styles.canvas}>
        <Routes>
          {/*IF LOGIN SUCCESSFUL, GRANT ACCESS TO PROTECTED ROUTES*/}
          {user ? (
            <>
              <Route path="/edit" element={<EditProfile />} />
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/images" element={<UserImages />} />
              <Route path="/upload" element={<ImageUpload />} />
              <Route path="/resetpass" element={<ResetPassword />} />
            </>
          ) : (
            <>
              {/*ELSE RESTRICT TO LOGIN OR REGISTER*/}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
            </>
          )}

          {/*UNPROTECTED TRENDING PAGE*/}
          <Route path="/trending" element={<Trending />} />

          {/*REDIRECT TO HOMEPAGE IF USER IS LOGGED IN*/}
          <Route
            path="*"
            element={
              user ? <Navigate to="/homepage" /> : <Navigate to="/login" />
            }
          />
        </Routes>
        <ToastContainer />
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;
