"use client";
import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import {
  PlusCircle,
  Tag,
  Type,
  FileText,
  Send,
  X,
  Hash,
  Link,
  Trash2,
  ImageIcon,
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
      Loading editor...
    </div>
  ),
});
export default function NewPostPage() {
  const [form, setForm] = useState({ title: "", body: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const router = useRouter();

  // Handle editor content changes
  const handleEditorChange = (content) => {
    setForm((prev) => ({ ...prev, body: content }));
  };

  // Tags logic
  const addTag = (tag) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // Attachments logic
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAttachments((prev) => [
        ...prev,
        {
          type: "image",
          file,
          previewUrl,
          name: file.name,
        },
      ]);
    }
    e.target.value = "";
  };

  const handleAddEmbed = () => {
    const url = prompt("Enter embed URL or code snippet:");
    if (url) {
      setAttachments((prev) => [
        ...prev,
        {
          type: "embed",
          embedUrl: url,
          name: "Embedded Content",
        },
      ]);
    }
  };

  const removeAttachment = (index) => {
    const att = attachments[index];
    if (att.previewUrl) URL.revokeObjectURL(att.previewUrl);
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.body) {
      setError("Title and content are required.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: form.title.trim(),
      body: form.body,
      tags: tags,
    };

    try {
      // 1) Create post
      const { data } = await api.post("/api/posts/", payload);
      const slug = data.slug;

      // 2) Upload attachments
      for (const att of attachments) {
        const formData = new FormData();

        if (att.type === "image" && att.file) {
          formData.append("attachment_type", "image");
          formData.append("file", att.file);
        } else if (att.type === "embed" && att.embedUrl) {
          formData.append("attachment_type", "embed");
          formData.append("embed_code", att.embedUrl);
        }

        await api.post(`/api/posts/${slug}attachments/`, formData);
       
      }

      // Success
      toast.success("Post published successfully!", {
        description: "Your post is now live. Redirecting to your post...",
      });

      router.push(`/posts/${slug}`);
    } catch (err) {
      console.error("Publish error:", err);
      const resp = err.response?.data;
      setError(
        resp?.errors?.title?.join(" ") ||
          resp?.detail ||
          err.message ||
          "Failed to create post"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <PlusCircle className="h-6 w-6 text-white bg-gray-700 rounded-full p-1" />
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Post
            </h1>
          </div>
          <p className="text-gray-600">
            Share your thoughts with the community
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <X className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Type className="h-4 w-4" />
              Post Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter an engaging title..."
              className="w-full px-4 py-3 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 bg-white"
              required
            />
          </div>

          {/* Content Editor */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4" />
              Content
            </label>

            <RichTextEditor
              value={form.body}
              onChange={handleEditorChange}
              placeholder="Write your post content here..."
            />

            <p className="mt-2 text-sm text-gray-500">
              Use the toolbar to format text, add links, and embed images
            </p>
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
              onKeyDown={handleTagKeyPress}
              onBlur={() => tagInput && addTag(tagInput)}
              placeholder="Add tags (press Enter or comma)..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 bg-white"
            />
            <p className="mt-1 text-xs text-gray-500">
              Popular tags: react, javascript, tutorial...
            </p>
          </div>

          {/* Attachments for additional files */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="h-4 w-4" />
              Additional Attachments
            </label>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Use this section for supplemental files that should not appear
                directly in your post content
              </p>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {att.type === "image" && att.previewUrl ? (
                      <Image
                        src={att.previewUrl}
                        alt="preview"
                        width={50}
                        height={50}
                        className="object-cover rounded border border-gray-200"
                      />
                    ) : att.type === "embed" ? (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
                        <Link className="h-5 w-5 text-gray-600" />
                      </div>
                    ) : null}
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        {att.name}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {att.type === "image" ? "Image" : "Embedded Content"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <ImageIcon className="h-5 w-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  Add Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleAddEmbed}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Link className="h-5 w-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  Add Embed
                </span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-4">
            <div className="text-sm text-gray-500">
              {form.title ? (
                <span className="text-green-600 font-medium">
                  ✓ Ready to publish
                </span>
              ) : (
                <span>Fill in title to publish</span>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !form.title}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isSubmitting ? "Publishing..." : "Publish Post"}</span>
            </button>
          </div>
        </form>

        {/* Writing Tips */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">✨</span> Writing Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p>• Use clear, descriptive titles</p>
              <p>• Break content into paragraphs</p>
              <p>• Add relevant tags for discoverability</p>
            </div>
            <div>
              <p>• Use the editor toolbar for formatting</p>
              <p>• Embed images directly in your content</p>
              <p>• Keep it authentic and helpful</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
