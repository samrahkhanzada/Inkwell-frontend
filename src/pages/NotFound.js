import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#f7f7f7', padding: '48px 24px', textAlign: 'center',
    }}>
      <div style={{ maxWidth: '480px' }}>
        <p style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '8rem', fontWeight: '700',
          color: '#efefef', margin: '0 0 -16px',
          lineHeight: '1',
        }}>
          404
        </p>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontWeight: '700', color: '#0d0d0d', marginBottom: '12px' }}>
          Page not found
        </h1>
        <p style={{ color: '#737373', fontSize: '1rem', lineHeight: '1.6', marginBottom: '36px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px' }}
          >
            <FiArrowLeft size={15} /> Go back
          </button>
          <Link
            to="/"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 24px' }}
          >
            <FiHome size={15} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}