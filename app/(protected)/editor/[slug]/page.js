"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Type, 
  FileText, 
  Hash, 
  X, 
  Eye, 
  Edit3, 
  Tag, 
  Save,
  ImageIcon,
  Link,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
      Loading editor...
    </div>
  ),
});

export default function EditPostPage() {
  const { slug } = useParams();
  const router = useRouter();

  // form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");

  // load existing post
  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load post");
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setBody(data.body);
        setTags(data.tagList || []);
      })
      .catch(() => {
        toast.error("Failed to load post.");
        router.push("/feed");
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  // tag helpers
  const addTag = (raw) => {
    const t = raw.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((ts) => [...ts, t]);
    setTagInput("");
  };
  const removeTag = (t) => setTags((ts) => ts.filter((x) => x !== t));
  const onTagKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Handle editor content changes
  const handleEditorChange = (content) => {
    setBody(content);
  };

  // submit updated post
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !body) {
      setError("Title and content are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: title.trim(), body, tags }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Update failed");
      }
      const updated = await res.json();
      toast.success("Post updated successfully!", {
        description: "Your changes have been saved. Redirecting to your post...",
      });
      router.push(`/posts/${updated.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Edit3 className="h-6 w-6 text-white bg-gray-700 rounded-full p-1" />
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Post
            </h1>
          </div>
          <p className="text-gray-600">
            Update your post content and settings
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <X className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Title */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Type className="h-4 w-4" />
              Post Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              className="w-full px-4 py-3 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 bg-white"
              required
            />
          </div>

          {/* Body / Preview */}
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4" />
                Content
              </label>
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4" />
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
            
            {!preview ? (
              <div>
                <RichTextEditor 
                  value={body} 
                  onChange={handleEditorChange}
                  placeholder="Write your post content here..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Use the toolbar to format text, add links, and embed images
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl bg-white">
                <div 
                  className="prose max-w-none p-6"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4" />
              Tags
            </label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    <Hash className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-indigo-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKey}
              onBlur={() => tagInput && addTag(tagInput)}
              placeholder="Add tags (press Enter or comma)..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 bg-white"
            />
            <p className="mt-1 text-xs text-gray-500">
              Popular tags: react, javascript, tutorial...
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-4">
            <div className="text-sm text-gray-500">
              {title ? (
                <span className="text-green-600 font-medium">
                  ✓ Ready to update
                </span>
              ) : (
                <span>Fill in title to update</span>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting || !title}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{submitting ? "Updating..." : "Update Post"}</span>
            </button>
          </div>
        </form>

        {/* Editing Tips */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">💡</span> Editing Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p>• Use the preview feature to see changes</p>
              <p>• Update tags to improve discoverability</p>
              <p>• Keep your title clear and engaging</p>
            </div>
            <div>
              <p>• Format content for better readability</p>
              <p>• Consider adding new relevant information</p>
              <p>• Save frequently to avoid losing changes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}