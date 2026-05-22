import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import PostCard from '../components/blog/PostCard';

export default function CategoryPage() {
  const { slug }       = useParams();
  const [category,     setCategory]     = useState(null);
  const [posts,        setPosts]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [total,        setTotal]        = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: catData } = await api.get(`/categories/${slug}`);
        setCategory(catData.category);
        const { data: postsData } = await api.get(`/posts?category=${catData.category._id}&page=1&limit=12`);
        setPosts(postsData.posts);
        setTotal(postsData.total);
        setTotalPages(postsData.pages);
      } catch {
        toast.error('Category not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const loadMore = async (p) => {
    try {
      const { data } = await api.get(`/posts?category=${category._id}&page=${p}&limit=12`);
      setPosts((prev) => [...prev, ...data.posts]);
      setPage(p);
    } catch {
      toast.error('Failed to load posts');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ height: '32px', backgroundColor: '#efefef', borderRadius: '8px', width: '30%', marginBottom: '40px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card" style={{ padding: '20px', height: '280px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </div>
    );
  }

  if (!category) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

      {/* Category header */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '20px',
        padding: '32px', marginBottom: '40px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${category.color || '#6366f1'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '2.5rem' }}>{category.icon}</span>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontWeight: '700', color: '#0d0d0d', margin: '0 0 4px' }}>
              {category.name}
            </h1>
            {category.description && (
              <p style={{ color: '#737373', fontSize: '0.9375rem', margin: '0 0 8px' }}>
                {category.description}
              </p>
            )}
            <p style={{ color: '#909090', fontSize: '0.875rem', margin: 0 }}>
              {total} {total === 1 ? 'post' : 'posts'}
            </p>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#909090' }}>
          <p style={{ fontSize: '3rem', marginBottom: '12px' }}>📂</p>
          <p>No posts in this category yet.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
          {page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => loadMore(page + 1)}
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