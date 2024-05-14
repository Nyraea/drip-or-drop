import styles from "../styles/footer.module.scss";

import twitter from "../assets/twitter.svg";
import facebook from "../assets/facebook.svg";
import instagram from "../assets/ig.svg";
import logo from "../assets/logo2.svg";

function Footer() {
    return (
        <footer className={`${styles.footer}`}>

            {/* LINKS */}
            <div className={`${styles.links_section} row`}>

                <div className= {`${styles.links} col`}>
                    <a href="/" onClick={(event) => event.preventDefault()} className={`${styles.link}`}>Home</a>
                    <a href="/" onClick={(event) => event.preventDefault()} className={`${styles.link}`}>About</a>
                    <a href="/" onClick={(event) => event.preventDefault()} className={`${styles.link}`}>Contact</a>
                </div>
                <div className= {`${styles.links} col`}>
                    <a href="/" onClick={(event) => event.preventDefault()} className={`${styles.link}`}>Collaborate</a>
                    <a href="/" onClick={(event) => event.preventDefault()} className={`${styles.link}`}>Portfolio</a>
                    <a href="/" onClick={(event) => event.preventDefault()} className={`${styles.link}`}>Blog</a>   
                </div>
                <div className= {`${styles.links} col`}>
                    <a href="/" onClick={(event) => event.preventDefault()} className={`${styles.link}`}>Privacy</a>
                    <a href="/" onClick={(event) => event.preventDefault()} className={`${styles.link}`}>TOS</a>
                    <a href="/" onClick={(event) => event.preventDefault()} className={`${styles.link}`}>FAQ</a>
                </div>

            </div>

            <hr className={`${styles.hrule}`}/>

            {/* SOCIALS */}
            <div className={`${styles.socials}`}>
                <img className={`${styles.social}`} src={twitter} alt="twitter" />
                <img className={`${styles.social}`} src={facebook} alt="facebook" />
                <img className={`${styles.social}`} src={instagram} alt="instagram" />
            </div>

            {/* LOGO */}
            <div className={`${styles.logo_section}`}>
                <img src={logo} alt="logo" className={`${styles.logo}`} />
            </div>
            
        </footer>
    )
}

export default Footer;