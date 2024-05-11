import styles from "../styles/register.module.scss";

import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc, collection, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { query } from "firebase/firestore";

import logo from "../assets/logo.svg";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const checkUsernameExists = async (username) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("username", "==", username)); // Renamed 'query' to 'q'
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "bottom-center",
      });
      return;
    }

    try {
      // Check if username already exists
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        toast.error("Username already exists. Please choose another.", {
          position: "bottom-center",
        });
        return;
      }

      // Proceed with user registration
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          username: username,
          photo: "",
        });
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
      // Redirect the user to another page (e.g., login page)
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };
  return (
    <div className={styles.main}>
      <form className = {styles.form} onSubmit={handleRegister}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.header}>
          <p className={styles.header_l}> <b>Already have an account?</b></p>
          <p className="">
            <a className={styles.header_r} href="/Login"><b>Login here!</b></a>
          </p>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-grid">
          <button type="submit" className={styles.submit}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
export default Register;
