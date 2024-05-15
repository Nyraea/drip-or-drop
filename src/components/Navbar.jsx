import styles from "../styles/navbar.module.scss";

import { Link } from "react-router-dom";
import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Accordion from "react-bootstrap/Accordion";
import { auth } from "./firebase";

import logo from "../assets/logo.svg";
import close from "../assets/close.svg";
import toggler from "../assets/toggler.svg";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    // NAVBAR
    <nav className={`fixed-top ${styles.navbar}`}>
      <div className={`${styles.main}`}>
        {/* LINKS */}
        <div className={`col-lg-1 ${styles.navcol}`}>
          <Link to="/homepage" className={` ${styles.link}`}>
            home
          </Link>
        </div>

        <div className={`col-lg-1 ${styles.navcol}`}>
          <Link to="/discover" className={` ${styles.link}`}>
            discover
          </Link>
        </div>

        <div className={`col-lg-1 ${styles.navcol}`}>
          <Link to="/trending" className={` ${styles.link}`}>
            {" "}
            trending{" "}
          </Link>
        </div>

        {/* LOGO */}
        <div className="col-lg-3 col-xl-4">
          <Link to="/homepage">
            <img src={logo} alt="logo" className={styles.logo} />
          </Link>
        </div>

        {/* TOGGLER */}
        <div className={`d-lg-none col-md-1 ${styles.toggler}`}>
          <a
            href=""
            onClick={(event) => {
              event.preventDefault();
              {
                handleShow();
              }
            }}
          >
            <img src={toggler} alt="toggler" />
          </a>
        </div>

        {/* LINKS */}
        <div
          className={`col-lg-1 ${styles.navcol} ${styles.dropdown} me-lg-3`}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div onClick={() => setDropdownOpen(!dropdownOpen)}>
            <a
              href=""
              onClick={(event) => event.preventDefault()}
              className={` ${styles.link}`}
            >
              {" "}
              notifications
            </a>
          </div>
          {dropdownOpen && (
            <div
              className={`${styles.dropdownMenu} p-2`}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <p className={styles.dropdownText}> you have no notifications</p>
            </div>
          )}
        </div>

        <div
          className={`col-lg-1 ${styles.navcol} ${styles.dropdown}`}
          onMouseLeave={() => setAccountDropdownOpen(false)}
        >
          <div onMouseEnter={() => setAccountDropdownOpen(true)}>
            <Link to="/profile" className={`${styles.link}`}>
              account
            </Link>
          </div>
          {accountDropdownOpen && (
            <div
              className={styles.dropdownMenu}
              onMouseLeave={() => setAccountDropdownOpen(false)}
            >
              <Link to="/profile" className={styles.dropdownItem}>
                view profile
              </Link>
              <Link to="/edit" className={styles.dropdownItem}>
                edit info
              </Link>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <div className={`col-lg-1 ${styles.navcol}`}>
          <a
            href=""
            className={` ${styles.link}`}
            onClick={(event) => {
              event.preventDefault();
              handleLogout();
            }}
          >
            logout
          </a>
        </div>

        <Offcanvas
          show={show}
          onHide={handleClose}
          placement="end"
          scroll="true"
          className={`${styles.offcanvas} d-lg-none`}
        >
          <Offcanvas.Header className={`${styles.header}`}>
            <Offcanvas.Title>
              <img src={logo} alt="logo" className={styles.logo}></img>
            </Offcanvas.Title>
            <a
              href=""
              onClick={(event) => {
                event.preventDefault();
                {
                  handleClose();
                }
              }}
            >
              <img src={close} alt="close" />
            </a>
          </Offcanvas.Header>
          <br />
          <p className={`${styles.hr1}`} />
          <Offcanvas.Body>
            <div className={`${styles.body}`}>
              <Link to="/homepage" className={` ${styles.link}`}>
                <h4>home</h4>
              </Link>

              <Link to="/discover" className={` ${styles.link}`}>
                <h4>discover</h4>
              </Link>

              <Link to="/trending" className={` ${styles.link}`}>
                <h4>trending</h4>
              </Link>

              <br />
              <p className={`${styles.hr2}`} />
              <br />

              <Link to="/profile" className={`${styles.accordion_section}`}>
                <Accordion className={`${styles.accordion}`}>
                  <Accordion.Item className="w-100" eventKey="0">
                    <Accordion.Header className={`${styles.button}`}>
                      <h4>account</h4> <img src="" alt="" />
                    </Accordion.Header>
                    <Accordion.Body>
                      <Link to="/profile" className={`${styles.link}`}>
                        <h4>view profile</h4>
                      </Link>

                      <Link to="/edit" className={`${styles.link}`}>
                        <h4>edit info</h4>
                      </Link>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Link>

              <br />

              <a
                href=""
                className={` ${styles.link}`}
                onClick={(event) => {
                  event.preventDefault();
                  handleLogout();
                }}
              >
                <h4>logout</h4>
              </a>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </nav>
  );
}

export default Navbar;
