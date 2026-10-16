import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found | Madrid Hotels</title>
        <meta name="description" content="The page you requested could not be found." />
      </Helmet>

      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '4rem 1rem',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <Compass size={40} />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155', marginTop: '0.5rem' }}>
          Destination Not Found
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: '#64748b',
            maxWidth: '480px',
            marginTop: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          We couldn't find the page or hotel record you were looking for. It may have been moved, deleted, or the URL address was mistyped.
        </p>

        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} />
          <span>Return to Hotel Directory</span>
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
