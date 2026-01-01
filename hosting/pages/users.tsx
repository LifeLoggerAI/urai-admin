import styles from '../styles/Home.module.css';

export default function Users() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Users
        </h1>

        <p className={styles.description}>
          Manage users and roles here.
        </p>
      </main>
    </div>
  );
}
