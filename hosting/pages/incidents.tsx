import styles from '../styles/Home.module.css';

export default function Incidents() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Incidents
        </h1>

        <p className={styles.description}>
          Manage incidents here.
        </p>
      </main>
    </div>
  );
}
