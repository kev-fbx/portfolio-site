"use client";

import { useMemo, useState } from "react";
import React from "react";
import styles from "./page.module.css";
import ThreeScene from "./ThreeScene";

type Project = {
  id: string;
  title: string;
  summary: string;
  link: string;
  image?: string;
  popupImage?: string;
};

export default function Home() {
  const renderMarkdown = React.useCallback((text: string) => {
    const html = text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />");
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }, []);
  const projects = useMemo<Project[]>(
    () => [
      { id: "p1", title: "LEIDO YouTube Channel", summary: "I lead the 3D animation for LEIDO, a YouTube channel that is focused on storytelling using the video game Project Zomboid as the universe and 3D animation as the medium.\n\nI have also developed numerous tools and software that speeds up our animation pipelines.\n\nMy freelancing on Fiverr is conducted under this alias.", link: "http://www.youtube.com/@LEIDO_PROD", image: "/images/billboard/leido.webp", popupImage: "/images/highlight/leido.webp" },
      { id: "p2", title: "The Hungry Hungry Caterpillar", summary: "A 3D video game made in Unity where you play as a caterpillar trying to reach the top of the tree!\n\nI was the **lead designer**; I modelled, textured, rigged and animated all but three assets. I also implemented player movement logic and the windy grass shader effect.", link: "https://feit-comp30019.github.io/2025s2/#/team/nicolai-company/play/", image: "/images/billboard/caterpillar.webp", popupImage: "/images/highlight/caterpillar.webp" },
      { id: "p3", title: "C# Ray Tracer", summary: "This ray tracing program implements a Whitted Illumination shading model and supports OBJ imports using BVH hierarchy for render optimisation. It also supports custom camera transforms, anti-aliasing, depth-of-field, and simple animations.", link: "https://github.com/kev-fbx/csharp-ray-tracer", image: "/images/billboard/rabbit.webp", popupImage: "/images/highlight/rabbit.gif" },
      { id: "p4", title: "Design at CISSA", summary: "CISSA is the biggest IT student club at The University of Melbourne, and I'm part of their Design Team, creating graphics for social media. \n\nI use Blender to create 3D assets that are used by myself or collaboratively with the Design Team in Figma, allowing us to uniquely integrate 3D elements into our social media, unlike any other club.\n\nIf it has 3D elements, I did it.", link: "https://www.instagram.com/cissa_unimelb/?hl=en", image: "/images/billboard/cissa.webp", popupImage: "/images/highlight/cissa.webp" },
      { id: "p5", title: "Exogenesis", summary: "Exogenesis is a 3D game that **won Judges Choice** and came ninth in People's choice for the CISSAxGMC Game Jam 2025.\n\nIt was my first ever competition and video game, and I was responsible for the 3D visuals, as well as camera orbiting controls. It even got me under CISSA's radar.\n\nThis is one of my proudest and most significant projects as it was the first application of my 3D skills outside of LEIDO.", link: "https://fchem.itch.io/exogenesis", image: "/images/billboard/exogenesis.webp", popupImage: "/images/highlight/exogenesis.webp" },
      { id: "p6", title: "Fiverr Freelancing", summary: "Under LEIDO, I am the go-to animator for 3D animations in the Project Zomboid community.\n\nI have created a variety of animations and thumbnails for clients ranging from funny teasers to gripping video introductions.\n\nServices within our gigs include custom model creation, texturing, and of course, animating.", link: "https://www.fiverr.com/users/leido_prod/portfolio?roleIds=", image: "/images/billboard/blender.webp", popupImage: "/images/highlight/blender.gif" },
      { id: "p7", title: "OpenGL Model Viewer", summary: "This was my first real project that delved into how graphics programming works, and gave me a real understanding of 3D graphics foundations.\n\nThe program implements a basic GLFW window and uses OpenGL to render 3D models to the screen. Models are processed using the Assimp library.", link: "https://github.com/kev-fbx/model-viewer", image: "/images/billboard/bunny.png", popupImage: "/images/highlight/modelview.gif" },
    ],
    []
  );

  const [imageAspectRatio, setImageAspectRatio] = useState<string>("1");
  const [selected, setSelected] = useState<Project | null>(null);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const ratio = img.naturalWidth / img.naturalHeight;
    setImageAspectRatio(ratio.toString());
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.textArea} aria-hidden="true" />

        <div className={styles.portfolio} aria-label="Three.js preview area">
          <div className={styles.threejsArea}>
            <ThreeScene
              className={styles.threejsCanvasHost}
              projects={projects}
              onSelect={(project) => setSelected(project)}
            />
            <div className={styles.threejsOverlay}>
              click on a project to read about it
            </div>
          </div>
        </div>

        <section className={styles.infoBox} aria-label="Info">
          <header className={styles.barTitle} aria-label="Title bar">
            <div className={styles.name}>
              <p className={styles.kicker}></p>
              <h1 className={styles.title}>KEVIN TRAN</h1>
              <p className={styles.subtitle}>3D Software Engineer & Artist</p>
            </div>
          </header>

          <section className={styles.textForProject} aria-label="About and featured project">
            <h2 className={styles.sectionTitle}>ABOUT</h2>
            <p className={styles.bodyText}>
              Studying Computer Science at The University of Melbourne. I love anything to do with 3D graphics. From modelling a caterpillar to optimising 3D gaussian splat rendering. I love it all.
            </p>
            <h2 className={styles.sectionTitle}>SKILLS</h2>
            <p className={styles.bodyText}>
              <b>LANGUAGES: </b>C++, C#, Java, JavaScript/TypeScript<br />
              <b>TOOLS & TECH: </b>Three.js, Unity, Godot, Unreal Engine, Visual Studio, Ubuntu Server<br />
            </p>
            <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
            <p className={styles.bodyText}>
              <b>[OCT '25 - Present]</b> 3D Software Engineer contract at SKAND <br />
              <b>[MAR '25 - Present]</b> Design Officer at CISSA <br />
              <b>[NOV '23 - Present]</b> Freelance 3D Artist on Fiverr <br />
              <b>[APR '23 - Present]</b> Lead 3D Animator for LEIDO <br />
            </p>
          </section>

          <div className={styles.separator} aria-hidden="true"></div>

          <footer className={styles.footer} aria-label="Contact">
            <div className={styles.footerRow}>
              <span className={styles.footerLabel}>Contact</span>
              <a className={styles.footerLink} href="mailto:kev.fbx@gmail.com" target="_blank" rel="noreferrer">
                KEV.FBX@GMAIL.COM
              </a>
              <a className={styles.footerLink} href="https://github.com/kev-fbx" target="_blank" rel="noreferrer">
                GITHUB
              </a>
              <a className={styles.footerLink} href="https://www.linkedin.com/in/kevin-tran-fbx/" target="_blank" rel="noreferrer">
                LINKEDIN
              </a>
            </div>
          </footer>
        </section>
      </div>

      {selected && (
        <div className={styles.popupOverlay} role="dialog" aria-modal="true" aria-label="Project details">
          <div className={styles.popupCard}>
            <div className={styles.popupInner}>
              <div className={styles.ProjectContainer}></div>
              <div className={styles.ProjectImage} style={{ aspectRatio: imageAspectRatio }}>
                {selected.popupImage && (
                  <img
                    src={selected.popupImage}
                    alt={`${selected.title} image`}
                    className={styles.popupImageTag}
                    onLoad={handleImageLoad}
                  />
                )}
              </div>
              <div className={styles.ProjectTitle}>
                <h2 className={styles.popupTitle}>{selected.title}</h2>
              </div>
              <div className={styles.ProjectAbout}>
                {renderMarkdown(selected.summary)}
              </div>
              <div className={styles.ProjectLink}>
                <button className={styles.closeButton} onClick={() => setSelected(null)} aria-label="Close">
                  ×
                </button>
                <a
                  className={styles.popupLink}
                  href={selected.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setSelected(null)}
                >
                  View the project →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
