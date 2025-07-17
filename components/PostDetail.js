// components/PostDetail.jsx
"use client";

import { useRef, useState } from "react";
import api from "@/lib/api";
import {
  Heart,
  MessageCircle,
  Tag as TagIcon,
  Timer,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PostDetail({ post: initialPost, commentsCount }) {
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const isAuthor = currentUser?.username === post.author;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleEdit = () => {
    router.push(`/editor/${post.slug}`);
    setMenuOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/api/posts/${post.slug}/`);
      router.push("/"); // redirect after delete
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete post.");
    }
    setMenuOpen(false);
  };

  const toggleFavorite = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (post.favorited) {
        const { data } = await api.delete(`/api/posts/${post.slug}/favorite/`);
        setPost(data);
      } else {
        const { data } = await api.post(`/api/posts/${post.slug}/favorite/`);
        setPost(data);
      }
    } catch (err) {
      console.error("Favorite error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="relative max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
      {/* Author options menu */}
      {isAuthor && (
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1 rounded hover:bg-gray-200 text-gray-600"
            aria-label="Options"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit Post
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{post.title}</h1>

        {/* Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-gray-600">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <div className="flex items-center space-x-1">
              <UserIcon className="w-4 h-4" />
              <Link
                href={`/profile/${post.author}`}
                className="font-medium hover:underline"
              >
                {post.author}
              </Link>
            </div>
            <div className="flex items-center space-x-1">
              <Timer className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleFavorite}
              disabled={loading}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-transform duration-200 ${
                post.favorited
                  ? "bg-red-100 text-red-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              } ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
              aria-label={
                post.favorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                fill={`${post.favorited ? "red" : "transparent"}`}
                className={`w-5 h-5 cursor-pointer`}
              />
              <span className="text-sm">{post.favoritesCount}</span>
            </button>
            <button
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-transform duration-200 hover:scale-105"
              aria-label="Toggle comments"
            >
              <MessageCircle className="w-5 h-5 cursor-pointer" />
              <span className="text-sm">{commentsCount || 0}</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        {post.tagList && post.tagList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <TagIcon className="w-4 h-4 text-gray-500" />
            {post.tagList.map((tag, idx) => (
              <Link
                key={idx}
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full hover:bg-gray-300 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </header>

      {/* Attachments grid */}
      {post.attachments && post.attachments.length > 0 && (
        <section className="my-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Attachments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {post.attachments.map((att) => {
              // IMAGE
              if (att.attachment_type === "image" && att.file_url) {
                return (
                  <div
                    key={att.id}
                    className="rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src={att.file_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        quality={80}
                      />
                    </div>
                  </div>
                );
              }
              // EMBED (e.g. iframe/video)
              if (att.attachment_type === "embed" && att.embed_code) {
                return (
                  <div
                    key={att.id}
                    className="rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <div className="w-full aspect-video">
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: att.embed_code }}
                      />
                    </div>
                  </div>
                );
              }
              // OTHER
              return (
                <div
                  key={att.id}
                  className="p-4 rounded-lg bg-gray-100 text-gray-800 text-sm"
                >
                  <p>Attachment: {att.attachment_type}</p>
                  {att.url && (
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Body content */}
      <section className="prose prose-gray mx-auto mt-6">
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </section>
    </article>
  );
}
