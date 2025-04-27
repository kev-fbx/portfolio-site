import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.spinner}></div>
  </div>
);