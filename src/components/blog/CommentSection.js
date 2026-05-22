import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import {
  FiHeart, FiCornerDownRight, FiTrash2,
  FiEdit2, FiSend, FiMessageCircle,
} from 'react-icons/fi';

export default function CommentSection({ postId }) {
  const { user }       = useAuth();
  const [comments,     setComments]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [newText,      setNewText]      = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [replyTo,      setReplyTo]      = useState(null);
  const [editId,       setEditId]       = useState(null);
  const [editText,     setEditText]     = useState('');

  const loadComments = async () => {
    try {
      const { data } = await api.get(`/comments/post/${postId}`);
      setComments(data.comments);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user)           return toast.error('Sign in to comment');
    if (!newText.trim()) return toast.error('Comment cannot be empty');
    setSubmitting(true);
    try {
      await api.post('/comments', {
        post:    postId,
        content: newText.trim(),
        parent:  replyTo?.id || null,
      });
      setNewText('');
      setReplyTo(null);
      await loadComments();
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async (commentId) => {
    if (!editText.trim()) return toast.error('Comment cannot be empty');
    try {
      await api.put(`/comments/${commentId}`, { content: editText.trim() });
      setEditId(null);
      setEditText('');
      await loadComments();
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      await loadComments();
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const likeComment = async (commentId) => {
    if (!user) return toast.error('Sign in to like');
    try {
      await api.post(`/comments/${commentId}/like`);
      await loadComments();
    } catch {
      toast.error('Failed');
    }
  };

  const totalCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0), 0
  );

  return (
    <div style={{ marginTop: '48px' }}>

      {/* Header */}
      <h2 style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: '1.5rem', fontWeight: '700',
        color: '#0d0d0d', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <FiMessageCircle color="#e85d04" />
        Comments ({totalCount})
      </h2>

      {/* Comment form */}
      {user ? (
        <form onSubmit={submitComment} style={{ marginBottom: '32px' }}>
          {replyTo && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '0.8125rem', color: '#737373', marginBottom: '8px',
            }}>
              <FiCornerDownRight size={14} />
              Replying to <strong>@{replyTo.name}</strong>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#909090', fontSize: '0.75rem' }}
              >
                ✕ Cancel
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e85d04&color=fff`}
              alt={user.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginTop: '4px' }}
            />
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={3}
                placeholder={replyTo ? `Reply to @${replyTo.name}…` : 'Share your thoughts…'}
                className="input"
                style={{ resize: 'none', paddingRight: '48px' }}
              />
              <button
                type="submit"
                disabled={submitting || !newText.trim()}
                style={{
                  position: 'absolute', right: '12px', bottom: '12px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: submitting || !newText.trim() ? '#d9d9d9' : '#e85d04',
                  transition: 'color 0.15s',
                }}
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div style={{
          backgroundColor: '#f7f7f7', border: '1px solid #d9d9d9',
          borderRadius: '16px', padding: '24px', textAlign: 'center',
          marginBottom: '32px',
        }}>
          <p style={{ color: '#737373', fontSize: '0.875rem', marginBottom: '12px' }}>
            Sign in to join the conversation
          </p>
          <Link to="/login" className="btn-primary" style={{ padding: '10px 24px' }}>
            Sign in
          </Link>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#efefef', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: '12px', backgroundColor: '#efefef', borderRadius: '4px', width: '25%', marginBottom: '8px' }} />
                <div style={{ height: '48px', backgroundColor: '#efefef', borderRadius: '8px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#909090' }}>
          <FiMessageCircle size={40} style={{ opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
          <p>No comments yet. Be the first!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {comments.map((c) => (
            <div key={c._id}>
              <CommentItem
                comment={c}
                user={user}
                onReply={() => setReplyTo({ id: c._id, name: c.author.username })}
                onLike={() => likeComment(c._id)}
                onEdit={() => { setEditId(c._id); setEditText(c.content); }}
                onDelete={() => deleteComment(c._id)}
                editId={editId}
                editText={editText}
                setEditText={setEditText}
                onSubmitEdit={submitEdit}
                onCancelEdit={() => { setEditId(null); setEditText(''); }}
              />
              {/* Replies */}
              {c.replies?.map((r) => (
                <div key={r._id} style={{ marginLeft: '48px', marginTop: '12px' }}>
                  <CommentItem
                    comment={r}
                    user={user}
                    isReply
                    onReply={() => setReplyTo({ id: c._id, name: r.author.username })}
                    onLike={() => likeComment(r._id)}
                    onEdit={() => { setEditId(r._id); setEditText(r.content); }}
                    onDelete={() => deleteComment(r._id)}
                    editId={editId}
                    editText={editText}
                    setEditText={setEditText}
                    onSubmitEdit={submitEdit}
                    onCancelEdit={() => { setEditId(null); setEditText(''); }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment: c, user, isReply,
  onReply, onLike, onEdit, onDelete,
  editId, editText, setEditText, onSubmitEdit, onCancelEdit,
}) {
  const isEditing  = editId === c._id;
  const canModify  = user && (c.author._id === user._id || user.role === 'admin');
  const liked      = user && c.likes?.includes(user._id);

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Link to={`/@${c.author.username}`} style={{ flexShrink: 0 }}>
        <img
          src={c.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author.name)}&background=e85d04&color=fff`}
          alt={c.author.name}
          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
        />
      </Link>
      <div style={{ flex: 1 }}>
        <div style={{
          backgroundColor: '#f7f7f7', borderRadius: '16px',
          borderTopLeftRadius: '4px', padding: '12px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to={`/@${c.author.username}`} style={{ fontWeight: '600', fontSize: '0.875rem', color: '#0d0d0d', textDecoration: 'none' }}>
                {c.author.name}
              </Link>
              <span style={{ fontSize: '0.75rem', color: '#909090' }}>
                {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
              </span>
              {c.isEdited && <span style={{ fontSize: '0.7rem', color: '#b3b3b3' }}>(edited)</span>}
            </div>
            {canModify && (
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={onEdit}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#909090', padding: '2px' }}
                >
                  <FiEdit2 size={12} />
                </button>
                <button
                  onClick={onDelete}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#909090', padding: '2px' }}
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="input"
                style={{ resize: 'none', fontSize: '0.875rem', marginBottom: '8px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onSubmitEdit(c._id)}
                  className="btn-primary"
                  style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                >
                  Save
                </button>
                <button
                  onClick={onCancelEdit}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#404040', lineHeight: '1.6' }}>
              {c.content}
            </p>
          )}
        </div>

        {/* Like & Reply */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', paddingLeft: '8px' }}>
          <button
            onClick={onLike}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.75rem',
              color: liked ? '#ef4444' : '#909090',
              transition: 'color 0.15s',
            }}
          >
            <FiHeart size={12} style={{ fill: liked ? '#ef4444' : 'none' }} />
            {c.likes?.length > 0 && c.likes.length}
          </button>
          {!isReply && (
            <button
              onClick={onReply}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.75rem', color: '#909090',
                transition: 'color 0.15s',
              }}
            >
              <FiCornerDownRight size={12} /> Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}