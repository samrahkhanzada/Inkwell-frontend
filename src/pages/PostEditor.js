import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useTheme } from '../context/ThemeContext';
import uploadImage from "../utils/uploadImage";
import { DefaultEditor } from "react-simple-wysiwyg";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from '@uiw/react-quill-new';
// import '@uiw/react-quill-new/dist/quill.snow.css';

import api from "../utils/api";
import {
  FiSave,
  FiImage,
  FiTag,
  FiCalendar,
  FiX,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";

const STATUSES = ["draft", "published", "scheduled"];

export default function PostEditor() {
  const { id } = useParams();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    featuredImage: "",
    featuredImagePublicId: "",
    category: "",
    tags: [],
    scheduledAt: "",
    isFeatured: false,
    allowComments: true,
    metaTitle: "",
    metaDescription: "",
  });

  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEdit);
  const fileRef = useRef(null);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories));
    api.get("/tags").then(({ data }) => setAllTags(data.tags));

    if (isEdit) {
      api
        .get("/posts/dashboard/my?limit=100")
        .then(({ data }) => {
          const post = data.posts.find((p) => p._id === id);
          if (!post) {
            toast.error("Post not found");
            navigate("/dashboard");
            return;
          }
          setForm({
            title: post.title || "",
            content: post.content || "",
            excerpt: post.excerpt || "",
            status: post.status || "draft",
            featuredImage: post.featuredImage || "",
            featuredImagePublicId: post.featuredImagePublicId || "",
            category: post.category?._id || "",
            tags: post.tags?.map((t) => t._id) || [],
            scheduledAt: post.scheduledAt
              ? new Date(post.scheduledAt).toISOString().slice(0, 16)
              : "",
            isFeatured: post.isFeatured || false,
            allowComments: post.allowComments !== false,
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
          });
        })
        .catch(() => {
          toast.error("Failed to load post");
          navigate("/dashboard");
        })
        .finally(() => setLoadingPost(false));
    }
  }, [id]);

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  // const handleImageUpload = async (file) => {
  //   if (!file) return;
  //   setImgUploading(true);
  //   const fd = new FormData();
  //   fd.append('image', file);
  //   try {
  //     const { data } = await api.post('/posts/upload/featured-image', fd, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  //     set('featuredImage', data.url);
  //     set('featuredImagePublicId', data.publicId);
  //     toast.success('Image uploaded!');
  //   } catch {
  //     toast.error('Image upload failed');
  //   } finally {
  //     setImgUploading(false);
  //   }
  // };//============

  const handleImageUpload = async (file) => {
    if (!file) return;
    setImgUploading(true);
    try {
      const result = await uploadImage(file);
      set("featuredImage", result.url);
      set("featuredImagePublicId", result.publicId);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed. Check your Cloudinary preset.");
    } finally {
      setImgUploading(false);
    }
  };

  const addTag = async () => {
    const name = tagInput.trim().toLowerCase();
    if (!name) return;
    try {
      let tag = allTags.find((t) => t.name === name);
      if (!tag) {
        const { data } = await api.post("/tags", { name });
        tag = data.tag;
        setAllTags((prev) => [...prev, tag]);
      }
      if (!form.tags.includes(tag._id)) {
        set("tags", [...form.tags, tag._id]);
      }
      setTagInput("");
    } catch {
      toast.error("Failed to add tag");
    }
  };

  const removeTag = (tagId) =>
    set(
      "tags",
      form.tags.filter((t) => t !== tagId),
    );

  const handleSave = async (statusOverride) => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.content || form.content === "<p><br></p>")
      return toast.error("Content is required");
    if (form.status === "scheduled" && !form.scheduledAt)
      return toast.error("Please set a scheduled date");
    setSaving(true);
    try {
      const payload = { ...form, status: statusOverride || form.status };

      // Remove empty fields so MongoDB doesn't reject them
      if (!payload.category) delete payload.category;
      if (!payload.scheduledAt) delete payload.scheduledAt;
      if (payload.tags && payload.tags.length === 0) delete payload.tags;
      if (isEdit) await api.put(`/posts/${id}`, payload);
      else await api.post("/posts", payload);
      toast.success(isEdit ? "Post updated!" : "Post saved!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  if (loadingPost) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #d9d9d9",
            borderTop: "4px solid #e85d04",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', backgroundColor: colors.bg, minHeight: '100vh' }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              color: "#737373",
              display: "flex",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#efefef")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', fontWeight: '700', margin: 0, color: colors.text }}>
  {isEdit ? 'Edit post' : 'New post'}
</h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="input"
            style={{ width: "auto", padding: "8px 12px", fontSize: "0.875rem" }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              fontSize: "0.875rem",
            }}
          >
            <FiSave size={14} />
            {saving ? "Saving…" : "Save draft"}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="btn-primary"
            style={{ padding: "8px 16px", fontSize: "0.875rem" }}
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "32px",
        }}
        className="editor-grid"
      >
        {/* Main editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Title */}
          <input
  value={form.title}
  onChange={(e) => set('title', e.target.value)}
  placeholder="Post title…"
  style={{
    width: '100%', fontSize: '1.75rem',
    fontFamily: '"Playfair Display", serif', fontWeight: '700',
    border: 'none', borderBottom: `2px solid ${colors.border}`,
    outline: 'none', paddingBottom: '12px',
    backgroundColor: 'transparent',
    color: colors.text,
    transition: 'border-color 0.2s',
  }}
  onFocus={(e) => e.target.style.borderBottomColor = '#e85d04'}
  onBlur={(e) => e.target.style.borderBottomColor = colors.border}
