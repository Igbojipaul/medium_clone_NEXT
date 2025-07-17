"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import { Send, MessageCircle, X, Loader2 } from "lucide-react";

export default function CommentForm({
  slug,
  parentId = null,
  onSuccess,
  toggleLabel = "Add Comment",
  isNested = false,
}) {
  const [open, setOpen] = useState(toggleLabel === "Add Comment");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMainForm = toggleLabel === "Add Comment";

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    
    setError("");
    setIsSubmitting(true);
    
    try {
      const { data } = await api.post(`/api/posts/${slug}/comments/`, {
        body: body.trim(),
        parent: parentId,
      });      

      // On success, clear and notify parent
      setBody("");
      onSuccess();

      // Close reply forms after successful submission
      if (!isMainForm) {
        setOpen(false);
      }
    } catch (err) {
      const respData = err.response?.data;
      const msg =
        respData?.errors?.body?.join?.(" ") ||
        respData?.detail ||
        err.message ||
        "Failed to post comment";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setBody("");
    setError("");
  };

  // Reply button for nested comments
  if (!isMainForm && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-600 transition-colors font-medium"
      >
        <MessageCircle size={12} />
        <span>{toggleLabel}</span>
      </button>
    );
  }

  return (
    <div className={`${isMainForm ? '' : 'mt-3'}`}>
      {open && (
        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`w-full border border-gray-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none transition-all ${
                isNested ? 'bg-white' : 'bg-white'
              } ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
              rows={isNested ? 3 : isMainForm ? 4 : 3}
              placeholder={
                isMainForm 
                  ? "What are your thoughts on this post?" 
                  : "Write a reply..."
              }
              required
              disabled={isSubmitting}
            />
            
            {/* Character count */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {body.length}/500
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm flex items-center">
                <X size={14} className="mr-2" />
                {error}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={!body.trim() || isSubmitting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  !body.trim() || isSubmitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isMainForm
                      ? 'bg-gray-600 text-white hover:bg-gray-700 shadow-sm'
                      : 'bg-gray-600 text-white hover:bg-gray-700 shadow-sm'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                <span>{isSubmitting ? 'Posting...' : isMainForm ? 'Post Comment' : 'Post Reply'}</span>
              </button>

              {!isMainForm && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            {isMainForm && (
              <div className="text-xs text-gray-500">
                <span>Press </span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl</kbd>
                <span> + </span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd>
                <span> to post</span>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}