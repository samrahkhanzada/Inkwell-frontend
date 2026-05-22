import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
// import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from "react-icons/fi";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiEdit,
  FiBookOpen,
  FiChevronDown,
} from "react-icons/fi";

export default function Layout() {
  const { isDark, toggleTheme, colors } = useTheme();
  // const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
      setMenuOpen(false);
    }
  };

  const navLink = ({ isActive }) =>
    isActive ? { color: "#e85d04", fontWeight: "600" } : { color: "#737373" };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* ── Navbar ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: isDark
            ? "rgba(13,13,13,0.9)"
            : "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: isDark ? "1px solid #222" : "1px solid #efefef",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#e85d04",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiBookOpen color="white" size={16} />
            </div>
            <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: '700', fontSize: '1.25rem', color: colors.text }}>
  Inkwell
</span>
          </Link>

          {/* Desktop nav links */}
          <nav
            style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            className="hide-mobile"
          >
            <NavLink to="/" style={{ textDecoration: 'none', fontSize: '0.875rem', color: colors.textSecondary }}>Home</NavLink>
            <NavLink to="/search" style={{ textDecoration: 'none', fontSize: '0.875rem', color: colors.textSecondary }}>Explore</NavLink>
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Search bar — desktop */}
            <form onSubmit={handleSearch} className="hide-mobile search-bar" style={{
  display: 'flex', alignItems: 'center', gap: '8px',
  backgroundColor: '#f7f7f7', border: '1px solid #d9d9d9',
  borderRadius: '9999px', padding: '6px 14px',
}}>
              <FiSearch size={14} color="#909090" />
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search posts…"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "0.8125rem",
                  color: "#0d0d0d",
                  width: "150px",
                }}
              />
            </form>

            {user ? (
              <>
                {/* Write button */}
                <Link
                  to="/editor"
                  className="btn-primary hide-mobile"
                  style={{ gap: "6px", padding: "8px 16px" }}
                >
                  <FiEdit size={14} /> Write
                </Link>

                {/* User dropdown */}
                <div ref={dropRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setDropOpen((v) => !v)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      borderRadius: "12px",
                    }}
                  >
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e85d04&color=fff&size=80`
                      }
                      alt={user.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <FiChevronDown
                      size={14}
                      color="#737373"
                      style={{
                        transform: dropOpen ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>

                  {dropOpen && (
                    <div className="dropdown" style={{
  position: 'absolute', right: 0, top: '48px',
  width: '210px', backgroundColor: '#fff',
  border: '1px solid #efefef', borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  padding: '8px 0', zIndex: 100,
}}>
                      <div
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #efefef",
                        }}
                      >
                        <p style={{ fontWeight: '600', fontSize: '0.875rem', margin: 0, color: colors.text }}>{user.name}</p>
                        <p style={{ color: colors.textMuted, fontSize: '0.75rem', margin: '2px 0 0' }}>@{user.username}</p>
                      </div>
                      <DropItem
                        to={`/@${user.username}`}
                        icon={<FiUser size={14} />}
                        label="Profile"
                        onClick={() => setDropOpen(false)}
                      />
                      <DropItem
                        to="/dashboard"
                        icon={<FiBookOpen size={14} />}
                        label="Dashboard"
                        onClick={() => setDropOpen(false)}
                      />
                      <DropItem
                        to="/editor"
                        icon={<FiEdit size={14} />}
                        label="New Post"
                        onClick={() => setDropOpen(false)}
                      />
                      <hr style={{ margin: "6px 0", borderColor: "#efefef" }} />
                      <button
                        onClick={() => {
                          logout();
                          setDropOpen(false);
                          navigate("/");
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 16px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          color: "#ef4444",
                        }}
                      >
                        <FiLogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                style={{ display: "flex", gap: "8px" }}
                className="hide-mobile"
              >
                <Link
                  to="/login"
                  className="btn-secondary"
                  style={{ padding: "8px 16px", fontSize: "0.875rem" }}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{ padding: "8px 16px", fontSize: "0.875rem" }}
                >
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                background: "none",
                border: "1px solid",
                borderColor: isDark ? "#333" : "#d9d9d9",
                borderRadius: "9999px",
                cursor: "pointer",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8125rem",
                color: isDark ? "#f7f7f7" : "#404040",
                transition: "all 0.2s",
                backgroundColor: isDark ? "#1a1a1a" : "#f7f7f7",
              }}
            >
              {isDark ? (
                <FiSun size={15} color="#f48c06" />
              ) : (
                <FiMoon size={15} color="#404040" />
              )}
              {isDark ? "Light" : "Dark"}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
              }}
              className="show-mobile"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              borderTop: isDark ? "1px solid #222" : "1px solid #efefef",
              backgroundColor: isDark ? "#0d0d0d" : "#fff",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            >
              <FiSearch size={14} color="#909090" />
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search…"
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  fontSize: "0.875rem",
                }}
              />
            </form>
            <Link to="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: colors.text, fontSize: '0.875rem', fontWeight: '500' }}>Home</Link>
            <Link to="/search" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: colors.text, fontSize: '0.875rem', fontWeight: '500' }}>Explore</Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: "none",
                    color: "#404040",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to={`/@${user.username}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: "none",
                    color: "#404040",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  Profile
                </Link>
                <Link
                  to="/editor"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: "none",
                    color: "#e85d04",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  ✏️ Write
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#ef4444",
                    fontSize: "0.875rem",
                    padding: 0,
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "48px",
                  width: "210px",
                  backgroundColor: isDark ? "#1a1a1a" : "#fff",
                  border: isDark ? "1px solid #333" : "1px solid #efefef",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  padding: "8px 0",
                  zIndex: 100,
                }}
              >
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, textAlign: "center", padding: "10px" }}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary"
                  style={{ flex: 1, textAlign: "center", padding: "10px" }}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: isDark ? "1px solid #222" : "1px solid #efefef",
          backgroundColor: isDark ? "#0d0d0d" : "#fff",
          marginTop: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2.5rem 1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                backgroundColor: "#e85d04",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiBookOpen color="white" size={12} />
            </div>
            <span
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: "700",
                color: "#404040",
              }}
            >
              Inkwell
            </span>
          </div>
          <p style={{ color: "#909090", fontSize: "0.875rem", margin: 0 }}>
            © {new Date().getFullYear()} Inkwell. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link
              to="/"
              style={{
                color: "#909090",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Home
            </Link>
            <Link
              to="/search"
              style={{
                color: "#909090",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Explore
            </Link>
          </div>
        </div>
      </footer>

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function DropItem({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        textDecoration: "none",
        color: "#404040",
        fontSize: "0.875rem",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f7f7f7")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      <span style={{ color: "#909090" }}>{icon}</span> {label}
    </Link>
  );
}
