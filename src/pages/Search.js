import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import PostCard from '../components/blog/PostCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q        = searchParams.get('q')        || '';
  const catParam = searchParams.get('category') || '';
  const tagParam = searchParams.get('tag')      || '';

  const [posts,      setPosts]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query,      setQuery]      = useState(q);
  const [selCat,     setSelCat]     = useState(catParam);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    fetchPosts(1);
    setPage(1);
  }, [q, catParam, tagParam]);

  const fetchPosts = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 12 });
      if (q)        params.append('search',   q);
      if (catParam) params.append('category', catParam);
      if (tagParam) params.append('tag',      tagParam);
      const { data } = await api.get(`/posts?${params}`);
      setPosts(data.posts);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (query.trim()) p.set('q', query.trim());
    else p.delete('q');
    if (selCat) p.set('category', selCat);
    else p.delete('category');
    setSearchParams(p);
  };

  const clearFilter = (key) => {
    const p = new URLSearchParams(searchParams);
    p.delete(key);
    setSearchParams(p);
    if (key === 'category') setSelCat('');
    if (key === 'q')        setQuery('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

      {/* Search bar */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontWeight: '700', color: '#0d0d0d', marginBottom: '20px' }}>
          {q ? `Results for "${q}"` : 'Explore stories'}
        </h1>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <FiSearch size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#909090' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, topics, authors…"
              className="input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilter((v) => !v)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}
          >
            <FiFilter size={14} /> Filters
          </button>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
            Search
          </button>
        </form>

        {/* Filters panel */}
        {showFilter && (
          <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#fff', border: '1px solid #efefef', borderRadius: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: '500', color: '#404040', display: 'block', marginBottom: '4px' }}>Category</label>
              <select
                value={selCat}
                onChange={(e) => setSelCat(e.target.value)}
                className="input"
                style={{ width: 'auto', fontSize: '0.875rem', padding: '7px 12px' }}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active filters */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          {q && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e85d04', color: '#fff', fontSize: '0.8125rem', padding: '4px 12px', borderRadius: '9999px' }}>
              "{q}"
              <button onClick={() => clearFilter('q')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', padding: 0 }}>
                <FiX size={12} />
              </button>
            </span>
          )}
          {catParam && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#efefef', color: '#404040', fontSize: '0.8125rem', padding: '4px 12px', borderRadius: '9999px' }}>
              {categories.find((c) => c._id === catParam)?.name || 'Category'}
              <button onClick={() => clearFilter('category')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#909090', display: 'flex', padding: 0 }}>
                <FiX size={12} />
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p style={{ fontSize: '0.875rem', color: '#737373', marginBottom: '24px' }}>
          {total} {total === 1 ? 'post' : 'posts'} found
        </p>
      )}

      {/* Results grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card" style={{ padding: '20px' }}>
              <div style={{ height: '160px', backgroundColor: '#efefef', borderRadius: '10px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '16px', backgroundColor: '#efefef', borderRadius: '4px', marginBottom: '8px', width: '75%' }} />
              <div style={{ height: '14px', backgroundColor: '#efefef', borderRadius: '4px', width: '50%' }} />
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#909090' }}>
          <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</p>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#404040', marginBottom: '8px' }}>No posts found</p>
          <p>Try a different search term or browse all stories</p>
          <Link to="/search" className="btn-secondary" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 24px' }}>
            Clear search
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); fetchPosts(i + 1); }}
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
        </>
      )}
    </div>
  );
}