/>
          {/* Rich text editor */}

          {/* <div style={{ border: '1px solid #d9d9d9', borderRadius: '8px', overflow: 'hidden' }}>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(v) => set('content', v)}
              modules={quillModules}
              placeholder="Write your story…"
            />
          </div> */}

          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <DefaultEditor
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write your story…"
              style={{
                minHeight: "300px",
                fontSize: "1rem",
                fontFamily: '"DM Sans", sans-serif',
              }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#404040",
                marginBottom: "6px",
              }}
            >
              Excerpt{" "}
              <span style={{ color: "#909090", fontWeight: "400" }}>
                (optional)
              </span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Short summary shown in post previews…"
              className="input"
              style={{ resize: "none" }}
            />
          </div>

          {/* SEO */}
          <div>
            <button
              type="button"
              onClick={() => setShowSeo((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#e85d04",
                fontSize: "0.875rem",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {showSeo ? "▾" : "▸"} SEO / Meta settings
            </button>
            {showSeo && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "16px",
                  backgroundColor: "#f7f7f7",
                  borderRadius: "12px",
                  border: "1px solid #efefef",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8125rem",
                      fontWeight: "500",
                      color: "#404040",
                      marginBottom: "4px",
                    }}
                  >
                    Meta title ({form.metaTitle.length}/70)
                  </label>
                  <input
                    value={form.metaTitle}
                    onChange={(e) => set("metaTitle", e.target.value)}
                    maxLength={70}
                    className="input"
                    style={{ fontSize: "0.875rem" }}
                    placeholder={form.title}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8125rem",
                      fontWeight: "500",
                      color: "#404040",
                      marginBottom: "4px",
                    }}
                  >
                    Meta description ({form.metaDescription.length}/160)
                  </label>
                  <textarea
                    value={form.metaDescription}
                    onChange={(e) => set("metaDescription", e.target.value)}
                    rows={2}
                    maxLength={160}
                    className="input"
                    style={{ resize: "none", fontSize: "0.875rem" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Featured image */}
          <div className="card" style={{ padding: "16px" }}>
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#404040",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FiImage size={14} /> Featured image
            </h3>
            {form.featuredImage ? (
              <div
                style={{
                  position: "relative",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={form.featuredImage}
                  alt=""
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <button
                  onClick={() => {
                    set("featuredImage", "");
                    set("featuredImagePublicId", "");
                  }}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: "2px dashed #d9d9d9",
                  borderRadius: "10px",
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#909090",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#e85d04")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#d9d9d9")
                }
              >
                {imgUploading ? (
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      animation: "pulse 1.5s infinite",
                    }}
                  >
                    Uploading…
                  </p>
                ) : (
                  <>
                    <FiImage size={24} style={{ marginBottom: "8px" }} />
                    <p style={{ fontSize: "0.8125rem", margin: 0 }}>
                      Click to upload
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        margin: "4px 0 0",
                        color: "#b3b3b3",
                      }}
                    >
                      JPG, PNG, WebP
                    </p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
          </div>

          {/* Category */}
          <div className="card" style={{ padding: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#404040",
                marginBottom: "8px",
              }}
            >
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="input"
              style={{ fontSize: "0.875rem" }}
            >
              <option value="">— Uncategorized —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="card" style={{ padding: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#404040",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FiTag size={13} /> Tags
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag & press Enter…"
                className="input"
                style={{ flex: 1, fontSize: "0.8125rem", padding: "8px 12px" }}
              />
              <button
                onClick={addTag}
                className="btn-secondary"
                style={{ padding: "8px 10px" }}
              >
                <FiPlus size={14} />
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {form.tags.map((tid) => {
                const t = allTags.find((x) => x._id === tid);
                return t ? (
                  <span
                    key={tid}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "#efefef",
                      color: "#404040",
                      fontSize: "0.75rem",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                    }}
                  >
                    #{t.name}
                    <button
                      onClick={() => removeTag(tid)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#909090",
                        padding: 0,
                        display: "flex",
                      }}
                    >
                      <FiX size={10} />
                    </button>
                  </span>
                ) : null;
              })}
              {form.tags.length === 0 && (
                <p
                  style={{ fontSize: "0.8125rem", color: "#b3b3b3", margin: 0 }}
                >
                  No tags added yet
                </p>
              )}
            </div>
          </div>

          {/* Schedule */}
          {form.status === "scheduled" && (
            <div className="card" style={{ padding: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#404040",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FiCalendar size={13} /> Schedule publish
              </label>
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => set("scheduledAt", e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="input"
                style={{ fontSize: "0.875rem" }}
              />
            </div>
          )}

          {/* Options */}
          <div className="card" style={{ padding: "16px" }}>
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#404040",
                marginBottom: "12px",
              }}
            >
              Options
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => set("isFeatured", e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "#e85d04",
                  }}
                />
                <span style={{ fontSize: "0.875rem", color: "#404040" }}>
                  Mark as featured
                </span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.allowComments}
                  onChange={(e) => set("allowComments", e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    accentColor: "#e85d04",
                  }}
                />
                <span style={{ fontSize: "0.875rem", color: "#404040" }}>
                  Allow comments
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 768px) {
          .editor-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
