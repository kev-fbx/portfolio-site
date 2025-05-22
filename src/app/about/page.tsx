"use client";

import React, { useState, useEffect } from "react";
import styles from "./about.module.css";
import Image from "next/image";

const About = () => {
  const [images,            setImages]            = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex,    setNextImageIndex]    = useState(0);
  const [fade,              setFade]              = useState(false);
  const [show,              setShow]              = useState(false);
  const [isTransitioning,   setIsTransitioning]   = useState(false);

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
    }, 2000);

    return () => clearInterval(interval);
  }, [images, currentImageIndex, isTransitioning]);

  return (
    <div className={styles.aboutPage}>
      <div className={`${styles.aboutContainer} ${show ? styles.show : ''}`}>
        <div className={styles.leftBox}>
          <div className={styles.nameContainer}>
            <h1 className={styles.nameHeader}>Kevin Tran</h1>
            <h1 className={styles.nicknameHeader}>// kev.fbx</h1>
          </div>
          <p className={styles.description}>
            Code, animation, people, food, and everything in between.
            <br />
            <br />
            I started off as a biomedicine student, but after some time I
            realised what really drove me to get up every morning was technology and art. 
            I now find myself studying my second year of
            Computer Science at The University of Melbourne, while running a YouTube
             animation channel with my friend on the side.
            <br />
            <br />
            Everything I have accomplished has been possible thanks to the support
            of the wonderful people I have met in my journey—thank you (●'◡'●)
          </p>
        </div>
        <div className={styles.rightBox}>
          {images.length > 0 && (
            <>
              <Image
                src={images[currentImageIndex]}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                alt="Kevin Tran"
                className={`${styles.cyclingImage} ${fade ? styles.fadeOut : styles.fadeIn}`}
              />
              <Image
                src={images[nextImageIndex]}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                alt="Kevin Tran"
                className={`${styles.cyclingImage} ${fade ? styles.fadeIn : styles.fadeOut}`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;