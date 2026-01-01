import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>URAI Admin</title>
        <meta name="description" content="URAI Admin & Council Console" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to URAI Admin
        </h1>

        <p className={styles.description}>
          This is the admin console for URAI.
        </p>

        <div className={styles.grid}>
          <a href="/incidents" className={styles.card}>
            <h2>Incidents &rarr;</h2>
            <p>Manage incidents.</p>
          </a>

          <a href="/flags" className={styles.card}>
            <h2>Feature Flags &rarr;</h2>
            <p>Manage feature flags.</p>
          </a>

          <a
            href="/support"
            className={styles.card}
          >
            <h2>Support Cases &rarr;</h2>
            <p>Manage support cases.</p>
          </a>

          <a
            href="/users"
            className={styles.card}
          >
            <h2>Users &rarr;</h2>
            <p>Manage users and roles.</p>
          </a>
        </div>
      </main>
    </div>
  );
}
