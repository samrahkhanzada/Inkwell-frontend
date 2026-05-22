import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#f7f7f7', padding: '48px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{
          backgroundColor: '#fff', borderRadius: '24px',
          padding: '40px 36px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        }}>
          <Link to="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.875rem', color: '#737373', textDecoration: 'none',
            marginBottom: '28px',
          }}>
            <FiArrowLeft size={14} /> Back to sign in
          </Link>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📬</div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', fontWeight: '700', color: '#0d0d0d', marginBottom: '12px' }}>
                Check your inbox
              </h2>
              <p style={{ color: '#737373', fontSize: '0.875rem', lineHeight: '1.6' }}>
                We sent a password reset link to <strong>{email}</strong>. It expires in 30 minutes.
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', fontWeight: '700', color: '#0d0d0d', margin: '0 0 8px' }}>
                Forgot password?
              </h1>
              <p style={{ color: '#737373', fontSize: '0.875rem', marginBottom: '28px' }}>
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#404040', marginBottom: '6px' }}>
                    Email address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiMail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#909090' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="input"
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}