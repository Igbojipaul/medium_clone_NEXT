"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import PostDetail from "@/components/PostDetail";
import CommentList from "@/components/CommentList";
import { MessageCircle, AlertCircle, Loader2 } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function PostPage() {
  const { slug } = useParams();

  // 1) Post detail
  const { data: post, error: postErr, isLoading: postLoading } = useSWR(
    `/posts/${slug}/`,
    fetcher
  );

  // 2) Comments
  const {
    data: comments,
    error: commErr,
    mutate,
    isLoading: commentsLoading,
  } = useSWR(
    `/posts/${slug}/comments/`,
    fetcher
  );

  if (postErr) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Error Loading Post</h2>
          </div>
          <p className="text-gray-600 mb-4">
            We could not load this post. It might have been deleted or you do not have permission to view it.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (postLoading || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Post Loading Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="animate-pulse">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          
          {/* Comments Loading Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const commentsCount = comments?.count || comments?.results?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Post Detail */}
        <PostDetail post={post} commentsCount={commentsCount} />

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm mt-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Discussion ({commentsCount})
              </h2>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              Join the conversation and share your thoughts
            </p>
          </div>

          <div className="p-6">
            {/* Comments Error State */}
            {commErr && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="text-red-500 mr-3" size={20} />
                  <div>
                    <h3 className="text-red-800 font-medium">Failed to load comments</h3>
                    <p className="text-red-600 text-sm">Please refresh the page to try again.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Loading State */}
            {commentsLoading && !comments && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-gray-600 mr-3" size={20} />
                <span className="text-gray-600">Loading comments...</span>
              </div>
            )}

            {/* Comments List */}
            {!commErr && (
              <CommentList
                comments={comments?.results || []}
                slug={slug}
                onCommentAdded={() => mutate()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}