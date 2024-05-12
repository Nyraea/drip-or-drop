import styles from "../styles/navbar.module.scss";

import { Link } from "react-router-dom";

import logo from "../assets/logo.svg";

function Navbar() {
    return (
        <nav className={`fixed-top ${styles.navbar}`}>

            <div className={`${styles.main}`}>
                
                {/* LINKS */}
                <div className={`col-1 ${styles.navcol}`}>
                    <Link to = "/homepage" className={` ${styles.link}`}>home</Link>
                </div>

                <div className={`col-1 ${styles.navcol}`}>
                    <a href="" className={` ${styles.link}`}>discover</a>
                </div>

                <div className={`col-1 ${styles.navcol}`}>
                    <Link to = "/trending"  className={` ${styles.link}`}> trending </Link>
                </div>

                    {/* LOGO */}
                    <div className="col-4">
                        <a href=""><img src={logo} alt="logo" className={styles.logo} /></a>
                    </div>

                {/* LINKS */}
                <div className={`col-1 ${styles.navcol}`}>
                    <a href="" className={` ${styles.link}`}>notifications</a>
                </div>

                <div className={`col-1 ${styles.navcol}`}>
                    <Link to = "/profile" className={` ${styles.link}`}>profile</Link>
                </div>

                <div className={`col-1 ${styles.navcol}`}>
                    <a href="" className={` ${styles.link}`}>logout</a>
                </div>
            </div>
            
        </nav>
    )
}

export default Navbar;