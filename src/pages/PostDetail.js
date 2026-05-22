import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/blog/CommentSection';
import {
  FiHeart, FiMessageCircle, FiClock, FiEye,
  FiShare2, FiEdit2, FiTrash2, FiCalendar,
} from 'react-icons/fi';

const REACTIONS = [
  { key: 'like',       emoji: '👍', label: 'Like' },
  { key: 'love',       emoji: '❤️', label: 'Love' },
  { key: 'insightful', emoji: '💡', label: 'Insightful' },
  { key: 'funny',      emoji: '😄', label: 'Funny' },
];

export default function PostDetail() {
  const { slug }    = useParams();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [post,       setPost]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [liked,      setLiked]      = useState(false);
  const [likeCount,  setLikeCount]  = useState(0);
  const [showReact,  setShowReact]  = useState(false);
  const [reacting,   setReacting]   = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${slug}`);
        setPost(data.post);
        setLiked(data.userLiked);
        const likeRes = await api.get(`/likes/post/${data.post._id}`);
        setLikeCount(likeRes.data.total);
      } catch {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleReact = async (reaction = 'like') => {
    if (!user) return toast.error('Sign in to react');
    setReacting(true);
    try {
      const { data } = await api.post('/likes/toggle', { postId: post._id, reaction });
      setLiked(data.liked);
      setLikeCount((prev) => data.liked ? prev + 1 : prev - 1);
    } catch {
      toast.error('Failed to react');
    } finally {
      setReacting(false);
      setShowReact(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '80px 24px' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ height: i === 0 ? '40px' : '16px', backgroundColor: '#efefef', borderRadius: '6px', marginBottom: '16px', width: i === 0 ? '70%' : '100%', animation: 'pulse 1.5s infinite' }} />
        ))}
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user && (post.author._id === user._id || user.role === 'admin');

  return (
    <article style={{ maxWidth: '768px', margin: '0 auto', padding: '48px 24px' }}>

      {/* Category & Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {post.category && (
          <Link
            to={`/category/${post.category.slug}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '9999px',
              fontSize: '0.8125rem', fontWeight: '600',
              textDecoration: 'none',
              backgroundColor: (post.category.color || '#6366f1') + '15',
              color: post.category.color || '#6366f1',
            }}
          >
            {post.category.icon} {post.category.name}
          </Link>
        )}
        {post.tags?.map((tag) => (
          <Link key={tag._id} to={`/search?tag=${tag._id}`} className="tag-chip">
            #{tag.name}
          </Link>
        ))}
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
        fontWeight: '700', color: '#0d0d0d',
        lineHeight: '1.2', marginBottom: '24px',
      }}>
        {post.title}
      </h1>

      {/* Meta bar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap',
        gap: '16px', paddingBottom: '24px',
        borderBottom: '1px solid #efefef',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to={`/@${post.author.username}`}>
            <img
              src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=e85d04&color=fff&size=80`}
              alt={post.author.name}
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #efefef' }}
            />
          </Link>
          <div>
            <Link to={`/@${post.author.username}`} style={{ fontWeight: '600', color: '#0d0d0d', textDecoration: 'none', fontSize: '0.9375rem' }}>
              {post.author.name}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px', fontSize: '0.75rem', color: '#909090', flexWrap: 'wrap' }}>
              {post.publishedAt && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiCalendar size={11} />
                  {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiClock size={11} />{post.readTime} min read
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiEye size={11} />{post.views} views
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isOwner && (
            <>
              <Link
                to={`/editor/${post._id}`}
                style={{ padding: '8px', borderRadius: '8px', color: '#737373', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f7f7'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FiEdit2 size={16} />
              </Link>
              <button
                onClick={handleDelete}
                style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#737373'; }}
              >
                <FiTrash2 size={16} />
              </button>
            </>
          )}
          <button
            onClick={handleShare}
            style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f7f7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <FiShare2 size={16} />
          </button>
        </div>
      </div>

      {/* Featured image */}
      {post.featuredImage && (
        <div style={{ margin: '32px 0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <img
            src={post.featuredImage}
            alt={post.title}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Post content */}
      <div
        style={{ marginTop: '32px', marginBottom: '48px', lineHeight: '1.8', fontSize: '1.0625rem', color: '#0d0d0d' }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Reactions bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '24px',
        padding: '20px 0',
        borderTop: '1px solid #efefef',
        borderBottom: '1px solid #efefef',
        marginBottom: '48px',
      }}>
        <div style={{ position: 'relative' }}>
          <button
            onMouseEnter={() => setShowReact(true)}
            onMouseLeave={() => setShowReact(false)}
            onClick={() => handleReact('like')}
            disabled={reacting}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '9999px',
              border: '1px solid', cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: liked ? '#fef2f2' : 'transparent',
              borderColor:     liked ? '#fca5a5' : '#d9d9d9',
              color:           liked ? '#ef4444' : '#737373',
            }}
          >
            <FiHeart size={16} style={{ fill: liked ? '#ef4444' : 'none' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{likeCount}</span>
          </button>

          {/* Reaction picker */}
          {showReact && (
            <div
              onMouseEnter={() => setShowReact(true)}
              onMouseLeave={() => setShowReact(false)}
              style={{
                position: 'absolute', bottom: '52px', left: 0,
                backgroundColor: '#fff', border: '1px solid #efefef',
                borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                padding: '10px 14px', display: 'flex', gap: '12px', zIndex: 20,
              }}
            >
              {REACTIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => handleReact(r.key)}
                  title={r.label}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '1.375rem', transition: 'transform 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#737373', fontSize: '0.875rem' }}>
          <FiMessageCircle size={16} />
          <span>{post.commentCount || 0} comments</span>
        </div>
      </div>

      {/* Author bio card */}
      <div style={{
        backgroundColor: '#f7f7f7', borderRadius: '20px',
        padding: '24px', marginBottom: '48px',
        display: 'flex', gap: '16px', alignItems: 'flex-start',
      }}>
        <Link to={`/@${post.author.username}`} style={{ flexShrink: 0 }}>
          <img
            src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=e85d04&color=fff&size=80`}
            alt={post.author.name}
            style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }}
          />
        </Link>
        <div>
          <Link to={`/@${post.author.username}`} style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.125rem', fontWeight: '700',
            color: '#0d0d0d', textDecoration: 'none',
          }}>
            {post.author.name}
          </Link>
          <p style={{ color: '#737373', fontSize: '0.875rem', marginTop: '4px', lineHeight: '1.6' }}>
            {post.author.bio || 'No bio yet.'}
          </p>
        </div>
      </div>

      {/* Comments */}
      {post.allowComments && <CommentSection postId={post._id} />}
    </article>
  );
}