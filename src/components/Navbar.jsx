import styles from "../styles/navbar.module.scss";

import { Link } from "react-router-dom";
import React, { useState } from 'react';

import logo from "../assets/logo.svg";

function Navbar() {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  
  return (
    <nav className={`fixed-top ${styles.navbar}`}>
      <div className={`${styles.main}`}>
        {/* LINKS */}
        <div className={`col-1 ${styles.navcol}`}>
          <Link to="/homepage" className={` ${styles.link}`}>
            home
          </Link>
        </div>

        <div className={`col-1 ${styles.navcol}`}>
          <Link to="/discover" className={` ${styles.link}`}>
            discover
          </Link>
        </div>

        <div className={`col-1 ${styles.navcol}`}>
          <Link to="/trending" className={` ${styles.link}`}>
            {" "}
            trending{" "}
          </Link>
        </div>

        {/* LOGO */}
        <div className="col-4">
          <a href="">
            <img src={logo} alt="logo" className={styles.logo} />
          </a>
        </div>

        {/* LINKS */}
        <div className={`col-1 ${styles.navcol} ${styles.dropdown}`} onMouseLeave={() => setDropdownOpen(false)}>
          <div onClick={() => setDropdownOpen(!dropdownOpen)}>
            <a href="" onClick={(event) => event.preventDefault()} className={` ${styles.link}`}> notifications</a>
          </div>
          {dropdownOpen && (
            <div className={`${styles.dropdownMenu} p-2`} onMouseLeave={() => setDropdownOpen(false)}>
              <p className={styles.dropdownText}>you have no notifications, you should kill yourself <b>NOW</b></p>
            </div>
          )}
        </div>

        <div className={`col-1 ${styles.navcol} ${styles.dropdown}`} onMouseLeave={() => setAccountDropdownOpen(false)}>
          <div onMouseEnter={() => setAccountDropdownOpen(true)}>
            <Link to = "/profile" className={`${styles.link}`}>account</Link>
          </div>
          {accountDropdownOpen && (
            <div className={styles.dropdownMenu} onMouseLeave={() => setAccountDropdownOpen(false)}>
              <Link to="/profile" className={styles.dropdownItem}>view profile</Link>
              <Link to="/edit" className={styles.dropdownItem}>edit info</Link>
            </div>
          )}
        </div>

        <div className={`col-1 ${styles.navcol}`}>
          <a href="" className={` ${styles.link}`}>
            logout
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
