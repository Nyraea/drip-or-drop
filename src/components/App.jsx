import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "/App.css";
import "/index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Login";

import SignUp from "./Register";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./Profile";
import { useState } from "react";
import { auth } from "./firebase";
import ImageUpload from "./ImageUpload";
import Trending from "./Trending";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {user ? (
            <>
              <Route
                path="/profile"
                element={
                  <div className="auth-wrapper">
                    <div className="auth-inner">
                      <Profile />
                    </div>
                  </div>
                }
              />
              <Route
                path="/upload"
                element={
                  <div className="auth-wrapper">
                    <div className="auth-inner">
                      <ImageUpload />
                    </div>
                  </div>
                }
              />
            </>
          ) : (
            <>
              <Route
                path="/login"
                element={
                  <div className="auth-wrapper">
                    <div className="auth-inner">
                      <Login />
                    </div>
                  </div>
                }
              />
              <Route
                path="/register"
                element={
                  <div className="auth-wrapper">
                    <div className="auth-inner">
                      <SignUp />
                    </div>
                  </div>
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
