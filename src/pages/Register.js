import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiAtSign, FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen } from 'react-icons/fi';

export default function Register() {
  const { register } = useAuth();
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
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (form.username.length < 3) {
      return toast.error('Username must be at least 3 characters');
    }
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
            Join Inkwell
          </h1>
          <p style={{ textAlign: 'center', color: '#737373', fontSize: '0.875rem', marginBottom: '32px' }}>
            Create your free account and start writing
          </p>

          <form onSubmit={handleSubmit}>
            <FormField label="Full name"  icon={<FiUser size={15} />}   type="text"     value={form.name}     onChange={set('name')}     placeholder="Ada Lovelace" />
            <FormField label="Username"   icon={<FiAtSign size={15} />} type="text"     value={form.username} onChange={set('username')} placeholder="adalovelace" />
            <FormField label="Email"      icon={<FiMail size={15} />}   type="email"    value={form.email}    onChange={set('email')}    placeholder="you@example.com" />

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#404040', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#909090' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '4px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#737373', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#e85d04', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, icon, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#404040', marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#909090' }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="input"
          style={{ paddingLeft: '38px' }}
        />
      </div>
    </div>
  );
}