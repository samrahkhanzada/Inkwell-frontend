import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function ResetPassword() {
  const { token }  = useParams();
  const navigate   = useNavigate();

  const [form,     setForm]     = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirm) {
      return toast.error('Please fill in all fields');
    }
    if (form.password !== form.confirm) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may be expired.');
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
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', fontWeight: '700', color: '#0d0d0d', margin: '0 0 8px' }}>
            Set new password
          </h1>
          <p style={{ color: '#737373', fontSize: '0.875rem', marginBottom: '28px' }}>
            Choose a strong password for your account.
          </p>

          <form onSubmit={handleSubmit}>
            <PasswordField
              label="New password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              show={showPass}
              toggle={() => setShowPass((v) => !v)}
            />
            <PasswordField
              label="Confirm password"
              value={form.confirm}
              onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
              show={showPass}
              toggle={() => setShowPass((v) => !v)}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}
            >
              {loading ? 'Saving…' : 'Reset password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, toggle }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#404040', marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <FiLock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#909090' }} />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          required
          minLength={6}
          className="input"
          style={{ paddingLeft: '38px', paddingRight: '38px' }}
        />
        <button
          type="button"
          onClick={toggle}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#909090' }}
        >
          {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
        </button>
      </div>
    </div>
  );
}