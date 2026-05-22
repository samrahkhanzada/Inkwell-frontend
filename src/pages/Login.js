import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen } from 'react-icons/fi';

export default function Login() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from?.pathname || '/';

  const [form,     setForm]     = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error('Please fill in all fields');
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              backgroundColor: '#e85d04', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(232,93,4,0.3)',
            }}>
              <FiBookOpen color="white" size={24} />
            </div>
          </div>

          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.875rem', fontWeight: '700', textAlign: 'center', color: '#0d0d0d', margin: '0 0 6px' }}>
            Welcome back
          </h1>
          <p style={{ textAlign: 'center', color: '#737373', fontSize: '0.875rem', marginBottom: '32px' }}>
            Sign in to continue reading and writing
          </p>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#404040', marginBottom: '6px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#909090' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  className="input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#404040', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#909090' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="input"
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#909090' }}
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: '#e85d04', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#737373', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#e85d04', fontWeight: '600', textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}