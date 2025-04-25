"use client";

import React, { useEffect, useState } from "react";
import styles from "./projects.module.css";
import { data } from "./projectData";
import Image from "next/image";
import Link from "next/link";

const _thumbnailSize = 1000;

const Projects = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className={`${styles.projectsContainer} ${animate ? styles.fadeUp : ""}`}>
      <div className={styles.projects}>
        {data.map((item, index) => (
          <Link
            key={index}
            href={item.link || "#"}
            className={styles.projectItem}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.imgContainer}>
              <Image
                src={item.image}
                alt={item.title}
                width={_thumbnailSize}
                height={_thumbnailSize}
                className={styles.projectImage}
              />
            </div>
            <div className={styles.textContainer}>
              <h3 className={styles.projectTitle}>{item.title}</h3>
              <p className={styles.projectDescription}>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;