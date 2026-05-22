import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Layout         from './components/layout/Layout';
import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import PostDetail     from './pages/PostDetail';
import Search         from './pages/Search';
import Profile        from './pages/Profile';
import Dashboard      from './pages/Dashboard';
import PostEditor     from './pages/PostEditor';
import CategoryPage   from './pages/CategoryPage';
import NotFound       from './pages/NotFound';

// Redirect logged-in users away from auth pages
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <Navigate to="/" replace /> : children;
}

// Redirect guests away from protected pages
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}

function Spinner() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '4px solid #d9d9d9',
        borderTop: '4px solid #e85d04',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: '"DM Sans", sans-serif',
                borderRadius: '10px',
                fontSize: '14px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              },
              success: { iconTheme: { primary: '#6b9e78', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#e85d04', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />

              {/* Guest only routes */}
              <Route path="login"    element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="forgot-password"       element={<GuestRoute><ForgotPassword /></GuestRoute>} />
              <Route path="reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

              {/* Public routes */}
              <Route path="post/:slug"     element={<PostDetail />} />
              <Route path="search"         element={<Search />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="@:username"     element={<Profile />} />

              {/* Private routes */}
              <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="editor"    element={<PrivateRoute><PostEditor /></PrivateRoute>} />
              <Route path="editor/:id" element={<PrivateRoute><PostEditor /></PrivateRoute>} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}