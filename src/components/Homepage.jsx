import styles from "../styles/homepage.module.scss";

import { Link } from "react-router-dom";

import photo1 from "../assets/photo1.png";
import photo2 from "../assets/photo2.png";
import photo3 from "../assets/photo3.png";
import photo4 from "../assets/photo4.png";
import photo5 from "../assets/photo5.png";
import photo6 from "../assets/photo6.png";

function Homepage() {
  return (
    <div className={styles.main}>
      <br />
      <br />
      <br />
      <div className={`${styles.header}`}>
        <h1 className={`${styles.text}`}>Drip or Drop, that is the question</h1>
      </div>
      <br />
      <div className={`${styles.subheader}`}>
        <h1 className={`${styles.text}`}>
          Drop your fit, let's see if it's drip
        </h1>
        <br />
        <Link to="/trending" className={`${styles.button}`}>
          Get Drippy
        </Link>
      </div>
      <br />
      <br />
      <br />
      <div className={`${styles.photos} row`}>
        <div className={`${styles.photo_div} col-2`}>
          <img src={photo1} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} col-2`}>
          <img src={photo2} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} col-2`}>
          <img src={photo3} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} col-2`}>
          <img src={photo4} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} col-2`}>
          <img src={photo5} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} col-2`}>
          <img src={photo6} className={`${styles.photo}`} />
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default Homepage;
