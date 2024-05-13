import styles from  "../styles/homepage.module.scss";

function Homepage () {
    
    return (
        <div className={styles.main}>
            <br/>
            <div className={`${styles.header}`}>
                <h1 className={`${styles.text}`}>Precum or trashcan, that is the question</h1>
            </div>
            <br/>
            <div className={`${styles.subheader}`}>
                <h1 className={`${styles.text}`}>I think I may have busted a nut on that anthill over there</h1>
            </div>
        </div>
    )
}

export default Homepage;