"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Hash, PlusCircle, Tag, Tags, Type, X } from "lucide-react";
import { toast } from "sonner";

export default function EditPostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", tags: "" });
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const textareaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);

  const wordCount = form.body
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = form.body.length;

  // Load existing post
  useEffect(() => {
    api
      .get(`/posts/${slug}/`)
      .then(({ data }) => {
        console.log(data);

        setForm({
          title: data.title,
          body: data.body,
        });
        setTags(data.tagList);
      })
      .catch((e) => {
        setError("Failed to load post: ");
        router.push("/feed");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      title: form.title,
      body: form.body,
      tags: tags
        .map((t) => t.trim())
        .filter((t) => t),
    };
    try {
      const { data } = await api.put(`/posts/${slug}/`, payload);
      toast("Post edited successfully", {
        description: `your post was edited on ${new Date.now()}`
      })
      router.push(`/posts/${data.slug}`);
    } catch (err) {
      const resp = err.response?.data;
      setError(
        resp?.errors?.title?.join(" ") ||
          resp?.detail ||
          err.message ||
          "Failed to update post"
      );
    }
  };

  const addTag = (tag) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };


  if (loading) {
    return <div className="p-8 text-center">Loading post…</div>;
  }

  return (
    <main className="pb-20">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-GRAY-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Edit Post
              </h1>
            </div>
            <p className="text-gray-600">
              Share your thoughts with the community
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <X className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Type className="h-4 w-4" />
                Post Title
              </label>
              <div className="relative">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title..."
                  className="w-full px-4 py-3 text-lg border outline-0 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm group-hover:shadow-md"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-500/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  Content
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">
                    {wordCount} words • {charCount} characters
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    {isPreview ? "Edit" : "Preview"}
                  </button>
                </div>
              </div>

              <div className="relative">
                {!isPreview ? (
                  <textarea
                    ref={textareaRef}
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    placeholder="Write your post content here... Use markdown for formatting!"
                    rows={12}
                    className="w-full px-4 py-3 outline-0 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none group-hover:shadow-md"
                    required
                  />
                ) : (
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm min-h-[300px]">
                    <div className="prose prose-sm max-w-none">
                      {form.body ? (
                        <div className="whitespace-pre-wrap">{form.body}</div>
                      ) : (
                        <p className="text-gray-400 italic">
                          Nothing to preview yet...
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4" />
                Tags
              </label>

              {/* Tag Display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-100 to-gray-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      <Hash className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Tag Input */}
              <div className="relative">
                <input
                  value={tagInput}
                  name="tags"
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    handleChange(e);
                  }}
                  onKeyDown={handleTagKeyPress}
                  onBlur={() => tagInput && addTag(tagInput)}
                  placeholder="Add tags (press Enter or comma to add)..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm group-hover:shadow-md"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Popular tags: react, javascript, tutorial, beginner, advanced
              </p>
            </div>
            <Button type="submit">Update Post</Button>
          </form>
        </div>
      </div>
    </main>
  );
}
