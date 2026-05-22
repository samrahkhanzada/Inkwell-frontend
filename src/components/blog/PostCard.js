import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiHeart, FiMessageCircle, FiClock } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

export default function PostCard({ post }) {
  const { colors } = useTheme();
  const date = post.publishedAt
    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
    : '';

  return (
    <Link
      to={`/post/${post.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
    >
      <div className="card" style={{
  backgroundColor: colors.cardBg,
  borderRadius: '1rem',
  border: `1px solid ${colors.border}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'box-shadow 0.2s',
}}>

        {/* Featured image */}
        {post.featuredImage && (
          <div style={{ overflow: 'hidden', height: '180px' }}>
            <img
              src={post.featuredImage}
              alt={post.title}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.4s',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          </div>
        )}

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* Category badge */}
          {post.category && (
            <span style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: '600',
              marginBottom: '10px',
              alignSelf: 'flex-start',
              backgroundColor: (post.category.color || '#6366f1') + '20',
              color: post.category.color || '#6366f1',
            }}>
              {post.category.icon} {post.category.name}
            </span>
          )}

          {/* Title */}
          <h2 style={{
  fontFamily: '"Playfair Display", serif',
  fontSize: '1.1rem',
  fontWeight: '700',
  color: colors.text,
  margin: '0 0 8px',
  lineHeight: '1.4',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}}>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p style={{
  color: colors.textSecondary,
  fontSize: '0.875rem',
  lineHeight: '1.6',
  margin: '0 0 16px',
  flex: 1,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}}>
            {post.excerpt}
          </p>

          {/* Footer meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={post.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'A')}&background=e85d04&color=fff&size=40`}
                alt={post.author?.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.text }}>{post.author?.name}</p>
<p style={{ margin: 0, fontSize: '0.7rem', color: colors.textMuted }}>{date}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#909090', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <FiClock size={11} />{post.readTime}m
              </span>
              {post.likeCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <FiHeart size={11} />{post.likeCount}
                </span>
              )}
              {post.commentCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <FiMessageCircle size={11} />{post.commentCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}