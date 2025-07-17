"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import Image from "next/image";
import PostCardSkeleton from "./PostCardSkeleton";
import { toast } from "sonner";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function PostCard({ post, setLoadingSpinner }) {
  const [favorited, setFavorited] = useState(post.favorited);
  const [count, setCount] = useState(post.favoritesCount);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const isAuthor = currentUser?.username === post.author;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleEdit = () => {
    router.push(`/editor/${post.slug}`);
    setMenuOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      setLoadingSpinner(true);
      await api.delete(`/api/posts/${post.slug}/`);
      window.location.reload();
      setLoadingSpinner(false);
      toast.success("Post deleted successfully.");
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error("Failed to delete post.");
    }
    setMenuOpen(false);
  };

  // Fetch comments count
  const { data: commentsData } = useSWR(
    `/api/posts/${post.slug}/comments/`,
    fetcher
  );
  const commentsCount = commentsData?.count || 0;

  const toggleFavorite = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (favorited) {
        await api.delete(`/api/posts/${post.slug}/favorite/`);
        setFavorited(false);
        setCount((c) => c - 1);
      } else {
        await api.post(`/api/posts/${post.slug}/favorite/`);
        setFavorited(true);
        setCount((c) => c + 1);
      }
    } catch (err) {
      // optional error feedback
      console.error("favourite failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const {
    data: authorProfile,
    error: profErr,
    mutate: mutateProfile,
  } = useSWR(`/api/profiles/${post.author}/`, fetcher);

  if (!authorProfile) {
    return <PostCardSkeleton />;
  }

  return (
    <article className="border-b relative border-gray-100 py-8 last:border-0 group hover:bg-gray-50 transition-colors duration-300 rounded-lg px-4">
      {isAuthor && (
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1 rounded hover:bg-gray-200 text-blue"
            aria-label="Options"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
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

      <div className="flex flex-col md:flex-row gap-6 ">
        {/* Content */}
        <div className="flex-1">
          {/* Author and Date */}
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/profile/${post.author}`} className="flex-shrink-0">
              {authorProfile.image ? (
                // <Image
                //   src={
                //     authorProfile.image.startsWith("http")
                //       ? authorProfile.image
                //       : `${API_BASE}${authorProfile.image}`
                //   }
                //   alt={post.author}
                //   width={32}
                //   height={32}
                //   className="w-8 h-8 rounded-full object-cover"
                // />
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-500 flex items-center justify-center text-white font-medium">
                  {post.author.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-500 flex items-center justify-center text-white font-medium">
                  {post.author.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <div className="text-sm text-gray-600">
              <Link
                href={`/profile/${post.author}`}
                className="font-medium text-gray-900 hover:underline"
              >
                {post.author}
              </Link>
              <span className="mx-1">•</span>
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-gray-400" />
                {formatRelativeTime(post.created_at)}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-3 group-hover:text-gray-600 transition-colors wrap-anywhere">
            <Link href={`/posts/${post.slug}`} className="hover:underline wrap-anywhere">
              {post?.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <div className="text-gray-700 mb-4 line-clamp-2">
            {" "}
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </div>

          {/* Footer */}
          <div className="flex flex-wrap justify-between items-center gap-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tagList.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-gray-600">
              <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`flex items-center gap-1 group ${
                  favorited ? "text-red-500" : "hover:text-red-500"
                } transition-colors`}
              >
                <Heart
                  size={18}
                  fill={favorited ? "currentColor" : "transparent"}
                  className={`transition-colors ${loading ? "opacity-70" : ""}`}
                />
                <span className="text-sm">{count}</span>
              </button>

              <Link
                href={`/posts/${post.slug}#comments`}
                className="flex items-center gap-1 hover:text-gray-600 transition-colors"
              >
                <MessageCircle size={18} />
                <span className="text-sm">{commentsCount}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Image Placeholder - Add if your posts have images */}
        {post.image && (
          <div className="md:w-40 flex-shrink-0">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40" />
          </div>
        )}
      </div>
    </article>
  );
}