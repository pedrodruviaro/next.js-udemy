import React from "react";
import styles from "./banner.module.css";

export default function Banner(props) {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <span>Coffee</span> Connoisseur
            </h1>
            <p className={styles.subTitle}>Discover your local coffee shops!</p>
            <div className={styles.buttonWrapper}>
                <button className={styles.button} onClick={props.handleOnClick}>
                    {props.buttonText}
                </button>
            </div>
        </div>
    );
}
