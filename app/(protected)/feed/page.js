"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import PostCard from "@/components/PostCard";
import TagSidebar from "@/components/TagSidebar";
import PostCardSkeleton from "@/components/PostCardSkeleton";
import api from "@/lib/api";
import { Globe, Users, Filter, Search as SearchIcon } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function FeedPage() {
  const limit = 10;
  const [feedType, setFeedType] = useState("global"); // "global" or "your"
  const [selectedTag, setSelectedTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // Debounce searchQuery:
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 500);
    return () => clearTimeout(h);
  }, [searchQuery]);

  // SWR Infinite key generator
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.results.length === 0) return null;
    const offset = pageIndex * limit;
    let url;
    if (feedType === "your") {
      url = `/posts/feed?limit=${limit}&offset=${offset}`;
    } else {
      url = `/posts?limit=${limit}&offset=${offset}`;
      if (selectedTag) {
        url += `&tag=${encodeURIComponent(selectedTag)}`;
      }
      if (debouncedSearch) {
        url += `&search=${encodeURIComponent(debouncedSearch)}`;
      }
    }
    return url;
  };

  const {
    data: pages,
    error,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
  });

  const posts = pages ? pages.flatMap((p) => p.results) : [];
  const isLoadingInitial = !pages && !error;
  const isLoadingMore =
    isLoadingInitial ||
    (size > 0 && pages && typeof pages[size - 1] === "undefined");
  const lastPage = pages ? pages[pages.length - 1] : null;
  const hasNextPage = lastPage ? Boolean(lastPage.next) : false;

  // infinite scroll observer
  const loadMoreRef = useRef(null);
  const observer = useRef();
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isLoadingMore) {
        setSize(size + 1);
      }
    },
    [hasNextPage, isLoadingMore, size, setSize]
  );
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });
    observer.current.observe(el);
    return () => {
      if (observer.current && el) observer.current.unobserve(el);
    };
  }, [handleObserver]);

  // reset when feedType, selectedTag, or debouncedSearch changes
  useEffect(() => {
    setSize(1);
  }, [feedType, selectedTag, debouncedSearch, setSize]);

  const handleFeedSwitch = (type) => {
    setFeedType(type);
    setSelectedTag("");
    setSearchQuery("");
  };
  const handleTagSelect = (tag) => {
    setSelectedTag((prev) => (prev === tag ? "" : tag));
    // clear search when selecting a tag? optional
    // setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Stories
          </h1>
          <p className="text-gray-600 mb-4">
            Explore articles from writers around the world
          </p>
          {/* Search input */}
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {isLoadingInitial && (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-1 max-w-4xl">
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-64 mt-2"></div>
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </main>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 max-w-4xl">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleFeedSwitch("global")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                      feedType === "global"
                        ? "bg-white text-gray-800 shadow-sm font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Globe size={18} />
                    <span>Global Feed</span>
                  </button>
                  <button
                    onClick={() => handleFeedSwitch("your")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                      feedType === "your"
                        ? "bg-white text-gray-800 shadow-sm font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Users size={18} />
                    <span>Your Feed</span>
                  </button>
                </div>
                {feedType === "global" && selectedTag && (
                  <div className="flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm">
                    <Filter size={16} />
                    <span>
                      Filtered by: <strong>{selectedTag}</strong>
                    </span>
                    <button
                      onClick={() => handleTagSelect(selectedTag)}
                      className="ml-1 text-gray-800 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center">
                  <div className="text-red-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Failed to load posts
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Please try refreshing or check your connection.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {posts.length === 0 && !isLoadingMore && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 mb-4">
                  {debouncedSearch
                    ? `No posts match "${debouncedSearch}".`
                    : selectedTag
                    ? `No posts found with "${selectedTag}".`
                    : feedType === "your"
                    ? "Follow authors to see their posts."
                    : "Be the first to write a post!"}
                </p>
                {debouncedSearch && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            {isLoadingMore && (
              <div className="mt-6">
                {[...Array(2)].map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            )}

            <div ref={loadMoreRef} className="h-1"></div>
          </main>

          {feedType === "global" && (
            <aside className="hidden lg:block lg:w-80">
              <TagSidebar
                selectedTag={selectedTag}
                onTagSelect={handleTagSelect}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
