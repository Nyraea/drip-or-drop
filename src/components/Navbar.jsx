import styles from "../styles/navbar.module.scss";

import logo from "../assets/logo.svg";

function Navbar() {
    return (
        <nav className={`fixed-top ${styles.navbar}`}>

            <div className={`${styles.main}`}>
                
                {/* LINKS */}
                <div className={`col-1 ${styles.navcol}`}>
                    <a href="" className={` ${styles.link}`}>home</a>
                </div>

                <div className={`col-1 ${styles.navcol}`}>
                    <a href="" className={` ${styles.link}`}>discover</a>
                </div>

                <div className={`col-1 ${styles.navcol}`}>
                    <a href="" className={` ${styles.link}`}>trending</a>
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
                    <a href="" className={` ${styles.link}`}>profile</a>
                </div>

                <div className={`col-1 ${styles.navcol}`}>
                    <a href="" className={` ${styles.link}`}>logout</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;