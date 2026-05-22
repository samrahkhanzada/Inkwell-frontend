import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  FiEdit2, FiTrash2, FiEye, FiHeart,
  FiMessageCircle, FiPlus, FiBookOpen,
  FiFileText, FiClock, FiTrendingUp,
} from 'react-icons/fi';

const STATUS_COLORS = {
  published: { bg: '#f0fdf4', color: '#16a34a' },
  draft:     { bg: '#fafafa', color: '#737373' },
  scheduled: { bg: '#eff6ff', color: '#2563eb' },
  archived:  { bg: '#fef2f2', color: '#dc2626' },
};

export default function Dashboard() {
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [posts,      setPosts]      = useState([]);
  const [stats,      setStats]      = useState({ total: 0, published: 0, draft: 0, views: 0 });
  const [filter,     setFilter]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPosts = async (statusFilter = filter, p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 10 });
      if (statusFilter) params.append('status', statusFilter);
      const { data } = await api.get(`/posts/dashboard/my?${params}`);
      setPosts(data.posts);
      setTotalPages(data.pages);

      // Build stats from first load
      if (!statusFilter && p === 1) {
        const totalViews = data.posts.reduce((a, b) => a + (b.views || 0), 0);
        setStats({
          total:     data.total,
          published: data.posts.filter((p) => p.status === 'published').length,
          draft:     data.posts.filter((p) => p.status === 'draft').length,
          views:     totalViews,
        });
      }
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleFilterChange = (val) => {
    setFilter(val);
    setPage(1);
    loadPosts(val, 1);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${postId}`);
      toast.success('Post deleted');
      loadPosts();
    } catch {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontWeight: '700', color: '#0d0d0d', margin: '0 0 4px' }}>
            Dashboard
          </h1>
          <p style={{ color: '#737373', fontSize: '0.9375rem', margin: 0 }}>
            Welcome back, {user?.name}
          </p>
        </div>
        <Link to="/editor" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
          <FiPlus size={16} /> New post
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {[
          { icon: <FiFileText size={20} />,   label: 'Total posts',  value: stats.total,     color: '#6366f1' },
          { icon: <FiBookOpen size={20} />,   label: 'Published',    value: stats.published, color: '#16a34a' },
          { icon: <FiClock size={20} />,      label: 'Drafts',       value: stats.draft,     color: '#737373' },
          { icon: <FiTrendingUp size={20} />, label: 'Total views',  value: stats.views,     color: '#e85d04' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '20px' }}>
            <div style={{ color: s.color, marginBottom: '10px' }}>{s.icon}</div>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0d0d0d', margin: '0 0 2px' }}>{s.value}</p>
            <p style={{ fontSize: '0.8125rem', color: '#909090', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #efefef', paddingBottom: '0' }}>
        {['', 'published', 'draft', 'scheduled', 'archived'].map((s) => (
          <button
            key={s}
            onClick={() => handleFilterChange(s)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '10px 16px', fontSize: '0.875rem', fontWeight: '500',
              borderBottom: filter === s ? '2px solid #e85d04' : '2px solid transparent',
              color: filter === s ? '#e85d04' : '#737373',
              marginBottom: '-1px', transition: 'color 0.15s',
            }}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: '18px', backgroundColor: '#efefef', borderRadius: '4px', width: '60%', marginBottom: '10px', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '14px', backgroundColor: '#efefef', borderRadius: '4px', width: '30%' }} />
              </div>
            </div>
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#909090' }}>
          <FiFileText size={48} style={{ opacity: 0.2, display: 'block', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#404040', marginBottom: '8px' }}>No posts yet</p>
          <p style={{ marginBottom: '24px' }}>Start writing your first story</p>
          <Link to="/editor" className="btn-primary" style={{ padding: '10px 24px' }}>Write now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {posts.map((post) => (
            <div key={post._id} className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

              {/* Featured image thumbnail */}
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '1.0625rem', fontWeight: '700',
                      color: '#0d0d0d', margin: '0 0 6px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      maxWidth: '500px',
                    }}>
                      {post.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: '600', padding: '2px 10px', borderRadius: '9999px',
                        backgroundColor: STATUS_COLORS[post.status]?.bg || '#f7f7f7',
                        color: STATUS_COLORS[post.status]?.color || '#737373',
                      }}>
                        {post.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#909090' }}>
                        {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#909090' }}>
                        <FiEye size={11} /> {post.views || 0}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#909090' }}>
                        <FiHeart size={11} /> {post.likeCount || 0}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#909090' }}>
                        <FiMessageCircle size={11} /> {post.commentCount || 0}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {post.status === 'published' && (
                      <Link
                        to={`/post/${post.slug}`}
                        style={{ padding: '7px', borderRadius: '8px', color: '#737373', textDecoration: 'none', display: 'flex', alignItems: 'center', border: '1px solid #efefef' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f7f7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="View post"
                      >
                        <FiEye size={14} />
                      </Link>
                    )}
                    <button
                      onClick={() => navigate(`/editor/${post._id}`)}
                      style={{ padding: '7px', borderRadius: '8px', background: 'none', border: '1px solid #efefef', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f7f7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      title="Edit post"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      style={{ padding: '7px', borderRadius: '8px', background: 'none', border: '1px solid #efefef', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#737373'; e.currentTarget.style.borderColor = '#efefef'; }}
                      title="Delete post"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => { setPage(i + 1); loadPosts(filter, i + 1); }}
              style={{
                width: '36px', height: '36px', borderRadius: '8px', border: '1px solid',
                cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500',
                backgroundColor: page === i + 1 ? '#e85d04' : 'transparent',
                borderColor:     page === i + 1 ? '#e85d04' : '#d9d9d9',
                color:           page === i + 1 ? '#fff'    : '#737373',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}