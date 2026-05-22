import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import PostCard from '../components/blog/PostCard';
import { FiArrowRight, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const [featured,   setFeatured]   = useState([]);
  const [recent,     setRecent]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    Promise.all([
      api.get('/posts?featured=true&limit=3'),
      api.get('/posts?limit=9'),
      api.get('/categories'),
    ])
      .then(([f, r, c]) => {
        setFeatured(f.data.posts);
        setRecent(r.data.posts);
        setCategories(c.data.categories.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        backgroundColor: colors.heroBg,
        borderBottom: `1px solid ${colors.border}`,
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#e85d04',
            marginBottom: '16px',
          }}>
            Welcome to Inkwell
          </p>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '700',
            color: colors.text,
            lineHeight: '1.1',
            marginBottom: '24px',
          }}>
            Stories that <em style={{ color: '#e85d04' }}>matter.</em>
          </h1>
          <p style={{
            color: colors.textSecondary,
            fontSize: '1.125rem',
            lineHeight: '1.7',
            marginBottom: '40px',
          }}>
            A place for curious minds. Read, write, and connect over ideas that shape the world.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <StartWritingButton />
            <Link to="/search" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Explore stories <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{
          backgroundColor: colors.sectionBg,
          borderBottom: `1px solid ${colors.border}`,
          padding: '16px 24px',
        }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            display: 'flex', gap: '10px',
            overflowX: 'auto', paddingBottom: '4px',
          }} className="no-scrollbar">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c.slug}`}
                style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  fontWeight: '500',
                  color: colors.text,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e85d04'; e.currentTarget.style.color = '#e85d04'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.text; }}
              >
                <span>{c.icon}</span> {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px' }}>

        {/* Featured posts */}
        {featured.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <SectionHeader icon={<FiTrendingUp />} title="Featured" link="/search?featured=true" colors={colors} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {featured.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Latest posts */}
        <section>
          <SectionHeader icon={<FiBookOpen />} title="Latest stories" link="/search" colors={colors} />
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} colors={colors} />)}
            </div>
          ) : recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: colors.textSecondary }}>
              <p style={{ fontSize: '3rem', marginBottom: '12px' }}>📝</p>
              <p style={{ color: colors.textSecondary }}>No posts yet. Be the first to write!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {recent.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              to="/search"
              className="btn-secondary"
              style={{ padding: '12px 32px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Browse all stories <FiArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StartWritingButton() {
  const { user } = useAuth();
  return user ? (
    <Link to="/editor" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
      Start writing
    </Link>
  ) : (
    <Link to="/register" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
      Start writing free
    </Link>
  );
}

function SectionHeader({ icon, title, link, colors }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#e85d04' }}>{icon}</span>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', fontWeight: '700', margin: 0, color: colors.text }}>
          {title}
        </h2>
      </div>
      <Link to={link} style={{ fontSize: '0.875rem', color: '#e85d04', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
        View all <FiArrowRight size={13} />
      </Link>
    </div>
  );
}

function SkeletonCard({ colors }) {
  return (
    <div style={{ backgroundColor: colors.cardBg, borderRadius: '1rem', padding: '20px', border: `1px solid ${colors.border}` }}>
      <div style={{ backgroundColor: colors.skeletonBg, height: '160px', borderRadius: '12px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ backgroundColor: colors.skeletonBg, height: '16px', borderRadius: '6px', marginBottom: '8px', width: '75%' }} />
      <div style={{ backgroundColor: colors.skeletonBg, height: '16px', borderRadius: '6px', marginBottom: '16px', width: '50%' }} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ backgroundColor: colors.skeletonBg, width: '32px', height: '32px', borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div style={{ backgroundColor: colors.skeletonBg, height: '12px', borderRadius: '4px', marginBottom: '4px', width: '50%' }} />
          <div style={{ backgroundColor: colors.skeletonBg, height: '12px', borderRadius: '4px', width: '35%' }} />
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}