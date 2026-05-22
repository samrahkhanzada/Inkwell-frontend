import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/blog/PostCard';
import {
  FiTwitter, FiGithub, FiLinkedin, FiGlobe,
  FiCalendar, FiUsers, FiUserPlus, FiUserCheck,
} from 'react-icons/fi';

export default function Profile() {
  const { username }   = useParams();
  const { user: me }   = useAuth();
  const clean          = username.startsWith('@') ? username.slice(1) : username;

  const [profile,    setProfile]    = useState(null);
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [following,  setFollowing]  = useState(false);
  const [follCount,  setFollCount]  = useState(0);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/users/${clean}`);
        setProfile(data.user);
        setFollCount(data.user.followers?.length || 0);
        setFollowing(me ? data.user.followers?.includes(me._id) : false);
        const postsRes = await api.get(`/users/${clean}/posts?page=1&limit=9`);
        setPosts(postsRes.data.posts);
        setTotalPages(postsRes.data.pages);
      } catch {
        toast.error('User not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [clean, me]);

  const loadMorePosts = async (p) => {
    try {
      const { data } = await api.get(`/users/${clean}/posts?page=${p}&limit=9`);
      setPosts((prev) => [...prev, ...data.posts]);
      setPage(p);
    } catch {
      toast.error('Failed to load posts');
    }
  };

  const handleFollow = async () => {
    if (!me) return toast.error('Sign in to follow');
    try {
      const { data } = await api.post(`/users/${profile._id}/follow`);
      setFollowing(data.following);
      setFollCount(data.followerCount);
    } catch {
      toast.error('Failed');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', alignItems: 'center' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#efefef', animation: 'pulse 1.5s infinite' }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: '24px', backgroundColor: '#efefef', borderRadius: '6px', width: '40%', marginBottom: '10px' }} />
            <div style={{ height: '16px', backgroundColor: '#efefef', borderRadius: '4px', width: '60%' }} />
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </div>
    );
  }

  if (!profile) return null;

  const isMe = me && me._id === profile._id;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>

      {/* Profile header */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '24px',
        padding: '32px', marginBottom: '40px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=e85d04&color=fff&size=150`}
            alt={profile.name}
            style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #efefef', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
              <div>
                <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', fontWeight: '700', color: '#0d0d0d', margin: '0 0 4px' }}>
                  {profile.name}
                </h1>
                <p style={{ color: '#909090', fontSize: '0.9375rem', margin: 0 }}>@{profile.username}</p>
              </div>
              {isMe ? (
                <Link to="/dashboard" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                  Edit profile
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  className={following ? 'btn-secondary' : 'btn-primary'}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', fontSize: '0.875rem' }}
                >
                  {following ? <><FiUserCheck size={14} /> Following</> : <><FiUserPlus size={14} /> Follow</>}
                </button>
              )}
            </div>

            {profile.bio && (
              <p style={{ color: '#404040', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '16px' }}>
                {profile.bio}
              </p>
            )}

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                { label: 'Posts',     value: profile.postCount || 0 },
                { label: 'Followers', value: follCount },
                { label: 'Following', value: profile.following?.length || 0 },
              ].map((s) => (
                <div key={s.label}>
                  <span style={{ fontWeight: '700', color: '#0d0d0d', fontSize: '1.125rem' }}>{s.value}</span>
                  <span style={{ color: '#909090', fontSize: '0.875rem', marginLeft: '4px' }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Meta info */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#909090', fontSize: '0.8125rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiCalendar size={12} />
                Joined {format(new Date(profile.createdAt), 'MMM yyyy')}
              </span>
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e85d04', textDecoration: 'none' }}>
                  <FiGlobe size={12} /> Website
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a href={`https://twitter.com/${profile.socialLinks.twitter}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1da1f2', textDecoration: 'none' }}>
                  <FiTwitter size={12} />
                </a>
              )}
              {profile.socialLinks?.github && (
                <a href={`https://github.com/${profile.socialLinks.github}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#333', textDecoration: 'none' }}>
                  <FiGithub size={12} />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0077b5', textDecoration: 'none' }}>
                  <FiLinkedin size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.375rem', fontWeight: '700', color: '#0d0d0d', marginBottom: '24px' }}>
        Posts by {profile.name}
      </h2>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#909090' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📝</p>
          <p>No published posts yet.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
          {page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => loadMorePosts(page + 1)}
                className="btn-secondary"
                style={{ padding: '10px 32px' }}
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}