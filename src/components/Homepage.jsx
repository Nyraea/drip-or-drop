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
      <div className={styles.cube}></div>
      <div className={styles.cube}></div>
      <div className={styles.cube}></div>
      <div className={styles.cube}></div>
      <div className={styles.cube}></div>
      <div className={styles.cube}></div>
      <br />
      <br />
      <br />
      <div className={`${styles.header}`}>
        <h1 className={`${styles.text}`}>Express yourself one outfit at a time</h1>
      </div>
      <br />
      <div className={`${styles.subheader}`}>
        <h1 className={`${styles.text}`}>
          Drop your fit, let's see if it's drips
        </h1>
        <br />
        <Link to="/trending" className={`${styles.button}`}>
          Get Drippy
        </Link>
      </div>
      <br />
      <br />
      <br />

      {/* LG to XL PHOTOS*/}
      <div className={`${styles.photos} d-md-none d-lg-flex row`}>
        <div className={`${styles.photo_div} d-none d-lg-flex col-lg-2 `}>
          <img src={photo1} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} d-none col-lg-2 d-lg-flex `}>
          <img src={photo2} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} d-none col-lg-2 d-lg-flex `}>
          <img src={photo3} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} d-none col-lg-2 d-lg-flex `}>
          <img src={photo4} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} d-none col-lg-2 d-lg-flex `}>
          <img src={photo5} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} d-none col-lg-2 d-lg-flex `}>
          <img src={photo6} className={`${styles.photo}`} />
        </div>
      </div>

        {/* XS to SM PHOTOS*/}
        <div className={`${styles.photos} d-none d-md-flex d-lg-none row`}>
          <div className={`${styles.photo_div} d-none d-md-flex flex-column col-4 `}>
          <img src={photo5} className={`${styles.photo}`} />
          </div>
          <div className={`${styles.photo_div} d-none d-md-flex flex-column col-4 `}>
            <img src={photo3} className={`${styles.photo}`} />
          </div>
          <div className={`${styles.photo_div} d-none d-md-flex flex-column col-4 `}>
            <img src={photo6} className={`${styles.photo}`} />
          </div>
      </div>

      {/* XS to SM PHOTOS*/}
      <div className={`${styles.photos} d-flex d-md-none row`}>
        <div className={`${styles.photo_div} d-flex flex-column col-4 `}>
        <img src={photo5} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} d-flex flex-column col-4 `}>
          <img src={photo3} className={`${styles.photo}`} />
        </div>
        <div className={`${styles.photo_div} d-flex flex-column col-4 `}>
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
