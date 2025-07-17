"use client";

import React, { useState } from "react";
import CommentForm from "./CommentForm";
import { 
  MessageCircle, 
  ChevronDown, 
  ChevronRight, 
  User, 
  Clock,
  Heart,
  MoreHorizontal 
} from "lucide-react";

export default function CommentList({ comments, slug, onCommentAdded }) {
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [likedComments, setLikedComments] = useState(new Set());

  const toggleExpanded = (commentId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const toggleLike = (commentId) => {
    const newLiked = new Set(likedComments);
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedComments(newLiked);
  };

  const getChildComments = (parentId) => {
    return comments?.filter((c) => c.parent === parentId) || [];
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  const renderComment = (comment, level = 0) => {
    const childComments = getChildComments(comment.id);
    const hasReplies = childComments.length > 0;
    const isExpanded = expandedComments.has(comment.id);
    const isLiked = likedComments.has(comment.id);
    const isNested = level > 0;

    return (
      <div key={comment.id} className={`${isNested ? 'ml-8 mt-3' : 'mb-6'}`}>
        <div className={`group relative ${
          isNested 
            ? 'bg-gray-50 rounded-lg p-4 border-l-2 border-gray-200' 
            : 'bg-white rounded-lg border border-gray-100 p-6 hover:shadow-sm transition-shadow'
        }`}>
          {/* Comment Header */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {comment.author}
                </h4>
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock size={12} className="mr-1" />
                  <span>{formatTimeAgo(comment.created_at)}</span>
                </div>
              </div>

              {/* Comment Body */}
              <div className="text-gray-700 text-sm leading-relaxed mb-3">
                {comment.body}
              </div>

              {/* Comment Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleLike(comment.id)}
                  className={`flex items-center space-x-1 text-xs transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart 
                    size={14} 
                    fill={isLiked ? 'currentColor' : 'none'}
                    className="transition-all hover:scale-110" 
                  />
                  <span>{Math.floor(Math.random() * 10) + (isLiked ? 1 : 0)}</span>
                </button>

                <CommentForm
                  slug={slug}
                  parentId={comment.id}
                  onSuccess={onCommentAdded}
                  toggleLabel="Reply"
                  isNested={isNested}
                />

                {hasReplies && (
                  <button
                    onClick={() => toggleExpanded(comment.id)}
                    className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-700 font-medium"
                  >
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                    <span>
                      {childComments.length} {childComments.length === 1 ? 'reply' : 'replies'}
                    </span>
                  </button>
                )}

                <button className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nested Replies */}
        {hasReplies && isExpanded && (
          <div className="mt-3 space-y-3">
            {childComments.map((child) => renderComment(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const topLevelComments = comments?.filter((c) => !c.parent) || [];

  return (
    <section className="space-y-6" id="comments">
      {/* Main Comment Form */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Join the discussion</h3>
            <p className="text-gray-600 text-sm">Share your thoughts and engage with the community</p>
          </div>
        </div>
        <CommentForm slug={slug} onSuccess={onCommentAdded} />
      </div>

      {/* Comments List */}
      {topLevelComments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageCircle size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
          <p className="text-gray-600">Be the first to share your thoughts on this post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment) => renderComment(comment))}
        </div>
      )}

      {/* Load More Comments (if pagination is needed) */}
      {topLevelComments.length > 0 && (
        <div className="text-center pt-6">
          <button className="text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors">
            Load more comments
          </button>
        </div>
      )}
    </section>
  );
}