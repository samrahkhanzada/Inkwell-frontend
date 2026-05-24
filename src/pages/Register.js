import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiUser, FiAtSign, FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen } from 'react-icons/fi';

export default function Register() {
  const { register } = useAuth();
  const { colors }   = useTheme();
  const navigate     = useNavigate();

  const [form,     setForm]     = useState({ name: '', username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.email || !form.password) {
      return toast.error('Please fill in all fields');
    }
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.username.length < 3) return toast.error('Username must be at least 3 characters');
    setLoading(true);
    try {
      await register(form.name, form.username, form.email, form.password);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 16px 10px 38px',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    backgroundColor: colors.inputBg,
    color: colors.text,
    fontSize: '0.875rem',
    outline: 'none',
    fontFamily: '"DM Sans", sans-serif',
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.bg, padding: '48px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{
          backgroundColor: colors.cardBg,
          borderRadius: '24px',
          padding: '40px 36px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
          border: `1px solid ${colors.border}`,
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

          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.875rem', fontWeight: '700',
            textAlign: 'center', color: colors.text,
            margin: '0 0 6px',
          }}>
            Join Inkwell
          </h1>
          <p style={{
            textAlign: 'center', color: colors.textSecondary,
            fontSize: '0.875rem', marginBottom: '32px',
          }}>
            Create your free account and start writing
          </p>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.text, marginBottom: '6px' }}>Full name</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
                <input type="text" value={form.name} onChange={set('name')} placeholder="Ada Lovelace" required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#e85d04'}
                  onBlur={(e) => e.target.style.borderColor = colors.border} />
              </div>
            </div>

            {/* Username */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.text, marginBottom: '6px' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <FiAtSign size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
                <input type="text" value={form.username} onChange={set('username')} placeholder="adalovelace" required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#e85d04'}
                  onBlur={(e) => e.target.style.borderColor = colors.border} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.text, marginBottom: '6px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#e85d04'}
                  onBlur={(e) => e.target.style.borderColor = colors.border} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.text, marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  required minLength={6}
                  style={{ ...inputStyle, paddingRight: '38px' }}
                  onFocus={(e) => e.target.style.borderColor = '#e85d04'}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted }}>
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: colors.textSecondary, marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#e85d04', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
