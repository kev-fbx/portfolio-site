"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./gallery.module.css";
import Image from "next/image";
import { data } from "./imgID";

const _thumbnailSize = 1000;

const Gallery = () => {
  const [popupState, setPopupState] = useState<{
    imgSrc: string | null;
    isVisible: boolean;
    isHiding: boolean;
    dimensions: { width: number; height: number };
  }>({
    imgSrc: null,
    isVisible: false,
    isHiding: false,
    dimensions: { width: 0, height: 0 },
  });

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleImageClick = useCallback((imgSrc: string) => {
    const img = new window.Image();
    img.src = imgSrc;
    img.onload = () => {
      setPopupState({
        imgSrc,
        isVisible: true,
        isHiding: false,
        dimensions: { width: img.naturalWidth, height: img.naturalHeight },
      });
    };
  }, []);

  const closePopup = useCallback(() => {
    setPopupState((prevState) => ({
      ...prevState,
      isHiding: true,
    }));

    setTimeout(() => {
      setPopupState({
        imgSrc: null,
        isVisible: false,
        isHiding: false,
        dimensions: { width: 0, height: 0 },
      });
    }, 300);
  }, []);

  return (
    <>
      <div className={`${styles.gallery} ${animate ? styles.fadeUp : ""}`}>
        {data.map((item, index) => (
          <div
            className={styles.img}
            key={index}
            onClick={() => handleImageClick(item.imgSrc)}
          >
            <div className={styles.imgContainer}>
              <Image
                src={item.imgSrc}
                alt={`Gallery item ${item.id}`}
                width={_thumbnailSize}
                height={_thumbnailSize}
              />
            </div>
          </div>
        ))}
      </div>

      {popupState.isVisible && (
        <div className={styles.popup}>
          {/* Blurred Background */}
          <div
            className={`${styles.popupBackground} ${popupState.isHiding ? styles.hide : styles.show
              }`}
            onClick={closePopup}
          ></div>

          {/* Popup Content */}
          <div
            className={`${styles.popupContent} ${popupState.isHiding ? styles.hide : styles.show
              }`}
            style={{
              aspectRatio: `${popupState.dimensions.width} / ${popupState.dimensions.height}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closePopup}>
              ×
            </button>
            <Image
              src={popupState.imgSrc || ""}
              alt="Popup image"
              width={popupState.dimensions.width}
              height={popupState.dimensions.height}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;