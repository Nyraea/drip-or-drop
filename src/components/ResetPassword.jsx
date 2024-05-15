import "bootstrap/dist/css/bootstrap.min.css";

import styles from "../styles/resetpassword.module.scss";

import React, { useState } from "react";
import {
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    // Reauthenticate the user before changing the password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // Reauthentication successful, update the password
        updatePassword(user, newPassword)
          .then(() => {
            setSuccessMessage("Password has been updated successfully.");
            setErrorMessage("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          })
          .catch((error) => {
            setSuccessMessage("");
            setErrorMessage(`Error updating password: ${error.message}`);
          });
      })
      .catch((error) => {
        setSuccessMessage("");
        setErrorMessage(`Error reauthenticating user: ${error.message}`);
      });
  };

  return (
    <div className={styles.main}>
      <h2>Reset Password</h2>
      <form className={`${styles.main}`} onSubmit={handleSubmit}>
        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={handleChangeCurrentPassword}
        />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={handleChangeNewPassword}
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleChangeConfirmPassword}
        />
        <button className={`${styles.resetbtn}`} type="submit">
          Reset Password
        </button>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default ResetPassword;
