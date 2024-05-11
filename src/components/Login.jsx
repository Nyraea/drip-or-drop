import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.scss";

import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
// import SignInwithGoogle from "./signInWIthGoogle";

import logo from "../assets/logo.svg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      window.location.href = "/homepage";
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="main">
      <form className="form" onSubmit={handleSubmit}>
        <img src={logo} alt="logo" className="logo" />
        <div className="header">
          
          <p className="header-l"><b>No account yet?</b></p>
          <p className="">
            <a className="header-r" href="/register"><b>Create your account</b></a>
          </p>
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="submit">
            Login
          </button>
        </div>
        {/* <SignInwithGoogle /> */}
      </form>
    </div>
  );
}

export default Login;
