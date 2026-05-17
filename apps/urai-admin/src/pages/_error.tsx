import type { NextPageContext } from 'next';

type ErrorPageProps = {
  statusCode?: number;
};

export default function ErrorPage({ statusCode = 500 }: ErrorPageProps) {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <section style={{ maxWidth: 560, textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569' }}>
          URAI Admin
        </p>
        <h1 style={{ margin: '12px 0', fontSize: 40, lineHeight: 1.1, color: '#0f172a' }}>
          {statusCode === 404 ? 'Page not found' : 'Something went wrong'}
        </h1>
        <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
          {statusCode === 404
            ? 'The page you requested does not exist.'
            : 'The admin console could not render this page. Please return home or try again.'}
        </p>
        <a href="/" style={{ display: 'inline-block', marginTop: 24, borderRadius: 999, background: '#0f172a', color: 'white', padding: '12px 18px', textDecoration: 'none', fontWeight: 700 }}>
          Return to URAI Admin
        </a>
      </section>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};
