"use client";

import React, { useState, useEffect } from "react";
import styles from "./about.module.css";

const About = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [show, setShow] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetch("/api/getImages")
      .then((res) => res.json())
      .then((data) => setImages(data.images));
    
    setTimeout(() => setShow(true), 100);
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setFade(true);

      const nextIndex = (currentImageIndex + 1) % images.length;
      setNextImageIndex(nextIndex);

      setTimeout(() => {
        setCurrentImageIndex(nextIndex);
        setFade(false);
        setIsTransitioning(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [images, currentImageIndex, isTransitioning]);

  return (
    <div className={styles.aboutPage}>
      <div className={`${styles.aboutContainer} ${show ? styles.show : ''}`}>
        <div className={styles.leftBox}>
          <h1 className={styles.nameHeader}>Kevin Tran</h1>
          <p className={styles.description}>
            Code, animation, people, food, and everything in between.
            <br />
            <br />
            I started off as a biomedicine student, but after some time I
            realised what really drove me to get up every morning were
            computers and art. I now find myself studying my second year of
            Computer Science at The University of Melbourne, where I am in the
            communal struggle of getting an internship 😆.
            <br />
            <br />
            I have met the most wonderful people throughout my journey, and I
            am grateful for the times we have shared. In fact, I intentionally
            group up with random people in competitions and projects so I can
            learn from them!
          </p>
        </div>
        <div className={styles.rightBox}>
          {images.length > 0 && (
            <>
              <img
                src={images[currentImageIndex]}
                alt="Kevin Tran"
                className={`${styles.cyclingImage} ${
                  !fade ? styles.fadeIn : styles.fadeOut
                }`}
              />
              <img
                src={images[nextImageIndex]}
                alt="Kevin Tran"
                className={`${styles.cyclingImage} ${
                  fade ? styles.fadeIn : styles.fadeOut
                }`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;