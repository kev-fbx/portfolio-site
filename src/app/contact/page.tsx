import React from 'react'
import styles from './contact.module.css';
import Link from 'next/link';

const Contact = () => {
  return (
    <>
      <div className={styles.background}>
        <p className={styles.boldHeader}>Work in progress 😨</p>
        <div className={styles.wip}>
          <p>email: ktran041203@gmail.com</p>
          <p>LinkedIn: 
            <Link href={"https://www.linkedin.com/in/kevin-tran-fbx/"} target="_blank" rel="noopener noreferrer">
               Kevin Tran
            </Link>
          </p>
          <p>github: 
            <Link href={"https://github.com/kev-fbx"} target="_blank" rel="noopener noreferrer">
               kev-fbx
            </Link>
          </p>
          <p>
            <Link href={"https://kev-fbx-resume.tiiny.site/"} target="_blank" rel="noopener noreferrer">
               resume
            </Link>
          </p>
        </div>
      </div >
    </>
  )
}

export default Contact