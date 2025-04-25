"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

const Home = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className={styles.homeContainer}>
      <p className={`${styles.boldHeader} ${animate ? styles.fadeUp : ""}`}>
        Hello, I&apos;m Kevin
      </p>
    </div>
  );
};

export default Home;